import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InformacionCuponDTO } from '../../dto/cupon/informacion-cupon-dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ObtenerCuponDTO } from '../../dto/cupon/obtener-cupon-dto';

@Component({
  selector: 'app-cupones', // Nombre del componente para usar en plantillas HTML
  standalone: true, // Permite que este componente funcione de forma independiente
  imports: [CommonModule], // Módulos necesarios para usar directivas como *ngIf, *ngFor, etc.
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent implements OnInit {
  // Lista completa de cupones obtenida desde el backend
  cupones: ObtenerCuponDTO[] = [];

  // Lista de cupones filtrada según criterios de búsqueda
  cuponesFiltrados: InformacionCuponDTO[] = [];

  // Inyección de servicios: AuthService para lógica de negocio y Router para navegación
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarCupones(); // Carga inicial de los cupones desde el backend
  }

  /**
   * Convierte una fecha representada como arreglo [año, mes, día, hora, minuto]
   * en un objeto Date de JavaScript
   */
  convertirFecha(fecha: number[] | null | undefined): Date | null {
    if (!Array.isArray(fecha) || fecha.length < 5) {
      return null; // Verifica que sea un arreglo válido
    }

    const [anio, mes, dia, hora, minuto] = fecha;
    return new Date(anio, mes - 1, dia, hora, minuto); // Se ajusta el mes (0 indexado)
  }

  /**
   * Llama al backend para obtener los cupones, los guarda y transforma fechas
   */
  cargarCupones(): void {
    this.authService.obtenerCupones().subscribe({
      next: (data) => {
        // Mapear y convertir fechas de vencimiento al formato Date
        this.cupones = data.respuesta.map((cupon: any) => ({
          ...cupon,
          fechaVencimiento: this.convertirFecha(cupon.fechaVencimiento)
        }));
        this.cuponesFiltrados = [...this.cupones]; // Inicialmente se muestran todos
        console.log(this.cupones); // Para depuración
      },
      error: (error) => {
        console.error('Error al cargar cupones:', error);
        Swal.fire('Error', 'No se pudieron cargar los cupones', 'error');
      }
    });
  }

  /**
   * Filtra los cupones según el texto ingresado y el estado seleccionado
   * @param termino Texto para buscar por código o nombre
   * @param estado Estado a filtrar (DISPONIBLE o NO_DISPONIBLE)
   */
  filtrarCupones(termino: string = '', estado: string = ''): void {
    termino = termino.toLowerCase(); // Convertir a minúsculas para búsqueda insensible
    this.cuponesFiltrados = this.cupones.filter(cupon => {
      const coincideTexto = cupon.codigo.toLowerCase().includes(termino) || 
                            cupon.nombre.toLowerCase().includes(termino);
      const coincideEstado = estado ? cupon.estado === estado : true;
      return coincideTexto && coincideEstado;
    });
  }

  /**
   * Redirige a la pantalla de edición del cupón con el código especificado
   * @param codigo Código del cupón a editar
   */
  editarCupon(codigo: string): void {
    this.router.navigate(['/editar-cupon', codigo]); // Navegación usando router
  }

  /**
   * Llama al backend para eliminar el cupón y actualiza la lista en pantalla
   * @param codigo Código del cupón a eliminar
   */
  eliminarCupon(codigo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cupón ${codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al servicio para eliminar
        this.authService.eliminarCupon(codigo).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El cupón ha sido eliminado', 'success');
            this.cargarCupones(); // Recarga la lista tras eliminación
          },
          error: (error) => {
            console.error('Error al eliminar cupón:', error);
            Swal.fire('Error', 'No se pudo eliminar el cupón', 'error');
          }
        });
      }
    });
  }
}
