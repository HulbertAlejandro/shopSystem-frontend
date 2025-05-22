// Importa el tipo de interceptor de Angular
import { HttpInterceptorFn } from '@angular/common/http';

// Importa la función para inyección de dependencias
import { inject } from '@angular/core';

// Importa el servicio que maneja el token JWT
import { TokenService } from '../services/token.service';

// Importa operadores RxJS para manejo de errores
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP que agrega automáticamente el token JWT a las solicitudes salientes
 * y maneja errores de autenticación (401).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyecta el servicio que maneja el token
  const tokenService = inject(TokenService);

  // Define rutas públicas que no requieren autenticación
  const excludedRoutes = ['/api/auth/iniciar-sesion', '/api/auth/crear-cuenta'];

  // Si la URL solicitada está en la lista de rutas excluidas, no agrega token
  if (excludedRoutes.some(route => req.url.includes(route))) {
    return next(req); // Continúa la petición sin modificar
  }

  // Obtiene el token desde el servicio
  const token = tokenService.getToken();

  // Clona la solicitud original y le agrega el encabezado Authorization con el token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` // Estándar para autenticación JWT
    }
  });

  // Envía la solicitud modificada y captura errores
  return next(authReq).pipe(
    catchError(err => {
      // Si se recibe un error 401 (no autorizado), se limpia el token y se redirige al login
      if (err.status === 401) {
        tokenService.logout();              // Limpia el token y estado de sesión
        window.location.href = '/login';   // Redirecciona al login
      }

      // Retorna el error para que otros interceptores o componentes puedan manejarlo
      return throwError(() => err);
    })
  );
};
