import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {
  filtroTemp: string = '';  // Texto de búsqueda
  categoriaSeleccionada: string = '';  // Categoría seleccionada

  // Lista de categorías
  categorias: string[] = ['Lácteos', 'Bebidas', 'Carnes', 'Verduras', 'Snacks'];

  // Lista de productos en la bodega
  productosBodega = [
    { nombre: 'Leche', categoria: 'Lácteos', stock: 20, stockMinimo: 5 },
    { nombre: 'Coca-Cola', categoria: 'Bebidas', stock: 15, stockMinimo: 3 },
    { nombre: 'Pollo', categoria: 'Carnes', stock: 8, stockMinimo: 4 },
    { nombre: 'Zanahoria', categoria: 'Verduras', stock: 12, stockMinimo: 5 },
    { nombre: 'Papas Fritas', categoria: 'Snacks', stock: 25, stockMinimo: 10 }
  ];

  // Lista filtrada para mostrar en la tabla
  productosFiltrados = [...this.productosBodega];

  // Método para aplicar los filtros
  buscar() {
    this.productosFiltrados = this.productosBodega.filter(producto =>
      (this.filtroTemp.trim() === '' || producto.nombre.toLowerCase().includes(this.filtroTemp.toLowerCase())) &&
      (this.categoriaSeleccionada === '' || producto.categoria === this.categoriaSeleccionada)
    );
  }

  // Método para agregar stock
  agregarStock(producto: any, cantidad: number) {
    if (cantidad > 0) {
      producto.stock += cantidad;
    }
  }

  // Método para retirar stock
  retirarStock(producto: any, cantidad: number) {
    if (cantidad > 0 && producto.stock >= cantidad) {
      producto.stock -= cantidad;
    }
  }
}