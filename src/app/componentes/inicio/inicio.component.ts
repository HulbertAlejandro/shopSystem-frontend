import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  filtro: string = '';
  filtroTemp: string = '';
  categoriaSeleccionada: string = '';
  carrito: any[] = [];

  productos = [
    { id: 1, nombre: 'Manzana', categoria: 'Frutas', descripcion: 'Frescas y deliciosas.', precio: 1.50, imagen: 'https://via.placeholder.com/200' },
    { id: 2, nombre: 'Plátano', categoria: 'Frutas', descripcion: 'Rico en potasio.', precio: 0.99, imagen: 'https://via.placeholder.com/200' },
    { id: 3, nombre: 'Leche', categoria: 'Lácteos', descripcion: 'Entera y sin conservantes.', precio: 2.50, imagen: 'https://via.placeholder.com/200' },
    { id: 4, nombre: 'Pan', categoria: 'Panadería', descripcion: 'Recién horneado.', precio: 1.20, imagen: 'https://via.placeholder.com/200' },
    { id: 5, nombre: 'Queso', categoria: 'Lácteos', descripcion: 'Madurado por 6 meses.', precio: 4.75, imagen: 'https://via.placeholder.com/200' },
    { id: 6, nombre: 'Tomates', categoria: 'Verduras', descripcion: 'Orgánicos y jugosos.', precio: 2.10, imagen: 'https://via.placeholder.com/200' },
    { id: 7, nombre: 'Zanahorias', categoria: 'Verduras', descripcion: 'Dulces y crujientes.', precio: 1.30, imagen: 'https://via.placeholder.com/200' },
    { id: 8, nombre: 'Cebollas', categoria: 'Verduras', descripcion: 'Perfectas para cocinar.', precio: 1.00, imagen: 'https://via.placeholder.com/200' },
    { id: 9, nombre: 'Pechuga de Pollo', categoria: 'Carnes', descripcion: 'Sin hueso y lista para cocinar.', precio: 5.50, imagen: 'https://via.placeholder.com/200' },
    { id: 10, nombre: 'Carne de Res', categoria: 'Carnes', descripcion: 'Corte premium para asar.', precio: 10.99, imagen: 'https://via.placeholder.com/200' },
    { id: 11, nombre: 'Jamon', categoria: 'Carnes', descripcion: 'Fino y de gran sabor.', precio: 3.25, imagen: 'https://via.placeholder.com/200' },
    { id: 12, nombre: 'Salchichas', categoria: 'Carnes', descripcion: 'Ideales para parrilladas.', precio: 2.80, imagen: 'https://via.placeholder.com/200' },
    { id: 13, nombre: 'Atún en lata', categoria: 'Abarrotes', descripcion: 'Conservado en agua.', precio: 1.75, imagen: 'https://via.placeholder.com/200' },
    { id: 14, nombre: 'Aceite de Oliva', categoria: 'Abarrotes', descripcion: 'Extra virgen.', precio: 7.99, imagen: 'https://via.placeholder.com/200' },
    { id: 15, nombre: 'Arroz', categoria: 'Abarrotes', descripcion: 'Grano largo y suelto.', precio: 2.50, imagen: 'https://via.placeholder.com/200' },
    { id: 16, nombre: 'Harina', categoria: 'Abarrotes', descripcion: 'Perfecta para hornear.', precio: 1.99, imagen: 'https://via.placeholder.com/200' },
    { id: 17, nombre: 'Cereal', categoria: 'Desayuno', descripcion: 'Rico en fibra.', precio: 3.90, imagen: 'https://via.placeholder.com/200' },
    { id: 18, nombre: 'Galletas', categoria: 'Snacks', descripcion: 'Dulces y crujientes.', precio: 2.30, imagen: 'https://via.placeholder.com/200' },
    { id: 19, nombre: 'Papas Fritas', categoria: 'Snacks', descripcion: 'Sabor BBQ.', precio: 1.99, imagen: 'https://via.placeholder.com/200' },
    { id: 20, nombre: 'Chocolate', categoria: 'Snacks', descripcion: 'Con almendras.', precio: 2.75, imagen: 'https://via.placeholder.com/200' },
    { id: 21, nombre: 'Jugo de Naranja', categoria: 'Bebidas', descripcion: '100% natural.', precio: 3.50, imagen: 'https://via.placeholder.com/200' },
    { id: 22, nombre: 'Refresco', categoria: 'Bebidas', descripcion: 'Con gas y azúcar.', precio: 1.50, imagen: 'https://via.placeholder.com/200' },
    { id: 23, nombre: 'Cerveza', categoria: 'Bebidas', descripcion: 'Lager premium.', precio: 4.00, imagen: 'https://via.placeholder.com/200' },
    { id: 24, nombre: 'Vino Tinto', categoria: 'Bebidas', descripcion: 'Cabernet Sauvignon.', precio: 12.99, imagen: 'https://via.placeholder.com/200' },
    { id: 25, nombre: 'Shampoo', categoria: 'Higiene', descripcion: 'Nutre y fortalece.', precio: 5.75, imagen: 'https://via.placeholder.com/200' },
    { id: 26, nombre: 'Jabón de Tocador', categoria: 'Higiene', descripcion: 'Con aloe vera.', precio: 1.20, imagen: 'https://via.placeholder.com/200' },
    { id: 27, nombre: 'Pasta de Dientes', categoria: 'Higiene', descripcion: 'Protección total.', precio: 3.30, imagen: 'https://via.placeholder.com/200' },
    { id: 28, nombre: 'Detergente', categoria: 'Limpieza', descripcion: 'Elimina manchas difíciles.', precio: 6.50, imagen: 'https://via.placeholder.com/200' },
    { id: 29, nombre: 'Suavizante', categoria: 'Limpieza', descripcion: 'Aroma duradero.', precio: 4.40, imagen: 'https://via.placeholder.com/200' },
    { id: 30, nombre: 'Papel Higiénico', categoria: 'Higiene', descripcion: 'Doble hoja.', precio: 5.99, imagen: 'https://via.placeholder.com/200' }
  ];

  categorias = [...new Set(this.productos.map(p => p.categoria))];

  productosFiltrados() {
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase()) &&
      (this.categoriaSeleccionada === '' || p.categoria === this.categoriaSeleccionada)
    );
  }

  buscar() {
    this.filtro = this.filtroTemp;
  }

  agregarAlCarrito(producto: any, cantidad: number) {
    if (cantidad < 1) return; // Evita agregar cantidades inválidas

    const productoEnCarrito = this.carrito.find(item => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad; // Aumenta la cantidad si ya existe en el carrito
    } else {
        this.carrito.push({ ...producto, cantidad }); // Agrega con la cantidad seleccionada
    }

    console.log("Carrito actualizado:", this.carrito);
  }
}
