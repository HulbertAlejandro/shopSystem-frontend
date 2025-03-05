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
  filtroTemp: string = '';
  categoriaSeleccionada: string = '';

  categorias: string[] = ['Lácteos', 'Bebidas', 'Carnes', 'Verduras', 'Snacks'];

  productosBodega = [
    { nombre: 'Leche', categoria: 'Lácteos', stock: 20, stockMinimo: 5 },
    { nombre: 'Coca-Cola', categoria: 'Bebidas', stock: 15, stockMinimo: 3 },
    { nombre: 'Pollo', categoria: 'Carnes', stock: 8, stockMinimo: 4 },
    { nombre: 'Zanahoria', categoria: 'Verduras', stock: 12, stockMinimo: 5 },
    { nombre: 'Papas Fritas', categoria: 'Snacks', stock: 25, stockMinimo: 10 }
  ];

  productosFiltrados = [...this.productosBodega];

  ordenes: any[] = [];

  buscar() {
    this.productosFiltrados = this.productosBodega.filter(producto =>
      (this.filtroTemp.trim() === '' || producto.nombre.toLowerCase().includes(this.filtroTemp.toLowerCase())) &&
      (this.categoriaSeleccionada === '' || producto.categoria === this.categoriaSeleccionada)
    );
  }

  agregarStock(producto: any, cantidad: number) {
    if (cantidad > 0) {
      producto.stock += cantidad;
    }
  }

  retirarStock(producto: any, cantidad: number) {
    if (cantidad > 0 && producto.stock >= cantidad) {
      producto.stock -= cantidad;
    }
  }

  agregarAOrden(producto: any, cantidad: number) {
    if (cantidad > 0) {
      const ordenExistente = this.ordenes.find(o => o.nombre === producto.nombre);
      if (ordenExistente) {
        ordenExistente.cantidadSolicitada += cantidad;
      } else {
        this.ordenes.push({
          nombre: producto.nombre,
          categoria: producto.categoria,
          cantidadSolicitada: cantidad
        });
      }
    }
  }

  eliminarOrden(orden: any) {
    this.ordenes = this.ordenes.filter(o => o !== orden);
  }

  crearOrden() {
    alert('Orden creada y enviada.');
    this.ordenes = [];
  }
}
