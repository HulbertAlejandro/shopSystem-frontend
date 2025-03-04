import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent {
  verificacionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
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

    const codigoCorrecto = '123456';

    if (codigo === codigoCorrecto) {
      Swal.fire({
        icon: 'success',
        title: 'Verificación exitosa',
        text: 'Redirigiendo al inicio...',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/inicio']); // ✅ Redirige correctamente al inicio
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Código incorrecto',
        text: 'Por favor, inténtelo nuevamente.'
      });
    }
  }   
}
