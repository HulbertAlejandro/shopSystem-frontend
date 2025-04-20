// Importación de dependencias necesarias
import { Component } from '@angular/core'; // Decorador para definir componentes en Angular
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Herramientas para crear formularios reactivos y validarlos
import { Router } from '@angular/router'; // Servicio de Angular para redirección entre rutas
import { CommonModule } from '@angular/common'; // Módulo común con directivas como ngIf y ngFor
import { ReactiveFormsModule } from '@angular/forms'; // Módulo para trabajar con formularios reactivos
import Swal from 'sweetalert2'; // Librería para mostrar alertas emergentes estilizadas
import { AuthService } from '../../services/auth.service'; // Servicio personalizado de autenticación
import { ValidarCuentaDTO } from '../../dto/cuenta/validar-cuenta-dto'; // DTO que representa la estructura de datos para validar la cuenta

// Decorador que define la configuración del componente
@Component({
  selector: 'app-verificacion-cuenta', // Selector para usar este componente en HTML
  standalone: true, // Indica que el componente no requiere declaración en un módulo
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios para usar funciones como *ngIf y formularios reactivos
  templateUrl: './verificacion-cuenta.component.html', // Ruta del archivo HTML asociado
  styleUrl: './verificacion-cuenta.component.css' // Ruta del archivo de estilos
})
export class VerificacionCuentaComponent {
  verificacionForm!: FormGroup; // Variable que contendrá el formulario reactivo

  // Constructor que inyecta las dependencias necesarias
  constructor(
    private formBuilder: FormBuilder, // Constructor de formularios
    private router: Router, // Servicio de navegación
    private authService: AuthService // Servicio que maneja lógica de autenticación
  ) {
    this.crearFormulario(); // Se inicializa el formulario al cargar el componente
  }

  // Método privado que define el formulario y sus validaciones
  private crearFormulario() {
    this.verificacionForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]], // Campo obligatorio con mínimo 6 caracteres
      correo: ['', [Validators.required, Validators.email]] // Campo obligatorio con validación de email
    });
  }

  // Método que se ejecuta al hacer clic en el botón de verificación
  public verificarCuenta() {
    // Se transforma el valor del formulario en un objeto del tipo ValidarCuentaDTO
    const activarCuentaDTO = this.verificacionForm.value as ValidarCuentaDTO;

    // Llama al método del servicio de autenticación para activar la cuenta
    this.authService.activarCuenta(activarCuentaDTO).subscribe({
      next: (data) => {
        // Si la respuesta es exitosa, muestra alerta de éxito
        Swal.fire({
          title: 'Cuenta activada',
          text: 'La cuenta se ha activado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        // Redirige al login una vez activada la cuenta
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Si hay un error, muestra alerta con el mensaje recibido
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
