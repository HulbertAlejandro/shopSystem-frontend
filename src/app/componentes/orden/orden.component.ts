import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductoOrden {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

interface DetalleOrden {
  producto: ProductoOrden;
  cantidad: number;
}

interface Orden {
  id: string;
  idCliente: string;
  fecha_orden: Date;
  detallesOrden: DetalleOrden[];
  total: number;
  descuento: number;
  impuesto: number;
  idCupon: string;
  estado: 'DISPONIBLE' | 'COMPLETADO' | 'CANCELADO';
  codigoPasarela?: string;
}

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss']
})
export class OrdenComponent {
  // Lista de órdenes del cliente (ejemplo con datos mock)
  ordenes: Orden[] = [
    {
      id: '67edcbd2a43dab587fb412f8',
      idCliente: '67ebe275c1565b697e873bdf',
      fecha_orden: new Date('2025-04-02T23:44:18.808Z'),
      detallesOrden: [
        {
          producto: {
            idProducto: 'prod1',
            nombre: 'Producto Ejemplo 1',
            descripcion: 'Descripción del producto 1',
            precio: 1000,
            cantidad: 2
          },
          cantidad: 2
        },
        {
          producto: {
            idProducto: 'prod2',
            nombre: 'Producto Ejemplo 2',
            descripcion: 'Descripción del producto 2',
            precio: 500,
            cantidad: 1
          },
          cantidad: 1
        }
      ],
      total: 2970,
      descuento: 600,
      impuesto: 570,
      idCupon: 'NFC',
      estado: 'DISPONIBLE'
    },
    {
      id: '77edcbd2a43dab587fb412f9',
      idCliente: '67ebe275c1565b697e873bdf',
      fecha_orden: new Date('2025-04-03T10:15:22.808Z'),
      detallesOrden: [
        {
          producto: {
            idProducto: 'prod3',
            nombre: 'Producto Ejemplo 3',
            descripcion: 'Descripción del producto 3',
            precio: 1500,
            cantidad: 1
          },
          cantidad: 1
        }
      ],
      total: 1785,
      descuento: 0,
      impuesto: 285,
      idCupon: '',
      estado: 'DISPONIBLE'
    }
  ];

  // Almacena los IDs de las órdenes seleccionadas
  ordenesSeleccionadas: string[] = [];

  constructor() {}

  /**
   * Alterna la selección de una orden
   * @param ordenId ID de la orden a seleccionar/deseleccionar
   */
  toggleSeleccionOrden(ordenId: string): void {
    const index = this.ordenesSeleccionadas.indexOf(ordenId);
    if (index === -1) {
      this.ordenesSeleccionadas.push(ordenId);
    } else {
      this.ordenesSeleccionadas.splice(index, 1);
    }
  }

  /**
   * Calcula el total de todas las órdenes seleccionadas
   * @returns Suma total de las órdenes seleccionadas
   */
  calcularTotalSeleccionado(): number {
    return this.ordenes.reduce((total, orden) => {
      return this.ordenesSeleccionadas.includes(orden.id) ? total + orden.total : total;
    }, 0);
  }

  /**
   * Procesa el pago de las órdenes seleccionadas
   */
  procesarPagoMultiplesOrdenes(): void {
    if (this.ordenesSeleccionadas.length === 0) {
      console.warn('No hay órdenes seleccionadas para pagar');
      return;
    }

    // Filtrar las órdenes seleccionadas
    const ordenesAPagar = this.ordenes.filter(orden => 
      this.ordenesSeleccionadas.includes(orden.id)
    );

    console.log('Iniciando proceso de pago para órdenes:', ordenesAPagar);
    
    // Aquí iría la lógica real de pago, como:
    // 1. Llamar a un servicio de pago
    // 2. Navegar a la pantalla de pago
    // 3. Mostrar un modal de confirmación
    
    // Ejemplo:
    // this.pagoService.procesarPago(ordenesAPagar).subscribe(...);
    
    // Por ahora solo mostramos un alert
    alert(`Iniciando pago por $${this.calcularTotalSeleccionado().toFixed(2)} por ${this.ordenesSeleccionadas.length} orden(es)`);
  }

  /**
   * Ver el detalle de una orden específica
   * @param ordenId ID de la orden a visualizar
   */
  verDetalleOrden(ordenId: string): void {
    const orden = this.ordenes.find(o => o.id === ordenId);
    if (orden) {
      console.log('Mostrando detalles de la orden:', orden);
      // Aquí podrías navegar a una ruta de detalle o mostrar un modal
      alert(`Mostrando detalles de la orden #${ordenId.slice(-6).toUpperCase()}`);
    }
  }

  /**
   * Procesar el pago de una sola orden
   * @param ordenId ID de la orden a pagar
   */
  procesarPago(ordenId: string): void {
    const orden = this.ordenes.find(o => o.id === ordenId);
    if (orden && orden.estado === 'DISPONIBLE') {
      console.log('Procesando pago para orden:', orden);
      // Lógica de pago individual
      alert(`Iniciando pago por $${orden.total.toFixed(2)} para la orden #${ordenId.slice(-6).toUpperCase()}`);
    }
  }
}