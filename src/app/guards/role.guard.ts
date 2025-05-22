// Importa la función 'inject' para inyección de dependencias directa
import { inject } from '@angular/core';

// Importa los tipos necesarios para navegación y rutas
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

// Importa el servicio personalizado para gestión del token JWT
import { TokenService } from '../services/token.service';

// Guard personalizado que permite el acceso a rutas solo si el usuario tiene uno de los roles esperados
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  // Inyecta los servicios necesarios
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Obtiene los roles permitidos desde la configuración de la ruta (data: { expectedRoles: ['ADMIN', 'CLIENTE', ...] })
  const expectedRoles = route.data['expectedRoles'] as string[];

  // Obtiene el token del usuario
  const token = tokenService.getToken();

  // Si no hay token, redirige a la página de acceso no autorizado
  if (!token) {
    router.navigate(['/unauthorized']);
    return false; // Deniega el acceso
  }

  // Extrae y decodifica el payload del token (segunda parte del JWT codificada en base64)
  const payload = JSON.parse(atob(token.split('.')[1]));

  // Obtiene el rol del usuario desde el payload del token
  const userRole = payload.rol;

  // Si el rol del usuario no está dentro de los roles permitidos, deniega acceso
  if (!expectedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  // Si el token es válido y el rol está permitido, concede acceso
  return true;
};
