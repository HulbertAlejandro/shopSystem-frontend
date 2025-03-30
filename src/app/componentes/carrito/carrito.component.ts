import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [ReactiveFormsModule, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carrito: any[] = [
    { 
      id: 1, 
      nombre: 'Manzana', 
      descripcion: 'Frescas y deliciosas', 
      precio: 10.50, 
      cantidad: 2, 
      imagen: 'https://via.placeholder.com/300x200?text=Concierto' 
    },
    { 
      id: 2, 
      nombre: 'Plátano',
      descripcion: 'Rico en potasio', 
      precio: 10.50, 
      cantidad: 1, 
      imagen: 'https://via.placeholder.com/300x200?text=Teatro' 
    }
  ];

  cuponForm: FormGroup;
  cuponAplicado: boolean = false;
  descuento: number = 0;
  tasaImpuesto: number = 0.21; // 21% de IVA

  constructor(private fb: FormBuilder) {
    this.cuponForm = this.fb.group({
      codigoCupon: ['']
    });
  }

  // Calcula el subtotal sin impuestos ni descuentos
  get subtotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  // Calcula el total de impuestos
  get impuesto(): number {
    return (this.subtotal - this.descuento) * this.tasaImpuesto;
  }

  // Calcula el total final a pagar
  get total(): number {
    return (this.subtotal - this.descuento) + this.impuesto;
  }

  // Actualiza la cantidad de un item
  actualizarCantidad(id: number, event: Event): void {
    const nuevaCantidad = (event.target as HTMLInputElement).valueAsNumber;
    const index = this.carrito.findIndex(item => item.id === id);

    if (index !== -1 && nuevaCantidad >= 1 && nuevaCantidad <= 99) {
      this.carrito[index].cantidad = nuevaCantidad;
      this.carrito = [...this.carrito]; // Forzar detección de cambios
    }
  }

  // Incrementa la cantidad en 1
  incrementarCantidad(id: number): void {
    const index = this.carrito.findIndex(item => item.id === id);
    if (index !== -1 && this.carrito[index].cantidad < 99) {
      this.carrito[index].cantidad++;
      this.carrito = [...this.carrito];
    }
  }

  // Decrementa la cantidad en 1
  decrementarCantidad(id: number): void {
    const index = this.carrito.findIndex(item => item.id === id);
    if (index !== -1 && this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
      this.carrito = [...this.carrito];
    }
  }

  // Elimina un item del carrito
  eliminarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter(item => item.id !== id);
    // Si se elimina un item con descuento, resetear el descuento
    if (this.carrito.length === 0) {
      this.descuento = 0;
      this.cuponAplicado = false;
    }
  }

  // Aplica un cupón de descuento
  aplicarCupon(): void {
    const codigo = this.cuponForm.get('codigoCupon')?.value;
    
    // Lógica de validación del cupón (simulada)
    if (codigo === 'DESCUENTO10') {
      this.descuento = 10; // $10 de descuento
      this.cuponAplicado = true;
    } else if (codigo === 'DESCUENTO20') {
      this.descuento = 20; // $20 de descuento
      this.cuponAplicado = true;
    } else {
      this.descuento = 0;
      this.cuponAplicado = false;
      alert('Cupón no válido');
    }
  }

  // Finaliza la compra
  finalizarCompra(): void {
    if (this.carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Aquí iría la lógica para procesar el pago
    console.log('Procesando pago:', {
      items: this.carrito,
      subtotal: this.subtotal,
      descuento: this.descuento,
      impuesto: this.impuesto,
      total: this.total
    });

    alert(`Compra realizada por $${this.total.toFixed(2)}. ¡Gracias!`);
    this.carrito = []; // Vaciar el carrito después de la compra
    this.descuento = 0;
    this.cuponAplicado = false;
    this.cuponForm.reset();
  }
}