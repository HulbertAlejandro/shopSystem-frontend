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
   { path: "**", pathMatch: "full", redirectTo: "" }
];
