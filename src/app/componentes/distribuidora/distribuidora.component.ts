import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Importaciones necesarias para formularios reactivos
import { CommonModule } from '@angular/common'; // Módulo para directivas comunes como *ngIf y *ngFor
import { FormsModule } from '@angular/forms'; // Módulo para usar formularios basados en template

// Definición de la estructura de Producto
interface Producto {
    nombre: string; // Nombre del producto
    categoria: string; // Categoría del producto (e.g., Granos, Líquidos, etc.)
    cantidadSolicitada: number; // Cantidad solicitada de dicho producto
}

// Definición de la estructura de Orden
interface Orden {
    bodega: string; // Nombre de la bodega que realiza la orden
    productos: Producto[]; // Lista de productos que forman parte de la orden
}

@Component({
    selector: 'app-distribuidora', // Selector que identifica este componente en la plantilla HTML
    standalone: true, // Marca el componente como independiente
    imports: [CommonModule, ReactiveFormsModule, FormsModule], // Módulos necesarios para el funcionamiento del componente
    templateUrl: './distribuidora.component.html', // Ruta a la plantilla HTML
    styleUrls: ['./distribuidora.component.css'] // Ruta a los estilos CSS del componente
})
export class DistribuidoraComponent {
    // Inicializa las órdenes de la distribuidora con información ficticia de bodegas y productos
    ordenesDistribuidora: Orden[] = [
        {
            bodega: 'Bodega Norte', // Nombre de la bodega
            productos: [
                { nombre: 'Arroz', categoria: 'Granos', cantidadSolicitada: 50 }, // Producto 1
                { nombre: 'Aceite', categoria: 'Líquidos', cantidadSolicitada: 20 } // Producto 2
            ]
        },
        {
            bodega: 'Bodega Sur', // Otra bodega con productos diferentes
            productos: [
                { nombre: 'Azúcar', categoria: 'Granos', cantidadSolicitada: 30 }, // Producto 3
                { nombre: 'Sal', categoria: 'Condimentos', cantidadSolicitada: 15 } // Producto 4
            ]
        }
    ];

    /**
     * Método para marcar una orden como entregada, eliminándola de la lista de órdenes
     * @param orden La orden que se marca como entregada
     */
    marcarComoEntregada(orden: Orden): void {
        // Filtra la lista de órdenes para eliminar la orden entregada
        this.ordenesDistribuidora = this.ordenesDistribuidora.filter(o => o !== orden);
        // Imprime un mensaje en la consola confirmando la entrega de la orden
        console.log(`Orden de ${orden.bodega} entregada.`);
    }
}
