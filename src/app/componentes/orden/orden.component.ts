import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { InformacionOrdenDTO } from '../../dto/orden/informacion-orden-dto';
import { IdOrdenDTO } from '../../dto/orden/id-orden-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss']
})
export class OrdenComponent {
  ordenes: InformacionOrdenDTO[] = [];
  ordenSeleccionada: string | null = null;

  constructor(private authService : AuthService, private tokenService: TokenService, private router : Router) {
    this.obtenerOrdenesUsuario(this.tokenService.getIDCuenta());
  }

  obtenerOrdenesUsuario(idUsuario: string): void {
    this.authService.obtenerOrdenesUsuario(idUsuario).subscribe(ordenes => {
      this.ordenes = ordenes.respuesta;
      console.log("ORDENES CARGADAS: ", this.ordenes);
    });
  }

  seleccionarOrden(ordenId: string): void {
    this.ordenSeleccionada = this.ordenSeleccionada === ordenId ? null : ordenId;
  }

  getOrdenSeleccionada(): InformacionOrdenDTO {
    const orden = this.ordenes.find(o => o.idOrden === this.ordenSeleccionada);
    if (!orden) {
      throw new Error('Orden seleccionada no encontrada');
    }
    return orden;
  }

  redirigirAPago(idOrden: string): void {
    this.router.navigate(['/pago', idOrden]); // Redirige a la pantalla de pago con la ID
  }

  verDetalleOrden(ordenId: string): void {
    const orden = this.ordenes.find(o => o.idOrden === ordenId);
    if (orden) {
      console.log('Mostrando detalles de la orden:', orden);
      alert(`Mostrando detalles de la orden #${ordenId.slice(-6).toUpperCase()}`);
    }
  }

  calcularSubtotal(orden: InformacionOrdenDTO): number {
    return orden.items.reduce((subtotal, item) => subtotal + (item.precio * item.cantidad), 0);
  }
}
