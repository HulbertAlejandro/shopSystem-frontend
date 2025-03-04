import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Importar Router
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
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  // ✅ Agregar Router al constructor
  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private tokenService: TokenService,
    private router: Router // ✅ Agregar Router
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

        // ✅ Redirigir a la ventana de verificación
        this.router.navigate(['/verificacion']); // Asegúrate de usar la ruta correcta
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
