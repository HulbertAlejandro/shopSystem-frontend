import { Component, OnInit } from '@angular/core'; 
import { ReactiveFormsModule } from '@angular/forms'; // Módulo para formularios reactivos en Angular
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para trabajar con formularios reactivos y validaciones
import { ActivatedRoute } from '@angular/router'; // Para obtener parámetros de la ruta
import { AuthService } from '../../services/auth.service'; // Servicio de autenticación
import { InformacionOrdenDTO } from '../../dto/orden/informacion-orden-dto'; // DTO que contiene la información de la orden
import Swal from 'sweetalert2'; // Para mostrar alertas visuales
import { IdOrdenDTO } from '../../dto/orden/id-orden-dto'; // DTO que contiene el ID de la orden

@Component({
  selector: 'app-pago', // Selector del componente
  standalone: true, // Indica que este componente es autónomo
  imports: [ReactiveFormsModule, CommonModule], // Importación de módulos necesarios para este componente
  templateUrl: './pago.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./pago.component.css'] // Ruta al archivo de estilos CSS
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup; // Formulario reactivo para manejar los datos de pago
  orden: InformacionOrdenDTO = {} as InformacionOrdenDTO; // Objeto que contendrá la información de la orden
  metodosPago: string[] = ['Tarjeta de Crédito', 'Débito', 'PayPal', 'Transferencia Bancaria']; // Opciones de métodos de pago
  idOrden!: string; // ID de la orden que se obtiene de la ruta

  // Constructor que inyecta los servicios necesarios
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService) {
    // Inicializa el formulario reactivo con las validaciones necesarias
    this.pagoForm = this.fb.group({
      pedidoId: ['', Validators.required], // ID del pedido
      codigoPasarela: ['', Validators.required], // Código de pasarela de pago
      total: [{ value: '', disabled: true }, Validators.required], // Total de la orden, deshabilitado
      metodoPago: ['', Validators.required], // Método de pago seleccionado
      nombre: ['', Validators.required], // Nombre del usuario
      email: ['', [Validators.required, Validators.email]], // Email del usuario
      telefono: [''] // Teléfono del usuario
    });
  }

  // Método del ciclo de vida de Angular que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Obtiene el ID de la orden desde los parámetros de la ruta
    this.idOrden = this.route.snapshot.paramMap.get('id') || ''; 
    console.log("ID de la orden recibida en pago:", this.idOrden);
    this.cargarDatos(); // Carga los datos de la orden al inicializar
  }

  // Método para cargar los datos de la orden usando el servicio de autenticación
  cargarDatos(): void {
    if (!this.idOrden) return; // Si no se encuentra el ID de la orden, no hace nada
    
    // Llama al servicio para obtener la orden
    this.authService.obtenerOrden(this.idOrden).subscribe({
      next: (data) => {
        console.log(data.respuesta); // Muestra la respuesta de la orden en consola
        this.orden = data.respuesta; // Asigna la respuesta de la orden a la variable orden
        // Rellena los campos del formulario con los datos de la orden
        this.pagoForm.patchValue({
          pedidoId: this.orden.idOrden,
          total: this.orden.total
        });
      },
      error: (error) => {
        console.log(error.mensaje); // Muestra el error en consola si ocurre
      }
    });
  }

  // Método para realizar el pago de la orden
  realizarPago(): void {
    if (!this.idOrden) {
      Swal.fire('Error', 'No se encontró la orden', 'error'); // Muestra un error si no se encuentra la orden
      return;
    }

    // Crea un objeto DTO con el ID de la orden
    const idOrdenDto: IdOrdenDTO = { idOrden: this.idOrden };

    // Llama al servicio para procesar el pago
    this.authService.realizarPago(idOrdenDto).subscribe({
      next: (data) => {
        console.log("Pago procesado:", data); // Muestra la respuesta del pago en consola
        if (data.respuesta && data.respuesta.initPoint) {
          window.location.href = data.respuesta.initPoint; // Redirige a Mercado Pago si se obtuvo la URL de pago
        } else {
          Swal.fire('Error', 'No se pudo obtener la URL de pago', 'error'); // Muestra un error si no se obtuvo la URL de pago
        }
      },
      error: (error) => {
        console.error("Error en el pago:", error); // Muestra el error en consola si ocurre
        Swal.fire('Error', 'Error al procesar el pago', 'error'); // Muestra un mensaje de error
      }
    });
  }
}
