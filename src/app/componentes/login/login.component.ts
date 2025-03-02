import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 🔹 IMPORTANTE: Necesario para usar @if

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // 🔹 Asegúrate de incluir CommonModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false; // Variable para controlar si se intentó enviar el formulario

  constructor(private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  public iniciarSesion() {
    this.submitted = true; // Se activa cuando se presiona el botón
    if (this.loginForm.valid) {
      console.log('Login exitoso:', this.loginForm.value);
    }
  }
}
