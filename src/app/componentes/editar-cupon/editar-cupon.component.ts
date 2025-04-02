import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
//import { ActualizarCuponDTO } from '../../dto/cupon/actualizar-cupon-dto';
//import { CuponDTO } from '../../dto/cupon/cupon-dto';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cuponForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaVencimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cuponId = this.route.snapshot.params['id'];
    //this.cargarCupon();
  }

  /*
  cargarCupon(): void {
    this.authService.obtenerCuponPorId(this.cuponId).subscribe({
      next: (cupon: CuponDTO) => {
        // Formatear fechas para el input datetime-local
        const fechaInicio = this.formatearFechaParaInput(cupon.fechaInicio);
        const fechaVencimiento = this.formatearFechaParaInput(cupon.fechaVencimiento);

        this.cuponForm.patchValue({
          codigo: cupon.codigo,
          nombre: cupon.nombre,
          descripcion: cupon.descripcion,
          descuento: cupon.descuento,
          tipo: cupon.tipo,
          estado: cupon.estado,
          fechaInicio: fechaInicio,
          fechaVencimiento: fechaVencimiento
        });
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo cargar el cupón', 'error');
        this.router.navigate(['/cupones']);
      }
    });
  }

  private formatearFechaParaInput(fecha: string): string {
    const date = new Date(fecha);
    return date.toISOString().slice(0, 16);
  }
    */

  /*

  actualizarCupon(): void {
    if (this.cuponForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
      return;
    }

    const cuponActualizado: ActualizarCuponDTO = {
      ...this.cuponForm.value,
      id: this.cuponId
    };

    this.authService.actualizarCupon(cuponActualizado).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Cupón actualizado correctamente', 'success')
          .then(() => this.router.navigate(['/cupones']));
      },
      error: (error) => {
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el cupón', 'error');
      }
    });
  }
    */

  cancelarEdicion(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/cupones']);
    }
  }
}