import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InformacionCuentaDTO } from '../../dto/cuenta/informacion-cuenta-dto';
import { TokenService } from '../../services/token.service';
import { EditarCuentaDTO } from '../../dto/cuenta/editar-cuenta-dto';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})

export class EditarCuentaComponent implements OnInit {
  editarPerfilForm!: FormGroup;
  cuenta!: InformacionCuentaDTO;
  passwordsNoCoinciden: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  private obtenerDatosUsuario() {
    this.authService.obtenerCuenta(this.tokenService.getIDCuenta()).subscribe({
      next: (usuario) => {
        if (usuario && usuario.respuesta) {
          this.cuenta = usuario.respuesta;
          this.crearFormulario();
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
      }
    });
  }

  private crearFormulario() {
    this.editarPerfilForm = this.formBuilder.group(
      {
        cedula: [{ value: this.cuenta?.cedula || '', disabled: true }],
        nombre: [this.cuenta?.nombre || '', [Validators.required]],
        correo: [{ value: this.cuenta?.correo || '', disabled: true }],
        direccion: [this.cuenta?.direccion || '', [Validators.required]],
        telefono: [this.cuenta?.telefono || '', [Validators.required, Validators.maxLength(10)]],
        password: ['', [Validators.minLength(6)]],
        confirmaPassword: ['', [Validators.minLength(6)]]
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions
    );

    this.editarPerfilForm.valueChanges.subscribe(() => {
      this.verificarCoincidenciaPasswords();
    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }

  verificarCoincidenciaPasswords() {
    const password = this.editarPerfilForm.get('password')?.value;
    const confirmaPassword = this.editarPerfilForm.get('confirmaPassword')?.value;
    this.passwordsNoCoinciden = password !== confirmaPassword;
  }

  guardarCambios() {
    if (this.editarPerfilForm.invalid || this.passwordsNoCoinciden) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      return;
    }

    this.editarPerfilForm.enable();
    const datosActualizados = this.editarPerfilForm.value as EditarCuentaDTO;

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
    this.authService.eliminarCuenta(this.tokenService.getIDCuenta()).subscribe({
      next: (data) => {
        Swal.fire({
                  title: 'Cuenta Eliminada',
                  text: 'La cuenta se ha creado eliminado.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                this.tokenService.logout()
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se logro eliminar la cuenta', 'error');
      }
    });
  }
}