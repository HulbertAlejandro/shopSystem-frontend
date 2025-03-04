import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {
  editarPerfilForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.crearFormulario();
    this.obtenerDatosUsuario();
  }

  private crearFormulario() {
    this.editarPerfilForm = this.formBuilder.group({
      cedula: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required]],
      correo: [{ value: '', disabled: true }],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]]
    });
  }

  private obtenerDatosUsuario() {
    // Simulación de la obtención de datos del usuario
    /*
    this.authService.obtenerPerfil().subscribe({
      next: (usuario) => {
        this.editarPerfilForm.patchValue({
          cedula: usuario.cedula,
          nombre: usuario.nombre,
          correo: usuario.correo,
          direccion: usuario.direccion,
          telefono: usuario.telefono
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
      }
    });
    */
  }

  guardarCambios() {
    if (this.editarPerfilForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      return;
    }

    if (this.editarPerfilForm.value.password !== this.editarPerfilForm.value.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    const datosActualizados = { ...this.editarPerfilForm.getRawValue() };
    delete datosActualizados.confirmPassword;

    // Simulación de actualización de datos
    /*
    this.authService.actualizarPerfil(datosActualizados).subscribe({
      next: () => {
        Swal.fire('Perfil actualizado', 'Tus datos han sido actualizados correctamente.', 'success');
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
      }
    });
    */
  }

  eliminarCuenta() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulación de eliminación de cuenta
        /*
        this.authService.eliminarCuenta().subscribe({
          next: () => {
            Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.', 'success')
              .then(() => this.router.navigate(['/']));
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar la cuenta.', 'error');
          }
        });
        */
      }
    });
  }
}
