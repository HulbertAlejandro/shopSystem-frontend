import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
    nombre: string;
    categoria: string;
    cantidadSolicitada: number;
}

interface Orden {
    bodega: string;
    productos: Producto[];
}

@Component({
    selector: 'app-distribuidora',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './distribuidora.component.html',
    styleUrls: ['./distribuidora.component.css']
})
export class DistribuidoraComponent {
    ordenesDistribuidora: Orden[] = [
        {
            bodega: 'Bodega Norte',
            productos: [
                { nombre: 'Arroz', categoria: 'Granos', cantidadSolicitada: 50 },
                { nombre: 'Aceite', categoria: 'Líquidos', cantidadSolicitada: 20 }
            ]
        },
        {
            bodega: 'Bodega Sur',
            productos: [
                { nombre: 'Azúcar', categoria: 'Granos', cantidadSolicitada: 30 },
                { nombre: 'Sal', categoria: 'Condimentos', cantidadSolicitada: 15 }
            ]
        }
    ];

    marcarComoEntregada(orden: Orden): void {
        this.ordenesDistribuidora = this.ordenesDistribuidora.filter(o => o !== orden);
        console.log(`Orden de ${orden.bodega} entregada.`);
    }
}