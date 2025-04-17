import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const excludedRoutes = ['/api/auth/iniciar-sesion', '/api/auth/crear-cuenta'];

  // No interceptar rutas públicas
  if (excludedRoutes.some(route => req.url.includes(route))) {
    return next(req);
  }

  const token = tokenService.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        tokenService.logout();
        window.location.href = '/login';
      }
      return throwError(() => err);
    })
  );
};