import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importaciones para formularios reactivos
import { Router } from '@angular/router'; // Para la navegación de rutas
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos en Angular
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { AuthService } from '../../services/auth.service'; // Servicio para gestionar autenticación
import { LoginDTO } from '../../dto/cuenta/login-dto'; // DTO para enviar datos de inicio de sesión
import Swal from 'sweetalert2'; // Librería para mostrar alertas
import { TokenService } from '../../services/token.service'; // Servicio para gestionar el token de autenticación

@Component({
  selector: 'app-login', // Nombre del componente para usar en la vista
  standalone: true, // Indica que este componente es autónomo y no depende de otros módulos
  imports: [ReactiveFormsModule, CommonModule], // Importación de módulos necesarios
  templateUrl: './login.component.html', // Ruta al archivo HTML de la plantilla
  styleUrls: ['./login.component.css'] // Ruta al archivo de estilos CSS
})
export class LoginComponent {
  loginForm!: FormGroup; // Define el formulario reactivo
  submitted = false; // Variable para manejar el estado de la sumisión del formulario

  // Constructor que inyecta los servicios necesarios
  constructor(
    private formBuilder: FormBuilder, // Para crear y gestionar formularios reactivos
    private authService: AuthService, // Servicio de autenticación
    private tokenService: TokenService, // Servicio para gestionar el token
    private router: Router // Servicio de enrutamiento para navegación
  ) {
    this.crearFormulario(); // Llama a la función para crear el formulario
  }

  // Función para crear el formulario reactivo con sus validaciones
  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]], // Validación de correo electrónico
      password: ['', [Validators.required, Validators.minLength(7)]], // Validación de la contraseña (mínimo 7 caracteres)
    });
  }

  // Función para manejar el inicio de sesión
  public iniciarSesion() {
    const loginDTO = this.loginForm.value as LoginDTO; // Obtiene los valores del formulario y los convierte a un DTO

    console.log(loginDTO.correo); // Muestra el correo en la consola (solo para depuración)
    console.log(loginDTO.password); // Muestra la contraseña en la consola (solo para depuración)

    // Llama al servicio de autenticación para iniciar sesión
    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token); // Si el login es exitoso, guarda el token

        // ✅ Resetear verificación en dos pasos antes de redirigir
        this.tokenService.setIsVerified(false); // Marca como no verificado para la redirección

        // ✅ Redirigir a la ventana de verificación antes de entrar a la app
        this.router.navigate(['/verificacion']); // Redirige a la página de verificación
      },
      error: (error) => {
        // Si ocurre un error, muestra una alerta con el mensaje del error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta // Muestra el mensaje de error
        });
      }
    });
  }
}
