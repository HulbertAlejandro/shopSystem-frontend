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
  standalone: true, // Indica que este componente puede funcionar de manera independiente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios para trabajar con formularios reactivos y funcionalidades comunes
  templateUrl: './crear-cupon.component.html',
  styleUrls: ['./crear-cupon.component.css']
})
export class CrearCuponComponent {
  // Formulario reactivo para crear un cupón
  cuponForm: FormGroup;

  // Opciones disponibles para el tipo de cupón
  tiposCupon = ["UNICO", "MULTIPLE"];

  // Opciones disponibles para el estado del cupón
  estadoCupon = ["DISPONIBLE", "NO_DISPONIBLE"];

  // Constructor con inyección de dependencias para el FormBuilder y AuthService
  constructor(private fb: FormBuilder, private authService : AuthService) {
    // Inicialización del formulario con validaciones
    this.cuponForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]], // Requiere mayúsculas y números
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(100)]], // Valor entre 0 y 100
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaVencimiento: ['', Validators.required]
    });
  }

  // Método para crear el cupón a partir de los datos del formulario
  crearCupon(): void {
    const formValue = this.cuponForm.value;

    // Se construye un objeto CrearCuponDTO con formato adecuado para el backend
    const nuevoCupon: CrearCuponDTO = {
      ...formValue,
      codigo: formValue.codigo.trim(), // Elimina espacios extra
      nombre: formValue.nombre.trim(),
      descripcion: formValue.descripcion.trim(),
      fechaInicio: new Date(formValue.fechaInicio).toISOString(), // Formato ISO para fechas
      fechaVencimiento: new Date(formValue.fechaVencimiento).toISOString()
    };

    console.log(nuevoCupon); // ✅ Aquí puedes verificar el formato antes de enviar

    // Llamada al servicio para enviar el cupón al backend
    this.authService.crearCupon(nuevoCupon).subscribe({
      next: (data) => {
        // Muestra alerta de éxito si se crea correctamente
        Swal.fire({
          title: 'Cupón creado',
          text: 'El cupón se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error(error); // <-- muy útil para ver qué campo falló
        // Muestra alerta de error con mensaje personalizado si lo hay
        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'Error al crear el cupón',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Método para cancelar la creación del cupón
  cancelar(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.cuponForm.reset(); // Resetea el formulario
      // Aquí podrías redirigir a otra página si es necesario
    }
  }
}
