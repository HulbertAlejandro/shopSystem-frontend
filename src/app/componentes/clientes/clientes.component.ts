import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InformacionCuentaDTO } from '../../dto/informacion-cuenta-dto';

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
    clientes: InformacionCuentaDTO[] = [];
    clientesFiltrados: InformacionCuentaDTO[] = [];

    constructor(private authService : AuthService) {}

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes(): void {
        this.authService.listarClientes().subscribe({
            next: (data) => {
              console.log(data.respuesta); // Verificar el contenido de los datos
              this.clientes = data.respuesta;
            },
            error: (error) => {
              console.log(error.mensaje);
            },
          });
    }

    buscarCliente(filtro: string): void {
        this.clientesFiltrados = this.clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            cliente.cedula.includes(filtro)
        );
    }

    eliminarCliente(cliente: InformacionCuentaDTO): void {
        this.clientes = this.clientes.filter(c => c.cedula !== cliente.cedula);
        this.buscarCliente('');
    }
}
