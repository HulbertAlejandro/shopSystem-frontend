import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { VerificacionCuentaComponent } from './componentes/verificacion-cuenta/verificacion-cuenta.component';
import { VerificacionComponent } from './componentes/verificacion/verificacion.component';
import { EditarCuentaComponent } from './componentes/editar-cuenta/editar-cuenta.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { BodegaComponent } from './componentes/bodega/bodega.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { DistribuidoraComponent } from './componentes/distribuidora/distribuidora.component';
import { RegistroProductoComponent } from './componentes/registro-producto/registro-producto.component';
import { PagoComponent } from './componentes/pago/pago.component';
import { CrearCuponComponent } from './componentes/crear-cupon/crear-cupon.component';
import { EditarProductoComponent } from './componentes/editar-producto/editar-producto.component';
import { EditarCuponComponent } from './componentes/editar-cupon/editar-cupon.component';
import { OrdenComponent } from './componentes/orden/orden.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './componentes/unauthorized/unauthorized.component';
import { CuponesComponent } from './componentes/cupones/cupones.component';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: InicioComponent },
  { path: 'home', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'verificacion-cuenta', component: VerificacionCuentaComponent },
  
  // Ruta de verificación (solo requiere autenticación)
  { 
    path: 'verificacion', 
    component: VerificacionComponent,
    canActivate: [authGuard] 
  },

  // Rutas compartidas (para todos los usuarios autenticados y verificados)
  { 
    path: 'editar-cuenta', 
    component: EditarCuentaComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['CLIENTE', 'ADMINISTRADOR', 'AUXILIAR_BODEGA', 'PROVEEDOR'] } 
  },

  // Rutas protegidas para CLIENTES
  { 
    path: 'carrito', 
    component: CarritoComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['CLIENTE'] } 
  },
  { 
    path: 'pago/:id', 
    component: PagoComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['CLIENTE'] } 
  },
  { 
    path: 'orden', 
    component: OrdenComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['CLIENTE'] } 
  },

  // Rutas protegidas para ADMINISTRADORES
  { 
    path: 'clientes', 
    component: ClientesComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['ADMINISTRADOR'] } 
  },
  { 
    path: 'cupones', 
    component: CuponesComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['ADMINISTRADOR'] } 
  },
  { 
    path: 'crear-cupon', 
    component: CrearCuponComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['ADMINISTRADOR'] } 
  },
  { 
    path: 'editar-cupon', 
    component: EditarCuponComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['ADMINISTRADOR'] } 
  },

  // Rutas protegidas para AUXILIAR_BODEGA
  { 
    path: 'bodega', 
    component: BodegaComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['AUXILIAR_BODEGA'] } 
  },

  // Rutas protegidas para PROVEEDORES
  { 
    path: 'distribuidora', 
    component: DistribuidoraComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['PROVEEDOR'] } 
  },
  { 
    path: 'crear-producto', 
    component: RegistroProductoComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['PROVEEDOR'] } 
  },
  {
    path: 'editar-producto/:id',
    component: EditarProductoComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['PROVEEDOR'] }
  },

  // Ruta para errores de autorización
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Redirección para rutas no encontradas
  { path: '**', pathMatch: 'full', redirectTo: '' }
];