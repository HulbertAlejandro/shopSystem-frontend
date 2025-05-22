import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa herramientas para formularios reactivos y validaciones
import { ReactiveFormsModule } from '@angular/forms'; // Importa el módulo para formularios reactivos
import Swal from 'sweetalert2'; // Librería para mostrar alertas visuales
import { Router } from '@angular/router'; // Importa Router para realizar redirecciones de navegación
import { AuthService } from '../../services/auth.service'; // Servicio para manejar la autenticación y las operaciones de productos
import { ImageService } from '../../services/image-service.service'; // Servicio para manejar la carga de imágenes
import { TipoProducto } from '../../dto/producto/tipo-producto'; // Enum que contiene los tipos de productos disponibles
import { CrearProductoDTO } from '../../dto/producto/crear-producto-dto'; // DTO que contiene los datos necesarios para registrar un nuevo producto

@Component({
  selector: 'app-registro-producto', // Selector del componente
  standalone: true, // Indica que este componente es autónomo
  imports: [ReactiveFormsModule], // Módulos necesarios para este componente
  templateUrl: './registro-producto.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./registro-producto.component.css'] // Ruta al archivo de estilos CSS
})
export class RegistroProductoComponent {
  productoForm!: FormGroup; // Definición del formulario reactivo para el registro de productos
  tiposProductos = Object.values(TipoProducto); // Obtiene los tipos de productos disponibles (enum)
  imagenSeleccionada!: File; // Variable para almacenar la imagen seleccionada por el usuario
  imagenPrevia: string | ArrayBuffer | null = null; // Variable para almacenar la URL de la imagen previa seleccionada

  // Constructor que inyecta los servicios necesarios para este componente
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private imagenService: ImageService) {
    this.crearFormulario(); // Llama al método para crear el formulario cuando se inicializa el componente
  }

  // Método privado para crear el formulario reactivo
  private crearFormulario() {
    this.productoForm = this.formBuilder.group({
      referencia: ['', [Validators.required]], // Campo para la referencia del producto, obligatorio
      nombre: ['', [Validators.required]], // Campo para el nombre del producto, obligatorio
      tipoProducto: ['', [Validators.required]], // Campo para el tipo de producto, obligatorio
      imageUrl: ['', [Validators.required]], // Campo para la URL de la imagen del producto, obligatorio
      descripcion: ['', [Validators.required]], // Campo para la descripción del producto, obligatorio
      unidades: [1, [Validators.required, Validators.min(1)]], // Campo para las unidades del producto, obligatorio y con validación mínima
      precio: [0, [Validators.required, Validators.min(0.01)]] // Campo para el precio del producto, obligatorio y con validación mínima
    });
  }

  // Método para seleccionar una imagen desde el dispositivo
  public seleccionarImagen(event: any): void {
    if (event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];

      // Previsualizar la imagen seleccionada
      const reader = new FileReader();
      reader.readAsDataURL(this.imagenSeleccionada); // Convierte la imagen en una URL para previsualizarla
      reader.onload = () => {
        this.imagenPrevia = reader.result as string; // Asigna la imagen previa una vez cargada
      };
    }
  }

  // Método para subir la imagen al servidor y obtener la URL de la imagen
  public subirImagen(callback?: () => void): void {
    if (!this.imagenSeleccionada) {
      Swal.fire('Error', 'Seleccione una imagen antes de subir.', 'error'); // Si no se selecciona una imagen, muestra un error
      return;
    }
  
    // Llama al servicio de imágenes para subir la imagen seleccionada
    this.imagenService.uploadImage(this.imagenSeleccionada).subscribe({
      next: (url: string) => {
        console.log('URL de imagen recibida:', url);
        this.productoForm.patchValue({ imageUrl: url }); // Asigna la URL de la imagen al campo del formulario

        console.log('Formulario después de asignar la URL:', this.productoForm.value); // Verificar si la URL se asignó correctamente
  
        Swal.fire('Imagen Cargada', 'La imagen se subió correctamente.', 'success') // Muestra una alerta de éxito
          .then(() => {
            if (callback) callback(); // Ejecuta el callback si se pasó como argumento
          });
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen. Inténtelo de nuevo.', 'error'); // Muestra una alerta de error si no se pudo subir la imagen
      }
    });
  }

  // Método para registrar un nuevo producto
  registrarProducto() {
    if (this.productoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error'); // Si el formulario es inválido, muestra un error
      return;
    }
  
    const nuevoProducto: CrearProductoDTO = {
      ...this.productoForm.value, // Obtiene los valores del formulario
      tipoProducto: this.productoForm.value.tipoProducto as TipoProducto // Convierte el tipo de producto al enum correspondiente
    };
  
    console.log('Datos del producto a registrar:', nuevoProducto); // Verifica los datos antes de enviarlos
  
    // Llama al servicio de autenticación para crear el producto
    this.authService.crearProducto(nuevoProducto).subscribe({
      next: () => Swal.fire('Producto registrado', 'El producto se ha registrado correctamente.', 'success') // Si el producto se registra correctamente, muestra una alerta de éxito
        .then(() => this.router.navigate(['/productos'])), // Redirige a la lista de productos
      error: (error) => {
        console.log(error);
        Swal.fire('Error', error.error.respuesta, 'error'); // Si ocurre un error, muestra una alerta con el mensaje de error
      }
    });
  }
}
