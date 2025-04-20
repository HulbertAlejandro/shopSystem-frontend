// Importa la función `inject` para obtener servicios dentro de funciones independientes
import { inject } from '@angular/core';

// Importa los tipos y clases necesarios para la navegación y el guard
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service'; // Servicio personalizado para gestionar el token JWT

// Define un guard de tipo CanActivate, usado para proteger rutas de acceso no autorizado
export const authGuard: CanActivateFn = (route, state) => {
  // Inyecta el servicio TokenService para acceder al token de autenticación
  const tokenService = inject(TokenService);

  // Inyecta el servicio Router para redirigir si no hay token
  const router = inject(Router);

  // Obtiene el token de sesión del usuario
  const token = tokenService.getToken();

  // Si no hay token, redirige al usuario al login, incluyendo en la URL un parámetro "returnUrl"
  if (!token) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } // Guarda la URL original para redirigir luego del login
    });
    return false; // Bloquea el acceso a la ruta protegida
  }

  // Si existe el token, permite el acceso a la ruta
  return true;
};
