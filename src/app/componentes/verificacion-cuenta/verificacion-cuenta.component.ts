import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacion-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // IMPORTANTE: Importar módulos necesarios
  templateUrl: './verificacion-cuenta.component.html',
  styleUrl: './verificacion-cuenta.component.css'
})
export class VerificacionCuentaComponent {
  verificacionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.verificacionForm = this.formBuilder.group({
      codigoVerificacion: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public verificarCuenta() {
    const codigoIngresado = this.verificacionForm.value.codigoVerificacion;

    console.log("Código ingresado:", codigoIngresado);
    
    // Simulación de verificación del código
    Swal.fire({
      icon: 'success',
      title: 'Cuenta activada',
      text: 'Su cuenta ha sido activada con éxito.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/login']); // Redirigir al login después de activar la cuenta
    });
  }
}
