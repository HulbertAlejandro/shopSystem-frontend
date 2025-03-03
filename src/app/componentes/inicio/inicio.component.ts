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
  filtro: string = ''; // 🔹 Filtro real que afecta la búsqueda
  filtroTemp: string = ''; // 🔹 Filtro temporal (se actualiza en el input)

  productos = [
    { id: 1, nombre: 'Manzana', descripcion: 'Frescas y deliciosas.', precio: 1.50, imagen: 'https://via.placeholder.com/200' },
    { id: 2, nombre: 'Plátano', descripcion: 'Rico en potasio.', precio: 0.99, imagen: 'https://via.placeholder.com/200' },
    { id: 3, nombre: 'Leche', descripcion: 'Entera y sin conservantes.', precio: 2.50, imagen: 'https://via.placeholder.com/200' },
    { id: 4, nombre: 'Pan', descripcion: 'Recién horneado.', precio: 1.20, imagen: 'https://via.placeholder.com/200' },
    { id: 5, nombre: 'Queso', descripcion: 'Madurado por 6 meses.', precio: 4.75, imagen: 'https://via.placeholder.com/200' },
    { id: 6, nombre: 'Tomates', descripcion: 'Orgánicos y jugosos.', precio: 2.10, imagen: 'https://via.placeholder.com/200' }
  ];

  // 🔹 Retorna solo los productos que coincidan con el filtro
  productosFiltrados() {
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // 🔹 Aplica el filtro cuando se presiona el botón "Buscar"
  buscar() {
    this.filtro = this.filtroTemp; // 🔹 Se actualiza el filtro real
  }

  agregarAlCarrito(producto: any) {
    console.log('Producto añadido:', producto);
  }
}