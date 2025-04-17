import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'] as string[];
  const token = tokenService.getToken();

  if (!token) {
    router.navigate(['/unauthorized']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userRole = payload.rol;

  if (!expectedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};