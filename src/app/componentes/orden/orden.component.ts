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

  ordenSeleccionada: string | null = null;

  constructor() {}

  seleccionarOrden(ordenId: string): void {
    this.ordenSeleccionada = this.ordenSeleccionada === ordenId ? null : ordenId;
  }

  getOrdenSeleccionada(): Orden {
    const orden = this.ordenes.find(o => o.id === this.ordenSeleccionada);
    if (!orden) {
      throw new Error('Orden seleccionada no encontrada');
    }
    return orden;
  }

  procesarPago(): void {
    if (!this.ordenSeleccionada) return;

    const orden = this.getOrdenSeleccionada();
    if (orden && orden.estado === 'DISPONIBLE') {
      console.log('Procesando pago para orden:', orden);
      // Lógica de pago aquí
      alert(`Iniciando pago por $${orden.total.toFixed(2)} para la orden #${orden.id.slice(-6).toUpperCase()}`);
    }
  }

  verDetalleOrden(ordenId: string): void {
    const orden = this.ordenes.find(o => o.id === ordenId);
    if (orden) {
      console.log('Mostrando detalles de la orden:', orden);
      alert(`Mostrando detalles de la orden #${ordenId.slice(-6).toUpperCase()}`);
    }
  }
}