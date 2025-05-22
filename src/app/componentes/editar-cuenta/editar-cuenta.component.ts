import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms'; // Importaciones necesarias para formularios reactivos
import { AuthService } from '../../services/auth.service'; // Servicio para la autenticación
import Swal from 'sweetalert2'; // Librería para alertas
import { Router } from '@angular/router'; // Enrutador para la navegación
import { InformacionCuentaDTO } from '../../dto/cuenta/informacion-cuenta-dto'; // DTO con los datos de la cuenta del usuario
import { TokenService } from '../../services/token.service'; // Servicio para gestionar el token JWT
import { EditarCuentaDTO } from '../../dto/cuenta/editar-cuenta-dto'; // DTO para la actualización de la cuenta

@Component({
  selector: 'app-editar-cuenta', // Selector para identificar este componente en la plantilla HTML
  standalone: true, // Marca el componente como independiente
  imports: [ReactiveFormsModule], // Módulo necesario para formularios reactivos
  templateUrl: './editar-cuenta.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./editar-cuenta.component.css'] // Ruta a los estilos CSS del componente
})
export class EditarCuentaComponent implements OnInit {
  editarPerfilForm!: FormGroup; // Formulario reactivo para editar los datos del perfil
  cuenta!: InformacionCuentaDTO; // Datos del usuario que se van a mostrar y editar
  passwordsNoCoinciden: boolean = false; // Bandera para verificar si las contraseñas coinciden

  constructor(
    private formBuilder: FormBuilder, // Constructor para crear el formulario reactivo
    private authService: AuthService, // Servicio para manejar las operaciones de cuenta
    private router: Router, // Enrutador para navegación
    private tokenService: TokenService // Servicio para obtener y gestionar el token JWT
  ) {}

  // Método ngOnInit que se ejecuta al inicializar el componente
  ngOnInit() {
    this.obtenerDatosUsuario(); // Llama al método para cargar los datos del usuario
  }

  // Obtiene los datos de la cuenta del usuario desde el backend
  private obtenerDatosUsuario() {
    this.authService.obtenerCuenta(this.tokenService.getIDCuenta()).subscribe({
      next: (usuario) => {
        if (usuario && usuario.respuesta) {
          this.cuenta = usuario.respuesta; // Asigna los datos de la cuenta al objeto 'cuenta'
          this.crearFormulario(); // Crea el formulario con los datos del usuario
        }
      },
      error: (error) => {
        console.error(error); // Imprime el error en consola
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error'); // Muestra un mensaje de error
      }
    });
  }

  // Crea el formulario reactivo con los datos iniciales del usuario
  private crearFormulario() {
    this.editarPerfilForm = this.formBuilder.group(
      {
        cedula: [{ value: this.cuenta?.cedula || '', disabled: true }], // Campo cedula, deshabilitado
        nombre: [this.cuenta?.nombre || '', [Validators.required]], // Campo nombre, obligatorio
        correo: [{ value: this.cuenta?.correo || '', disabled: true }], // Campo correo, deshabilitado
        direccion: [this.cuenta?.direccion || '', [Validators.required]], // Campo dirección, obligatorio
        telefono: [this.cuenta?.telefono || '', [Validators.required, Validators.maxLength(10)]], // Campo teléfono, obligatorio y con longitud máxima
        password: ['', [Validators.minLength(6)]], // Campo contraseña, con validación de longitud mínima
        confirmaPassword: ['', [Validators.minLength(6)]] // Campo confirmar contraseña, con validación de longitud mínima
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions // Validador personalizado para verificar si las contraseñas coinciden
    );

    // Se suscribe a los cambios en los campos del formulario para verificar si las contraseñas coinciden
    this.editarPerfilForm.valueChanges.subscribe(() => {
      this.verificarCoincidenciaPasswords(); // Verifica si las contraseñas coinciden
    });
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value; // Obtiene el valor de la contraseña
    const confirmaPassword = formGroup.get('confirmaPassword')?.value; // Obtiene el valor de la confirmación de contraseña
    return password === confirmaPassword ? null : { passwordsMismatch: true }; // Devuelve un error si las contraseñas no coinciden
  }

  // Método para verificar si las contraseñas coinciden
  verificarCoincidenciaPasswords() {
    const password = this.editarPerfilForm.get('password')?.value; // Obtiene el valor de la contraseña
    const confirmaPassword = this.editarPerfilForm.get('confirmaPassword')?.value; // Obtiene el valor de la confirmación de contraseña
    this.passwordsNoCoinciden = password !== confirmaPassword; // Establece la bandera a 'true' si las contraseñas no coinciden
  }

  // Método para guardar los cambios del perfil
  guardarCambios() {
    if (this.editarPerfilForm.invalid || this.passwordsNoCoinciden) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error'); // Muestra un mensaje si el formulario es inválido o las contraseñas no coinciden
      return;
    }

    this.editarPerfilForm.enable(); // Habilita todos los controles del formulario antes de enviarlo
    const datosActualizados = this.editarPerfilForm.value as EditarCuentaDTO; // Obtiene los datos actualizados del formulario

    // Deshabilita los campos que no pueden ser editados
    this.editarPerfilForm.controls['cedula'].disable();
    this.editarPerfilForm.controls['correo'].disable();

    // Llama al servicio para guardar los cambios en la cuenta
    this.authService.editarCuenta(datosActualizados).subscribe({
      next: () => {
        Swal.fire('Perfil actualizado', 'Tus datos han sido actualizados correctamente.', 'success'); // Muestra un mensaje de éxito
      },
      error: (error) => {
        console.error(error); // Imprime el error en consola
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error'); // Muestra un mensaje de error
      }
    });
  }

  // Método para eliminar la cuenta del usuario
  eliminarCuenta() {
    this.authService.eliminarCuenta(this.tokenService.getIDCuenta()).subscribe({
      next: (data) => {
        // Muestra un mensaje confirmando la eliminación de la cuenta
        Swal.fire({
          title: 'Cuenta Eliminada',
          text: 'La cuenta ha sido eliminada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.tokenService.logout(); // Llama al servicio para cerrar sesión
      },
      error: (error) => {
        console.error(error); // Imprime el error en consola
        Swal.fire('Error', 'No se logró eliminar la cuenta', 'error'); // Muestra un mensaje de error
      }
    });
  }
}
