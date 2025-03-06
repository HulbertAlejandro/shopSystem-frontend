import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidarCuentaDTO } from '../../dto/validar-cuenta-dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verificacion-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // IMPORTANTE: Importar módulos necesarios
  templateUrl: './verificacion-cuenta.component.html',
  styleUrl: './verificacion-cuenta.component.css'
})
export class VerificacionCuentaComponent {
  verificacionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService : AuthService) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.verificacionForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  public verificarCuenta(){

    const activarCuentaDTO = this.verificacionForm.value as ValidarCuentaDTO; 
      
    this.authService.activarCuenta(activarCuentaDTO).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta activada',
          text: 'La cuenta se ha activado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
      },
      error: (error) => {
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
