import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { FormsModule } from '@angular/forms'; // Módulo para formularios en Angular
import { AuthService } from '../../services/auth.service'; // Servicio de autenticación
import { TokenService } from '../../services/token.service'; // Servicio para manejar el token
import { InformacionOrdenDTO } from '../../dto/orden/informacion-orden-dto'; // DTO que contiene la información de una orden
import { IdOrdenDTO } from '../../dto/orden/id-orden-dto'; // DTO que contiene el ID de la orden
import { Router } from '@angular/router'; // Para la navegación entre rutas

@Component({
  selector: 'app-orden', // Selector del componente para usar en la plantilla
  standalone: true, // Indica que este componente es autónomo
  imports: [CommonModule, FormsModule], // Importación de módulos necesarios para este componente
  templateUrl: './orden.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./orden.component.scss'] // Ruta al archivo de estilos SCSS
})
export class OrdenComponent {
  ordenes: InformacionOrdenDTO[] = []; // Lista de órdenes del usuario
  ordenSeleccionada: string | null = null; // ID de la orden seleccionada o null si ninguna está seleccionada

  // Constructor que inyecta los servicios necesarios y obtiene las órdenes del usuario
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {
    this.obtenerOrdenesUsuario(this.tokenService.getIDCuenta()); // Obtiene las órdenes del usuario al iniciar el componente
  }
  
  // Función para navegar a la página de inicio
  navigateToHome(): void {
    this.router.navigate(['/home']); // Redirige a la página principal
  }

  // Función para obtener las órdenes del usuario a partir de su ID
  obtenerOrdenesUsuario(idUsuario: string): void {
    this.authService.obtenerOrdenesUsuario(idUsuario).subscribe(ordenes => {
      this.ordenes = ordenes.respuesta; // Almacena las órdenes obtenidas en la propiedad "ordenes"
      console.log("Detalles completos de órdenes:", this.ordenes); // Muestra los detalles completos de las órdenes en consola
      console.log("Cantidades en items:", 
        this.ordenes.flatMap(o => o.items.map(i => `${i.nombre}: ${i.cantidad}`))); // Muestra las cantidades de los ítems en consola
    });
  }

  // Función para seleccionar o deseleccionar una orden
  seleccionarOrden(ordenId: string): void {
    this.ordenSeleccionada = this.ordenSeleccionada === ordenId ? null : ordenId; // Si la orden ya está seleccionada, la deselecciona
  }

  // Función para obtener la orden seleccionada
  getOrdenSeleccionada(): InformacionOrdenDTO {
    const orden = this.ordenes.find(o => o.idOrden === this.ordenSeleccionada); // Busca la orden por ID
    if (!orden) {
      throw new Error('Orden seleccionada no encontrada'); // Lanza error si no se encuentra la orden
    }
    return orden; // Retorna la orden encontrada
  }

  // Función para redirigir a la página de pago con el ID de la orden
  redirigirAPago(idOrden: string): void {
    this.router.navigate(['/pago', idOrden]); // Redirige a la ruta de pago con el ID de la orden
  }

  // Función para mostrar el detalle de una orden
  verDetalleOrden(ordenId: string): void {
    const orden = this.ordenes.find(o => o.idOrden === ordenId); // Busca la orden por ID
    if (orden) {
      console.log('Mostrando detalles de la orden:', orden); // Muestra los detalles de la orden en consola
      alert(`Mostrando detalles de la orden #${ordenId.slice(-6).toUpperCase()}`); // Muestra una alerta con los detalles de la orden
    }
  }

  // Función para calcular el subtotal de los ítems en una orden
  calcularSubtotal(orden: InformacionOrdenDTO): number {
    return orden.items.reduce((subtotal, item) => subtotal + (item.precio * item.cantidad), 0); // Suma el precio por cantidad de cada ítem
  }
}
