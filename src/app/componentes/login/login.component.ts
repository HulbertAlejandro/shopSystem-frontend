import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 🔹 Necesario para usar @if
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { TokenService } from '../../services/token.service';

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, 
    private tokenService: TokenService) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      codigo: ['', [Validators.required]] // 🔹 Se agregó el campo para el código de verificación
    });
  }

  public iniciarSesion() {
    const loginDTO = this.loginForm.value as LoginDTO;

    console.log(loginDTO.correo);
    console.log(loginDTO.password);
    console.log(loginDTO.codigo); // 🔹 Se imprime el código de verificación

    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);
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

  // 🔹 Función para generar el código de verificación (vacía por ahora)
  public generarCodigo() {
    console.log("Botón de generar código presionado");
  }
}
