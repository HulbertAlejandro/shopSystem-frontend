import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService : AuthService) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group(
      {
        cedula: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required, Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
        confirmaPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions
    );
  }

  public registrar() {
    const crearCuenta = this.registroForm.value as CrearCuentaDTO;
  
    console.log(crearCuenta); // Verifica que los datos estén correctos antes de enviarlos
  
    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
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

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;

    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }
  
}