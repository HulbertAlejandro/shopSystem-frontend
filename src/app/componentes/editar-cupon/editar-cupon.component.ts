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
  cuponForm: FormGroup;  // Formulario reactivo para editar el cupón
  tiposCupon = ["UNICO", "MULTIPLE"];  // Tipos de cupones disponibles
  estadoCupon = ["DISPONIBLE", "NO_DISPONIBLE"];  // Estados de cupones disponibles
  cuponId!: string;  // ID del cupón que se va a editar
  cupones: any[] = [];  // Array para almacenar los cupones obtenidos desde el backend

  // Constructor del componente
  constructor(
    private fb: FormBuilder,  // FormBuilder para crear formularios reactivos
    private authService: AuthService,  // Servicio de autenticación para interactuar con el backend
    private route: ActivatedRoute,  // ActivatedRoute para obtener parámetros de la ruta
    private router: Router  // Router para navegar entre rutas
  ) {
    // Inicializa el formulario reactivo
    this.cuponForm = this.fb.group({
      codigo: ['', Validators.required],  // Código del cupón
      nombre: ['', Validators.required],  // Nombre del cupón
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(100)]],  // Descuento del cupón (entre 0 y 100)
      tipo: ['', Validators.required],  // Tipo del cupón
      estado: ['', Validators.required],  // Estado del cupón
      fechaVencimiento: ['', Validators.required]  // Fecha de vencimiento del cupón
    });
  }

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarCupones();  // Carga los cupones desde el backend
  }

  // Método para cargar los cupones desde el backend
  cargarCupones(): void {
    this.authService.obtenerCupones().subscribe({
      next: (data) => {
        this.cupones = data.respuesta;  // Almacena los cupones obtenidos
      },
      error: (err) => {
        // Si hay un error, muestra una alerta de error
        Swal.fire('Error', 'No se pudieron cargar los cupones', 'error');
      }
    });
  }

  // Método que se ejecuta cuando el usuario selecciona un cupón del menú desplegable
  onCuponSeleccionado(event: Event): void {
    const codigoSeleccionado = (event.target as HTMLSelectElement).value;  // Obtiene el código del cupón seleccionado
    const cuponSeleccionado = this.cupones.find(c => c.codigo === codigoSeleccionado);  // Busca el cupón en el array

    if (cuponSeleccionado) {
      this.cuponId = cuponSeleccionado.id;  // Asigna el ID del cupón seleccionado
      console.log('Cupon seleccionado:', cuponSeleccionado);

      // Pone los valores del cupón en el formulario reactivo
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

  // Método para formatear la fecha de vencimiento al formato adecuado para el input
  private formatearFechaParaInput(fecha: string | Date): string {
    if (!fecha) return '';
  
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida recibida:', fecha);
      return '';
    }
  
    // Formatea la fecha al formato "yyyy-MM-ddTHH:mm"
    return date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }
  
  // Método para editar el cupón
  editarCupon(): void {
    const cupon: EditarCuponDTO = {
      id: this.cuponId,  // Asigna el ID del cupón
      ...this.cuponForm.value  // Obtiene los datos del formulario
    };
  
    // Llama al servicio para editar el cupón en el backend
    this.authService.editarCupon(cupon).subscribe({
      next: () => {
        // Si la edición es exitosa, muestra una alerta de éxito
        Swal.fire('Cupón actualizado', 'El cupón se ha actualizado correctamente.', 'success')
          .then(() => this.router.navigate(['/cupones']));  // Redirige al listado de cupones
      },
      error: (error: any) => {
        // Si ocurre un error, muestra una alerta de error
        console.error(error);
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el cupón', 'error');
      }
    });
  }
  

  // Método para eliminar un cupón
  eliminarCupon(): void {
    // Muestra una alerta de confirmación antes de eliminar
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
        // Si el usuario confirma, elimina el cupón
        this.authService.eliminarCupon(this.cuponId).subscribe({
          next: (data) => {
            Swal.fire('Eliminado', 'El cupón ha sido eliminado correctamente.', 'success');
            this.router.navigate(['/cupones']);  // Redirige al listado de cupones
          },
          error: (error) => {
            // Si ocurre un error, muestra una alerta de error
            console.error(error);
            Swal.fire('Error', error.error?.respuesta || 'No se logró eliminar el cupón', 'error');
          }
        });
      }
    });
  }
  
  // Método para cancelar la edición del cupón y regresar al listado
  cancelarEdicion(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/cupones']);  // Redirige al listado de cupones
    }
  }
}
