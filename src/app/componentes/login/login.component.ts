import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // ✅ Corregido "styleUrl" a "styleUrls"
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private tokenService: TokenService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  public iniciarSesion() {
    const loginDTO = this.loginForm.value as LoginDTO;

    console.log(loginDTO.correo);
    console.log(loginDTO.password);

    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);
        
        // ✅ Resetear verificación en dos pasos antes de redirigir
        this.tokenService.setIsVerified(false);

        // ✅ Redirigir a la ventana de verificación antes de entrar a la app
        this.router.navigate(['/verificacion']);
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
