import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CrearCuponDTO } from '../../dto/cupon/crear-cupon-dto';
import { TipoCupon } from '../../dto/cupon/tipo-cupon';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cupon.component.html',
  styleUrls: ['./crear-cupon.component.css']
})
export class CrearCuponComponent {
  cuponForm: FormGroup;
  tiposCupon = ["UNICO", "MULTIPLE"];
  estadoCupon = ["DISPONIBLE", "NO_DISPONIBLE"]
  constructor(private fb: FormBuilder, private authService : AuthService) {
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

  crearCupon(): void {
    const formValue = this.cuponForm.value;
  
    const nuevoCupon: CrearCuponDTO = {
      ...formValue,
      codigo: formValue.codigo.trim(),
      nombre: formValue.nombre.trim(),
      descripcion: formValue.descripcion.trim(),
      fechaInicio: new Date(formValue.fechaInicio).toISOString(),
      fechaVencimiento: new Date(formValue.fechaVencimiento).toISOString()
    };
  
    console.log(nuevoCupon); // ✅ Aquí puedes verificar el formato antes de enviar
  
    this.authService.crearCupon(nuevoCupon).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cupón creado',
          text: 'El cupón se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error(error); // <-- muy útil para ver qué campo falló
        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'Error al crear el cupón',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  

  cancelar(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.cuponForm.reset();
      // Aquí podrías redirigir a otra página si es necesario
    }
  }
}