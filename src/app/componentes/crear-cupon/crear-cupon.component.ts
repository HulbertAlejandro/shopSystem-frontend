import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cupon.component.html',
  styleUrls: ['./crear-cupon.component.css']
})
export class CrearCuponComponent {
  cuponForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cuponForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      nombre: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      descripcion: [''],
      usoUnico: [false]
    });
  }

  crearCupon(): void {
    if (this.cuponForm.valid) {
      const formValue = this.cuponForm.value;
      // Aquí iría la lógica para guardar el cupón
      console.log('Cupón creado:', formValue);
      alert(`Cupón "${formValue.nombre}" creado exitosamente!`);
      this.cuponForm.reset();
    } else {
      alert('Por favor complete todos los campos requeridos correctamente.');
    }
  }

  cancelar(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.cuponForm.reset();
      // Aquí podrías redirigir a otra página si es necesario
    }
  }
}