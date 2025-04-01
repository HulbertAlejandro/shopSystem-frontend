import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VistaCarritoDTO } from '../../dto/carrito/vista-carrito-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProductoCarritoDTO } from '../../dto/producto/producto-carrito-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  vistaCarrito: VistaCarritoDTO = {
    id_carrito: '',
    detallesCarrito: [],
    fecha: ''
  };
  
  detalles: any[] = [];
  cuponForm: FormGroup;
  cuponAplicado = false;
  cuponInvalido = false;
  descuento = 0;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tokenService: TokenService
  ) {
    this.cuponForm = this.fb.group({
      codigoCupon: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  private obtenerCarrito() {
    const idCliente = this.tokenService.getIDCuenta();
    this.authService.obtenerInformacionCarrito(idCliente).subscribe({
      next: (data) => {
        this.vistaCarrito = data.respuesta;
        console.log(this.vistaCarrito)
        this.cargarDatos(); // Llamar a cargarDatos después de obtener el carrito
      },
      error: (error: any) => {
        console.error("Error:", error);
      }
    });
  }
  
  private cargarDatos() {
    this.detalles = []; // Limpiar el array antes de cargar nuevos datos
    this.vistaCarrito.detallesCarrito.forEach((detalle) => {
      this.authService.obtenerProductoCarrito(detalle.idProducto).subscribe({
        next: (producto) => {
          this.detalles.push({
            ...detalle,            // Mantener los detalles actuales del evento
            producto,                // Añadir el evento obtenido
            idCarrito: this.vistaCarrito.id_carrito // Añadir el id_carrito al detalle
          });
        },
        error: (error: any) => {
          console.error("Error al obtener el evento:", error);
        }
      });
    });
    console.log(this.detalles, "Detalles");
  }
  actualizarCantidad(id: string, cantidad: number): void {
    const detalle = this.detalles.find(d => d.idProducto === id);
    if (detalle && cantidad >= 1 && cantidad <= 99) {
      detalle.cantidad = cantidad;
      this.actualizarItemCarrito(detalle);
    }
  }

  incrementarCantidad(id: string): void {
    const detalle = this.detalles.find(d => d.idProducto === id);
    if (detalle && detalle.cantidad < 99) {
      detalle.cantidad++;
      this.actualizarItemCarrito(detalle);
    }
  }

  decrementarCantidad(id: string): void {
    const detalle = this.detalles.find(d => d.idProducto === id);
    if (detalle && detalle.cantidad > 1) {
      detalle.cantidad--;
      this.actualizarItemCarrito(detalle);
    }
  }

  private actualizarItemCarrito(detalle: any): void {
    console.log('Actualizando cantidad:', detalle);
  }

  eliminarDelCarrito(id: string): void {
    this.detalles = this.detalles.filter(d => d.idProducto !== id);
    if (this.detalles.length === 0) {
      this.resetearDescuento();
    }
  }

  aplicarCupon(): void {
    const codigo = this.cuponForm.get('codigoCupon')?.value;
    console.log('Aplicando cupón:', codigo);
  }

  private resetearDescuento(): void {
    this.descuento = 0;
    this.cuponAplicado = false;
    this.cuponForm.reset();
  }

  finalizarCompra(): void {
    if (this.detalles.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    console.log('Finalizando compra');
  }

  get subtotal(): number {
    return this.detalles.reduce((sum, item) => {
      return sum + ((item.producto?.precio || 0) * item.cantidad);
    }, 0);
  }

  get impuesto(): number {
    return this.subtotal * 0.19;
  }

  get total(): number {
    return (this.subtotal - this.descuento) + this.impuesto;
  }
}
