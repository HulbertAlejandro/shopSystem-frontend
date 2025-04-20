import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControlOptions } from '@angular/forms'; // Importa herramientas de formularios reactivos y validaciones
import { ReactiveFormsModule } from '@angular/forms'; // Importa el módulo para formularios reactivos
import { AuthService } from '../../services/auth.service'; // Servicio para la autenticación y creación de cuentas
import Swal from 'sweetalert2'; // Librería para mostrar alertas visuales
import { Router } from '@angular/router'; // Importa Router para realizar redirecciones de navegación
import { CrearCuentaDTO } from '../../dto/cuenta/crear-cuenta-dto'; // DTO que contiene los datos necesarios para crear una cuenta

@Component({
  selector: 'app-registro', // Selector del componente
  standalone: true, // Indica que este componente es autónomo
  imports: [ReactiveFormsModule], // Módulos necesarios para este componente
  templateUrl: './registro.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./registro.component.css'] // Ruta al archivo de estilos CSS
})
export class RegistroComponent {
  registroForm!: FormGroup; // Definición del formulario reactivo

  // Constructor que inyecta los servicios necesarios para este componente
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { 
    this.crearFormulario(); // Llama al método para crear el formulario cuando se inicializa el componente
  }

  // Método privado para crear el formulario reactivo
  private crearFormulario() {
    this.registroForm = this.formBuilder.group(
      {
        cedula: ['', [Validators.required]], // Campo para cédula, obligatorio
        nombre: ['', [Validators.required]], // Campo para nombre, obligatorio
        correo: ['', [Validators.required, Validators.email]], // Campo para correo, obligatorio y con validación de formato de email
        direccion: ['', [Validators.required]], // Campo para dirección, obligatorio
        telefono: ['', [Validators.required, Validators.maxLength(10)]], // Campo para teléfono, obligatorio y con un máximo de 10 caracteres
        password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]], // Campo para contraseña, obligatorio y con validaciones de longitud
        confirmaPassword: ['', [Validators.required]] // Campo para confirmar la contraseña, obligatorio
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions // Valida que las contraseñas coincidan
    );
  }

  // Método para registrar al usuario
  public registrar() {
    const crearCuenta = this.registroForm.value as CrearCuentaDTO; // Convierte los valores del formulario en un DTO de creación de cuenta

    console.log(crearCuenta); // Verifica que los datos estén correctos antes de enviarlos

    // Llama al servicio de autenticación para crear la cuenta
    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        // Si la cuenta se crea correctamente, muestra una alerta de éxito
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente. Verifica tu código para activarla.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirige al usuario a la página de verificación de cuenta
          this.router.navigate(['/verificacion-cuenta']);
        });
      },
      error: (error) => {
        // Si ocurre un error al crear la cuenta, muestra una alerta de error
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }); 
  }

  // Método validador para comprobar que las contraseñas coinciden
  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;

    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }
}
