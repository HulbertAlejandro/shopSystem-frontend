import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InformacionCuentaDTO } from '../../dto/informacion-cuenta-dto';
import { TokenService } from '../../services/token.service';
import { EditarCuentaDTO } from '../../dto/editar-cuenta-dto';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {
  editarPerfilForm!: FormGroup;
  cuenta !: InformacionCuentaDTO;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private tokenService : TokenService) {
  }

  ngOnInit() {
    this.crearFormulario()
    this.obtenerDatosUsuario();
  }
  
  private obtenerDatosUsuario() {
    this.authService.obtenerCuenta(this.tokenService.getIDCuenta()).subscribe({
      next: (usuario) => {
        if (usuario && usuario.respuesta) {
          this.cuenta = usuario.respuesta;
          this.crearFormulario(); // Crear formulario con los datos obtenidos
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
      }
    });
  }
  
  private crearFormulario() {
    this.editarPerfilForm = this.formBuilder.group({
      cedula: [{ value: this.cuenta?.cedula || '', disabled: true }],
      nombre: [this.cuenta?.nombre || '', [Validators.required]],
      correo: [{ value: this.cuenta?.correo || '', disabled: true }],
      direccion: [this.cuenta?.direccion || '', [Validators.required]],
      telefono: [this.cuenta?.telefono || '', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.minLength(6)]],
      confirmaPassword: ['', [Validators.minLength(6)]]
    });
  }
  
  

  guardarCambios() {
    if (this.editarPerfilForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      return;
    }
  
    if (this.editarPerfilForm.value.password !== this.editarPerfilForm.value.confirmaPassword) {
      console.log(this.editarPerfilForm.value.password);
      console.log(this.editarPerfilForm.value.confirmaPassword);
      
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return;
    }
  
    // 💡 Habilitar todos los campos antes de obtener los valores
    this.editarPerfilForm.enable();
    const datosActualizados = this.editarPerfilForm.value as EditarCuentaDTO;
    
    // Volver a deshabilitar los campos que deben permanecer bloqueados
    this.editarPerfilForm.controls['cedula'].disable();
    this.editarPerfilForm.controls['correo'].disable();
  
    this.authService.editarCuenta(datosActualizados).subscribe({
      next: () => {
        Swal.fire('Perfil actualizado', 'Tus datos han sido actualizados correctamente.', 'success');
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
      }
    });
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
