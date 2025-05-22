// Importación de módulos y servicios necesarios
import { Component } from '@angular/core'; // Decorador para definir un componente
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Utilidades para formularios reactivos
import { Router } from '@angular/router'; // Servicio para la navegación entre rutas
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { ReactiveFormsModule } from '@angular/forms'; // Módulo para usar formularios reactivos
import Swal from 'sweetalert2'; // Librería para mostrar alertas bonitas
import { AuthService } from '../../services/auth.service'; // Servicio de autenticación
import { TokenService } from '../../services/token.service'; // Servicio para manejar el token y datos del usuario
import { VerificacionDTO } from '../../dto/cuenta/verificacion-dto'; // DTO con estructura para la verificación

// Decorador @Component que define metadatos del componente
@Component({
  selector: 'app-verificacion', // Nombre del selector HTML para usar este componente
  standalone: true, // Indica que este componente es independiente (no requiere estar en un módulo)
  imports: [ReactiveFormsModule, CommonModule], // Módulos necesarios para que el componente funcione
  templateUrl: './verificacion.component.html', // Ruta del archivo HTML asociado
  styleUrls: ['./verificacion.component.css'] // Ruta de los estilos CSS asociados
})
export class VerificacionComponent {
  verificacionForm!: FormGroup; // Formulario reactivo para los datos de verificación

  // Inyección de dependencias necesarias en el constructor
  constructor(
    private formBuilder: FormBuilder, // Para construir el formulario
    private router: Router,           // Para navegar entre rutas
    private authService: AuthService, // Servicio que se comunica con la API para autenticar/verificar
    private tokenService: TokenService // Servicio que guarda y gestiona el token de sesión
  ) {
    this.crearFormulario(); // Se construye el formulario al inicializar el componente
  }

  // Método privado que crea el formulario con sus validaciones
  private crearFormulario() {
    this.verificacionForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]], // Campo de correo: obligatorio y debe tener formato de email
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]] // Campo código: obligatorio y debe tener exactamente 6 caracteres
    });
  }

  // Método que se ejecuta al enviar el formulario
  public verificarCodigo(event: Event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Si el formulario no es válido, se detiene la ejecución
    if (this.verificacionForm.invalid) return;

    // Extrae los valores del formulario
    const { correo, codigo } = this.verificacionForm.value;
    console.log('Correo:', correo);
    console.log('Código ingresado:', codigo);

    // Crea un objeto VerificacionDTO a partir del formulario
    const verificacionDTO = this.verificacionForm.value as VerificacionDTO;

    console.log(verificacionDTO.codigo);
    console.log(verificacionDTO.correo);

    // Llama al servicio para verificar el código
    this.authService.verificarSesion(verificacionDTO).subscribe({
      next: (data) => {
        // Guarda el token en el servicio correspondiente
        this.tokenService.login(data.respuesta.token);

        // Marca la sesión como verificada
        this.tokenService.setIsVerified(true);

        // Obtiene el rol del usuario desde el token
        const rol = this.tokenService.getRol();

        // Muestra alerta de éxito
        Swal.fire({
          title: 'Cuenta Validada',
          text: 'La cuenta se ha validado correctamente. Bienvenido',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirecciona al usuario según su rol
          switch (rol) {
            case "CLIENTE":
              this.router.navigate(['/home']);
              break;
            case "ADMINISTRADOR":
              this.router.navigate(['/home']);
              break;
            case "PROVEEDOR":
              this.router.navigate(['/home']);
              break;
            case "AUXILIAR_BODEGA":
              this.router.navigate(['/bodega']);
              break;
            default:
              this.router.navigate(['/home']); // Si el rol no coincide, redirecciona a home por defecto
              break;
          }
        });
      },
      error: (error) => {
        // Si ocurre un error, se muestra alerta con el mensaje correspondiente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta
        });
      }
    });
  }
}
