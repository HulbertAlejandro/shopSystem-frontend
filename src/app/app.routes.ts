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

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'home', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'verificacion-cuenta', component: VerificacionCuentaComponent },
   { path: "verificacion", component: VerificacionComponent },
   { path: "editar-cuenta", component: EditarCuentaComponent},
   { path: "carrito", component: CarritoComponent},
   { path: "bodega", component: BodegaComponent},
   { path: "clientes", component: ClientesComponent },
   { path: "distribuidora", component: DistribuidoraComponent },
   { path: "crear-producto", component: RegistroProductoComponent },
   { path: "pago", component: PagoComponent },
   { path: "crear-cupon", component: CrearCuponComponent },
   { path: "editar-producto", component: EditarProductoComponent},
   { path: "editar-cupon", component: EditarCuponComponent},
   { path: "orden", component: OrdenComponent},
   // Para agregar más rutas, agregar al final de la lista y añadir el import correspondiente
    // { path: '**', component: NotFoundComponent } // Este debe ir al final para que funcione correctamente
   { path: "**", pathMatch: "full", redirectTo: "" }
];
