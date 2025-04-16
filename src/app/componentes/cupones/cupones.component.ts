import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InformacionCuponDTO } from '../../dto/cupon/informacion-cupon-dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ObtenerCuponDTO } from '../../dto/cupon/obtener-cupon-dto';

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent implements OnInit {
  cupones: ObtenerCuponDTO[] = [];
  cuponesFiltrados: InformacionCuponDTO[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCupones();
  }

  /**
   * Convierte una cadena "2025,4,30,16,23" a un objeto Date válido
   */
  convertirFecha(fecha: number[] | null | undefined): Date | null {
    if (!Array.isArray(fecha) || fecha.length < 5) {
      return null;
    }
  
    const [anio, mes, dia, hora, minuto] = fecha;
    return new Date(anio, mes - 1, dia, hora, minuto);
  }
  

  /**
   * Carga los cupones desde el backend y convierte las fechas
   */
  cargarCupones(): void {
    this.authService.obtenerCupones().subscribe({
      next: (data) => {
        this.cupones = data.respuesta.map((cupon: any) => ({
          ...cupon,
          fechaVencimiento: this.convertirFecha(cupon.fechaVencimiento)
        }));
        this.cuponesFiltrados = [...this.cupones];
        console.log(this.cupones);
      },
      error: (error) => {
        console.error('Error al cargar cupones:', error);
        Swal.fire('Error', 'No se pudieron cargar los cupones', 'error');
      }
    });
  }

  /**
   * Filtra los cupones por texto y estado
   */
  filtrarCupones(termino: string = '', estado: string = ''): void {
    termino = termino.toLowerCase();
    this.cuponesFiltrados = this.cupones.filter(cupon => {
      const coincideTexto = cupon.codigo.toLowerCase().includes(termino) || 
                            cupon.nombre.toLowerCase().includes(termino);
      const coincideEstado = estado ? cupon.estado === estado : true;
      return coincideTexto && coincideEstado;
    });
  }

  /**
   * Redirige a la pantalla de edición de un cupón
   */
  editarCupon(codigo: string): void {
    this.router.navigate(['/editar-cupon', codigo]);
  }

  /**
   * Elimina un cupón y actualiza la lista
   */
  eliminarCupon(codigo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cupón ${codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.eliminarCupon(codigo).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El cupón ha sido eliminado', 'success');
            this.cargarCupones();
          },
          error: (error) => {
            console.error('Error al eliminar cupón:', error);
            Swal.fire('Error', 'No se pudo eliminar el cupón', 'error');
          }
        });
      }
    });
  }
}
