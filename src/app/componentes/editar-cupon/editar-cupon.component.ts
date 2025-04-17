import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EditarCuponDTO } from '../../dto/cupon/editar-cupon-dto';

@Component({
  selector: 'app-editar-cupon',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cupon.component.html',
  styleUrls: ['./editar-cupon.component.css']
})
export class EditarCuponComponent implements OnInit {
  cuponForm: FormGroup;
  tiposCupon = ["UNICO", "MULTIPLE"];
  estadoCupon = ["DISPONIBLE", "NO_DISPONIBLE"];
  cuponId!: string;
  cupones: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cuponForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      fechaVencimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCupones();
  }

  cargarCupones(): void {
    this.authService.obtenerCupones().subscribe({
      next: (data) => {
        this.cupones = data.respuesta;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los cupones', 'error');
      }
    });
  }

  onCuponSeleccionado(event: Event): void {
    const codigoSeleccionado = (event.target as HTMLSelectElement).value;
    const cuponSeleccionado = this.cupones.find(c => c.codigo === codigoSeleccionado);

    if (cuponSeleccionado) {
      this.cuponId = cuponSeleccionado.id;
      console.log('Cupon seleccionado:', cuponSeleccionado);

      this.cuponForm.patchValue({
        codigo: cuponSeleccionado.codigo,
        nombre: cuponSeleccionado.nombre,
        descuento: cuponSeleccionado.descuento,
        tipo: cuponSeleccionado.tipo,
        estado: cuponSeleccionado.estado,
        fechaVencimiento: this.formatearFechaParaInput(cuponSeleccionado.fechaVencimiento)
      });
    }
  }

  private formatearFechaParaInput(fecha: string | Date): string {
    if (!fecha) return '';
  
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida recibida:', fecha);
      return '';
    }
  
    return date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }
  
  
  editarCupon(): void {
    const cupon: EditarCuponDTO = {
      id: this.cuponId,
      ...this.cuponForm.value
    };
  
    this.authService.editarCupon(cupon).subscribe({
      next: () => {
        Swal.fire('Cupón actualizado', 'El cupón se ha actualizado correctamente.', 'success')
          .then(() => this.router.navigate(['/cupones']));
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el cupón', 'error');
      }
    });
  }
  

  eliminarCupon(): void {
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
        this.authService.eliminarCupon(this.cuponId).subscribe({
          next: (data) => {
            Swal.fire('Eliminado', 'El cupón ha sido eliminado correctamente.', 'success');
            this.router.navigate(['/cupones']);
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', error.error?.respuesta || 'No se logró eliminar el cupón', 'error');
          }
        });
      }
    });
  }
  
  
  cancelarEdicion(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/cupones']);
    }
  }
}
