import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VistaCarritoDTO } from '../../dto/carrito/vista-carrito-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ActualizarItemCarritoDTO } from '../../dto/carrito/actualizar-item-carrito-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import Swal from 'sweetalert2';

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

  private obtenerCarrito(): void {
    const idCliente = this.tokenService.getIDCuenta();
    this.authService.obtenerInformacionCarrito(idCliente).subscribe({
      next: (data) => {
        this.vistaCarrito = data.respuesta;
        this.cargarDatos();
      },
      error: (error) => console.error("Error al obtener el carrito:", error)
    });
  }
  
  private cargarDatos(): void {
    this.detalles = [];
    this.vistaCarrito.detallesCarrito.forEach(detalle => {
      this.authService.obtenerProductoCarrito(detalle.idProducto).subscribe({
        next: (producto) => {
          this.detalles.push({
            ...detalle,
            producto,
            idCarrito: this.vistaCarrito.id_carrito
          });
        },
        error: (error) => console.error("Error al obtener el producto:", error)
      });
    });
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
    const actualizarItem: ActualizarItemCarritoDTO = {
      idCliente: this.tokenService.getIDCuenta(),
      idProducto: detalle.idProducto,
      nuevaCantidad: detalle.cantidad
    };

    this.authService.actualizarCantidadCarrito(actualizarItem).subscribe({
      next: () => {
        console.log('Cantidad actualizada en el carrito');
        this.obtenerCarrito(); // 🔄 Actualizar la vista
      },
      error: (error) => console.error('Error al actualizar la cantidad:', error)
    });
  }

  eliminarDelCarrito(id: string): void {
    const idCuenta = this.tokenService.getIDCuenta();

    
    this.authService.eliminarItem(id, idCuenta).subscribe({
       next: (respuesta) => {
        Swal.fire({
          title: 'Producto Eliminado del Carrito',
          text: 'El producto ha sido eliminado del carrito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
          })
          this.obtenerCarrito(); // 🔄 Actualizar la vista
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        }
      });
  }

  aplicarCupon(): void {
    this.cuponAplicado = true;
    this.obtenerCarrito(); // 🔄 Actualizar la vista después de aplicar el cupón
  }

  finalizarCompra(): void {
    if (this.detalles.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    console.log('Finalizando compra');
  }

  get subtotal(): number {
    return this.detalles.reduce((sum, item) => sum + ((item.producto?.precio || 0) * item.cantidad), 0);
  }

  get impuesto(): number {
    return this.subtotal * 0.19;
  }

  get total(): number {
    return (this.subtotal - this.descuento) + this.impuesto;
  }
}
