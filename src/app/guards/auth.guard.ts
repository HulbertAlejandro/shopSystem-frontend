import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verificación sincrónica del token
  const token = tokenService.getToken();
  if (!token) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};