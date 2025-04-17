import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized-container"> <!-- Contenedor principal con fondo negro -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="unauthorized-card text-white">
              <div class="text-center mb-4">
                <i class="bi bi-shield-lock unauthorized-icon"></i>
                <h1 class="mt-4 mb-3 text-white">Acceso no autorizado</h1>
                <p class="text-white-50">No tienes permisos para acceder a esta página</p>
              </div>

              <div class="alert alert-warning d-flex align-items-center mb-4 p-3 rounded">
                <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div class="text-dark">
                  <strong>Error 403</strong> - Recurso restringido. Contacta al administrador si necesitas acceso.
                </div>
              </div>

              <div class="d-flex flex-column gap-3 mt-4">
                @if (tokenService.isLogged()) {
                  <a routerLink="/home" class="btn btn-primary py-3">
                    <i class="bi bi-house-door me-2"></i>Volver al inicio
                  </a>
                } @else {
                  <a routerLink="/login" class="btn btn-primary py-3">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
                  </a>
                }
                
                <button class="btn btn-outline-light py-3" (click)="goBack()">
                  <i class="bi bi-arrow-left me-2"></i>Volver atrás
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      background-color: #1a1a1a;
      min-height: 100vh;
      width: 100%;
    }
    
    .unauthorized-card {
      background-color: #222;
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .unauthorized-icon {
      font-size: 4rem;
      color: #ff4d4f;
    }
    
    .alert-warning {
      background-color: rgba(255, 193, 7, 0.9);
      border: 1px solid rgba(255, 193, 7, 0.3);
    }
    
    .btn {
      transition: all 0.3s ease;
      font-weight: 500;
      border-radius: 8px;
    }
    
    .btn:hover {
      transform: translateY(-2px);
    }
    
    .btn-primary {
      background-color: #009ee3;
      border-color: #009ee3;
    }
    
    .btn-primary:hover {
      background-color: #0088c7;
      border-color: #0088c7;
    }
    
    .btn-outline-light {
      color: #f8f9fa;
      border-color: #f8f9fa;
    }
    
    .btn-outline-light:hover {
      background-color: rgba(248, 249, 250, 0.1);
    }

    .text-white-50 {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(
    public tokenService: TokenService,
    private router: Router
  ) {}

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.tokenService.isLogged() 
        ? this.router.navigate(['/home']) 
        : this.router.navigate(['/login']);
    }
  }
}