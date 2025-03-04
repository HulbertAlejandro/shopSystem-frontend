import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carrito: any[] = [
    { id: 1, nombre: 'Manzana', descripcion: 'Frescas y deliciosas.', precio: 1.50, cantidad: 3, imagen: 'https://via.placeholder.com/200' },
    { id: 2, nombre: 'Leche', descripcion: 'Entera y sin conservantes.', precio: 2.50, cantidad: 1, imagen: 'https://via.placeholder.com/200' }
  ];

  get total(): number {
    return this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  // ✅ Ahora encuentra el producto por ID para evitar cambios en otros productos
  actualizarCantidad(id: number, event: Event) {
    const nuevaCantidad = (event.target as HTMLInputElement).valueAsNumber;
    const index = this.carrito.findIndex(item => item.id === id);

    if (index !== -1 && nuevaCantidad >= 1) {
      this.carrito[index].cantidad = nuevaCantidad;

      // 🔹 Se clona el array para forzar la actualización en Angular
      this.carrito = [...this.carrito];
    }
  }

  eliminarDelCarrito(id: number) {
    this.carrito = this.carrito.filter(item => item.id !== id);
  }
}
