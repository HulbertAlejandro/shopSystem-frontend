import { Component, OnInit } from '@angular/core';

interface Cliente {
    cedula: string;
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
}

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
    clientes: Cliente[] = [];
    clientesFiltrados: Cliente[] = [];

    constructor() {}

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes(): void {
        // Lógica para cargar clientes (se llenará después)
    }

    buscarCliente(filtro: string): void {
        this.clientesFiltrados = this.clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            cliente.cedula.includes(filtro)
        );
    }

    eliminarCliente(cliente: Cliente): void {
        this.clientes = this.clientes.filter(c => c.cedula !== cliente.cedula);
        this.buscarCliente('');
    }
}
