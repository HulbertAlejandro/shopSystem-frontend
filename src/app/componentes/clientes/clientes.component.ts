import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InformacionCuentaDTO } from '../../dto/cuenta/informacion-cuenta-dto';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
    // Lista principal de clientes obtenidos del backend
    clientes: InformacionCuentaDTO[] = [];

    // Lista de clientes que se filtran según el término de búsqueda
    clientesFiltrados: InformacionCuentaDTO[] = [];

    // Inyección del servicio AuthService para llamadas a la API
    constructor(private authService: AuthService) {}

    // Método que se ejecuta al inicializar el componente
    ngOnInit(): void {
        this.cargarClientes();
    }

    // Llama al servicio para obtener todos los clientes y los asigna a las listas
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

    // Filtra los clientes por nombre o cédula
    buscarCliente(filtro: string): void {
        this.clientesFiltrados = this.clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            cliente.cedula.includes(filtro)
        );
    }

    // Elimina un cliente tras confirmación del usuario con SweetAlert
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
                        // Se elimina el cliente de la lista actual
                        this.clientes = this.clientes.filter(c => c.cedula !== cliente.cedula);
                        // Se limpia cualquier filtro aplicado
                        this.buscarCliente('');
                        // Se recarga la lista completa
                        this.cargarClientes();
                    },  
                    error: (error) => {
                        console.error(error);
                        Swal.fire('Error', 'No se logró eliminar la cuenta', 'error');
                        // Se recarga la lista incluso si hubo error
                        this.cargarClientes();
                    }
                });
            }
        });
    }
}
