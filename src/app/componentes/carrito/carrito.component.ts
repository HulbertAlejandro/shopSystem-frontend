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
        // Actualiza solo los cálculos sin recargar todo
        this.calcularTotales();
      },
      error: (error) => console.error('Error al actualizar la cantidad:', error)
    });
  }

  eliminarDelCarrito(idDetalle: string): void {
    const idCuenta = this.tokenService.getIDCuenta();

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este producto del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.authService.eliminarItem(idDetalle, idCuenta).subscribe({
                next: (respuesta) => {
                    // Actualización optimizada
                    const indice = this.detalles.findIndex(d => d.idDetalleCarrito === idDetalle);
                    if (indice !== -1) {
                        this.detalles.splice(indice, 1);
                        this.calcularTotales();
                    }

                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El producto ha sido eliminado del carrito',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                },
                error: (error) => {
                    console.error(error);
                    Swal.fire({
                        title: 'Error',
                        text: error.error.respuesta || 'Ocurrió un error al eliminar',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
  }

  aplicarCupon(): void {
    this.cuponAplicado = true;
    this.calcularTotales(); // Solo actualiza cálculos
  }

  // Añade este nuevo método para actualizar cálculos
  private calcularTotales(): void {
    // Fuerza la actualización de las propiedades calculadas
    this.detalles = [...this.detalles];
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
