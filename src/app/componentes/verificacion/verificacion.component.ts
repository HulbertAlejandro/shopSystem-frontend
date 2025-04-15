import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { VerificacionDTO } from '../../dto/cuenta/verificacion-dto';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent {
  verificacionForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.verificacionForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  public verificarCodigo(event: Event) {
    event.preventDefault();

    if (this.verificacionForm.invalid) return;

    const { correo, codigo } = this.verificacionForm.value;
    console.log('Correo:', correo);
    console.log('Código ingresado:', codigo);

    const verificacionDTO = this.verificacionForm.value as VerificacionDTO;

    console.log(verificacionDTO.codigo);
    console.log(verificacionDTO.correo);

    this.authService.verificarSesion(verificacionDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);

        // ✅ Marcar como verificado antes de redirigir
        this.tokenService.setIsVerified(true);

        const rol = this.tokenService.getRol();
        Swal.fire({
          title: 'Cuenta Validada',
          text: 'La cuenta se ha validado correctamente. Bienvenido',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // ✅ Redirigir al usuario según su rol
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
              this.router.navigate(['/home']); // Redirección por defecto
              break;
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta
        });
      }
    });
  }
}