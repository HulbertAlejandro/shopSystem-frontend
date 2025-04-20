import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente que gestiona la vista y lógica de la bodega.
 * Permite buscar productos, modificar su stock, y crear órdenes de solicitud.
 */
@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {

  // Texto para filtrar productos por nombre
  filtroTemp: string = '';

  // Categoría seleccionada por el usuario para filtrar productos
  categoriaSeleccionada: string = '';

  // Lista de categorías disponibles
  categorias: string[] = ['Lácteos', 'Bebidas', 'Carnes', 'Verduras', 'Snacks'];

  // Lista completa de productos en bodega con su categoría, stock actual y stock mínimo
  productosBodega = [
    { nombre: 'Leche', categoria: 'Lácteos', stock: 20, stockMinimo: 5 },
    { nombre: 'Coca-Cola', categoria: 'Bebidas', stock: 15, stockMinimo: 3 },
    { nombre: 'Pollo', categoria: 'Carnes', stock: 8, stockMinimo: 4 },
    { nombre: 'Zanahoria', categoria: 'Verduras', stock: 12, stockMinimo: 5 },
    { nombre: 'Papas Fritas', categoria: 'Snacks', stock: 25, stockMinimo: 10 }
  ];

  // Lista de productos mostrados en pantalla, que puede estar filtrada
  productosFiltrados = [...this.productosBodega];

  // Lista de órdenes de productos que han sido solicitados
  ordenes: any[] = [];

  /**
   * Filtra los productos de la bodega según el nombre y la categoría seleccionada.
   */
  buscar() {
    this.productosFiltrados = this.productosBodega.filter(producto =>
      (this.filtroTemp.trim() === '' || producto.nombre.toLowerCase().includes(this.filtroTemp.toLowerCase())) &&
      (this.categoriaSeleccionada === '' || producto.categoria === this.categoriaSeleccionada)
    );
  }

  /**
   * Aumenta el stock del producto dado en la cantidad especificada.
   * @param producto Producto al que se le añadirá stock.
   * @param cantidad Cantidad a añadir al stock.
   */
  agregarStock(producto: any, cantidad: number) {
    if (cantidad > 0) {
      producto.stock += cantidad;
    }
  }

  /**
   * Disminuye el stock del producto dado si hay suficiente stock disponible.
   * @param producto Producto al que se le retirará stock.
   * @param cantidad Cantidad a retirar del stock.
   */
  retirarStock(producto: any, cantidad: number) {
    if (cantidad > 0 && producto.stock >= cantidad) {
      producto.stock -= cantidad;
    }
  }

  /**
   * Agrega un producto a la orden actual, sumando la cantidad si ya existe en la orden.
   * @param producto Producto a agregar a la orden.
   * @param cantidad Cantidad solicitada del producto.
   */
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

  /**
   * Elimina una orden específica de la lista de órdenes.
   * @param orden Orden a eliminar.
   */
  eliminarOrden(orden: any) {
    this.ordenes = this.ordenes.filter(o => o !== orden);
  }

  /**
   * Simula el envío de la orden actual y limpia la lista de órdenes.
   */
  crearOrden() {
    alert('Orden creada y enviada.');
    this.ordenes = [];
  }
}
