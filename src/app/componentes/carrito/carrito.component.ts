import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VistaCarritoDTO } from '../../dto/carrito/vista-carrito-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ActualizarItemCarritoDTO } from '../../dto/carrito/actualizar-item-carrito-dto';
import Swal from 'sweetalert2';
import { CrearOrdenDTO } from '../../dto/orden/crear-orden-dto';
import { Router } from '@angular/router';

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
    private tokenService: TokenService,
    private router : Router
  ) {
    this.cuponForm = this.fb.group({
      codigoCupon: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
  private obtenerCarrito(): void {
    const idCliente = this.tokenService.getIDCuenta();
    this.authService.obtenerInformacionCarrito(idCliente).subscribe({
      next: (data) => {
        console.log("Datos del carrito recibidos:", data); // Agrega esta línea
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
    const codigoCupon = this.cuponForm.value.codigoCupon.trim(); // Obtener el valor ingresado
  
    if (!codigoCupon) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un código de cupón válido',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    this.authService.aplicarCupon(codigoCupon).subscribe({
      next: (respuesta) => {
          this.descuento = respuesta.respuesta.descuento; 
          this.calcularTotales();
          Swal.fire({
            title: 'Cupón aplicado',
            text: `Se ha aplicado un descuento de $${this.descuento.toFixed(2)}`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
      },
      error: (error) => {
        console.error('Error al validar el cupón:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  

  // Añade este nuevo método para actualizar cálculos
  private calcularTotales(): void {
    // Fuerza la actualización de las propiedades calculadas
    this.detalles = [...this.detalles];
  }

  finalizarCompra(): void {
    if (!this.vistaCarrito || this.vistaCarrito.detallesCarrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
  
    // Construcción de los ítems de la orden
    const itemsOrden = this.vistaCarrito.detallesCarrito.map(detalle => ({
      referencia: detalle.idProducto,  // Se usa el ID del producto como referencia
      nombre: detalle.nombreProducto,  // Se usa el nombre del producto
      cantidad: detalle.cantidad,  // Cantidad de unidades compradas
      precio: detalle.precioUnitario,  // Precio unitario del producto
      idDetalleCarrito: detalle.idDetalleCarrito // Puede ser útil para backend
    }));
  
    console.log("items de la orden", itemsOrden)
    const valorDescuento = (this.subtotal * this.descuento) / 100;
    // Creación del objeto de la orden
    const orden: CrearOrdenDTO = {
      idCliente: this.tokenService.getIDCuenta(),  // ID del carrito
      codigoPasarela: '',  // Código de pasarela de pago si aplica
      items: itemsOrden,  // Lista de productos en la orden
      total: this.total,
      descuento : (this.subtotal * this.descuento) / 100,
      impuesto : this.impuesto,  // Total calculado de la compra
      codigoCupon: this.cuponForm.get('codigoCupon')?.value || ''  // Código de cupón si aplica
    };

    console.log("creacion de la orden", orden)
  
    this.authService.crearOrden(orden).subscribe({
      next: (data) => {
        if (data.respuesta) {
          Swal.fire("Orden creada", "Tu orden se ha creado exitosamente.", "success");
          this.router.navigate(['/orden']); // ✅ Pasar ID de la orden
        } else {
          Swal.fire("Error", data.respuesta, "error");
        }
      },
      error: (error: any) => {
        console.error("Error al crear la orden:", error);
        Swal.fire("Error", "Hubo un problema al crear la orden.", "error");
      }
    });
    
  }
  

  get subtotal(): number {
    return this.detalles.reduce((sum, item) => sum + ((item.producto?.precio || 0) * item.cantidad), 0);
  }

  get impuesto(): number {
    return this.subtotal * 0.19;
  }

  get total(): number {
    const subtotalConDescuento = this.subtotal * (1 - this.descuento / 100);
    return subtotalConDescuento + this.impuesto;
  }

}
