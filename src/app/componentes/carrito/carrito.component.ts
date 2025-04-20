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
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  // Objeto que contiene los datos del carrito
  vistaCarrito: VistaCarritoDTO = {
    id_carrito: '',
    detallesCarrito: [],
    fecha: ''
  };

  // Lista de detalles del carrito con info extendida del producto
  detalles: any[] = [];

  // Formulario para ingresar el código de cupón
  cuponForm: FormGroup;
  cuponAplicado = false;
  descuento = 0;

  constructor(
    private cd: ChangeDetectorRef,
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

  // Obtiene el carrito actual del usuario logueado
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

   // Carga la información de productos en base a los detalles del carrito
  private cargarDatos(): void {
    this.detalles = [];
    this.vistaCarrito.detallesCarrito.forEach(detalle => {
      this.authService.obtenerProductoCarrito(detalle.idProducto).subscribe({
        next: (producto) => {
          this.detalles.push({
            idDetalleCarrito: detalle.idDetalleCarrito,
            idProducto: detalle.idProducto,
            cantidad: detalle.cantidad,  // Asegúrate que esto viene del backend
            producto: producto,
            precioUnitario: detalle.precioUnitario // Si aplica
          });
          console.log('Detalle cargado:', this.detalles[this.detalles.length - 1]); // Para depuración
        },
        error: (error) => console.error("Error al obtener el producto:", error)
      });
    });
  }

  // Actualiza la cantidad ingresada manualmente
  actualizarCantidad(id: string, cantidad: number): void {
    const detalle = this.detalles.find(d => d.idProducto === id);
    if (detalle && cantidad >= 1 && cantidad <= 99) {
      detalle.cantidad = cantidad;
      this.actualizarItemCarrito(detalle);
    }
  }

  // Aumenta la cantidad de un producto
  incrementarCantidad(id: string): void {
    console.log('Incrementando cantidad para producto:', id);
    const detalle = this.detalles.find(d => d.idProducto === id);
    console.log('Detalle encontrado:', detalle);
    if (detalle && detalle.cantidad < 99) {
      detalle.cantidad++;
      console.log('Nueva cantidad:', detalle.cantidad);
      this.actualizarItemCarrito(detalle);
    }
  }

  // Disminuye la cantidad de un producto
  decrementarCantidad(id: string): void {
    const detalle = this.detalles.find(d => d.idProducto === id);
    if (detalle && detalle.cantidad > 1) {
      detalle.cantidad--;
      this.actualizarItemCarrito(detalle);
    }
  }

  // Actualiza la cantidad de un producto en el backend
  private actualizarItemCarrito(detalle: any): void {
    const actualizarItem: ActualizarItemCarritoDTO = {
      idCliente: this.tokenService.getIDCuenta(),
      idProducto: detalle.idProducto,
      nuevaCantidad: detalle.cantidad
    };

    this.authService.actualizarCantidadCarrito(actualizarItem).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.calcularTotales();
      },
      error: (error) => console.error('Error al actualizar la cantidad:', error)
    });
  }

  // Elimina un producto del carrito con confirmación
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

  // Aplica un cupón de descuento si es válido
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

  // Finaliza la compra creando una orden
  finalizarCompra(): void {
    if (this.detalles.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
  
    // Construcción de los ítems de la orden usando this.detalles
    const itemsOrden = this.detalles.map(detalle => ({
      referencia: detalle.idProducto,
      nombre: detalle.producto?.nombre || 'Producto sin nombre',
      cantidad: detalle.cantidad, // ← Usamos la cantidad de this.detalles
      precio: detalle.producto?.precio || 0,
      idDetalleCarrito: detalle.idDetalleCarrito
    }));
  
    console.log("Items de la orden con cantidades:", itemsOrden.map(i => `${i.nombre}: ${i.cantidad}`));
  
    const valorDescuento = (this.subtotal * this.descuento) / 100;
    
    const orden: CrearOrdenDTO = {
      idCliente: this.tokenService.getIDCuenta(),
      codigoPasarela: '',
      items: itemsOrden,
      total: this.total,
      descuento: valorDescuento,
      impuesto: this.impuesto,
      codigoCupon: this.cuponForm.get('codigoCupon')?.value || ''
    };
  
    console.log("Orden a crear:", orden);
    
    this.authService.crearOrden(orden).subscribe({
      next: (data) => {
        if (data.respuesta) {
          Swal.fire("Orden creada", "Tu orden se ha creado exitosamente.", "success");
          this.router.navigate(['/orden']);
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
  
  // Cálculo del subtotal sin impuestos ni descuento
  get subtotal(): number {
    return this.detalles.reduce((sum, item) => sum + ((item.producto?.precio || 0) * item.cantidad), 0);
  }

  // Cálculo del impuesto (19%)
  get impuesto(): number {
    return this.subtotal * 0.19;
  }

  // Cálculo del total final con descuento e impuesto
  get total(): number {
    const subtotalConDescuento = this.subtotal * (1 - this.descuento / 100);
    return subtotalConDescuento + this.impuesto;
  }

}
