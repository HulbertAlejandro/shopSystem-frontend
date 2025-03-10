import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InformacionCuentaDTO } from '../../dto/informacion-cuenta-dto';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
    clientes: InformacionCuentaDTO[] = [];
    clientesFiltrados: InformacionCuentaDTO[] = [];

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes(): void {
        this.authService.listarClientes().subscribe({
            next: (data) => {
                console.log(data.respuesta); // Verificar el contenido de los datos
                this.clientes = data.respuesta;
                this.clientesFiltrados = [...this.clientes];
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
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.authService.eliminarCuentaCliente(cliente.cedula).subscribe({
                    next: (data) => {
                        Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
                        this.clientes = this.clientes.filter(c => c.cedula !== cliente.cedula);
                        this.buscarCliente('');
                        this.cargarClientes();
                    },  
                    error: (error) => {
                        console.error(error);
                        Swal.fire('Error', 'No se logró eliminar la cuenta', 'error');
                        
                        this.cargarClientes();
                    }
                });
            }
        });
    }
}
