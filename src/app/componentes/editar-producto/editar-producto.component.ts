import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image-service.service';
import { TipoProducto } from '../../dto/producto/tipo-producto';
import { EditarProductoDTO } from '../../dto/producto/editar-producto-dto';
import { InformacionProductoDTO } from '../../dto/producto/informacion-producto-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';

@Component({
  selector: 'app-editar-producto',  // Define el selector del componente
  standalone: true,  // Este componente es independiente y no requiere un módulo externo
  imports: [ReactiveFormsModule],  // Importa ReactiveFormsModule para usar formularios reactivos
  templateUrl: './editar-producto.component.html',  // Archivo de plantilla para el componente
  styleUrls: ['./editar-producto.component.css']  // Archivo de estilos CSS para el componente
})
export class EditarProductoComponent implements OnInit {
  productoForm!: FormGroup;  // Formulario reactivo para editar los productos
  tiposProductos = Object.values(TipoProducto);  // Lista de tipos de productos disponibles
  imagenSeleccionada!: File;  // Imagen seleccionada por el usuario
  imagenPrevia: string | ArrayBuffer | null = null;  // Previsualización de la imagen antes de subirla
  productoId!: string;  // ID del producto que se va a editar

  // Información del producto que se cargará desde el backend
  productoLlegada: InformacionProductoDTO = {
    referencia: '',
    nombre: '',
    tipoProducto: TipoProducto.ALIMENTOS,
    imageUrl: '',
    descripcion: '',
    unidades: 0,
    precio: 0
  };

  // Constructor del componente
  constructor(
    private formBuilder: FormBuilder,  // FormBuilder para crear formularios reactivos
    private router: Router,  // Router para la navegación entre páginas
    private route: ActivatedRoute,  // ActivatedRoute para obtener parámetros de la ruta
    private authService: AuthService,  // Servicio de autenticación y gestión de productos
    private imagenService: ImageService  // Servicio para subir imágenes
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['id'];  // Obtiene el ID del producto desde la URL
    this.cargarProducto();  // Carga los datos del producto
    this.crearFormulario();  // Crea el formulario reactivo
  }

  // Método para crear el formulario reactivo con sus validaciones
  private crearFormulario() {
    this.productoForm = this.formBuilder.group({
      referencia: [{ value: '', disabled: true }, [Validators.required]],  // Referencia del producto (solo lectura)
      nombre: ['', [Validators.required]],  // Nombre del producto
      tipoProducto: ['', [Validators.required]],  // Tipo del producto
      imageUrl: ['', [Validators.required]],  // URL de la imagen del producto
      unidades: [1, [Validators.required, Validators.min(1)]],  // Unidades disponibles (mínimo 1)
      precio: [0, [Validators.required, Validators.min(0.01)]],  // Precio del producto (mínimo 0.01)
      descripcion: ['', [Validators.required]]  // Descripción del producto
    });
  }

  // Método para cargar los datos del producto a editar desde el backend
  private cargarProducto(): void {
    this.authService.obtenerProducto(this.productoId).subscribe({
      next: (data: MensajeDTO) => {
        const producto = data.respuesta as InformacionProductoDTO;

        // Rellena el formulario con los datos del producto
        this.productoForm.patchValue({
          referencia: producto.referencia,
          nombre: producto.nombre,
          tipoProducto: producto.tipoProducto,
          imageUrl: producto.imageUrl,
          descripcion: producto.descripcion,
          unidades: producto.unidades,
          precio: producto.precio
        });

        // Muestra la imagen previa del producto
        this.imagenPrevia = producto.imageUrl;
      }
    });
  }

  // Método para mapear el tipo de producto a una cadena legible para la vista
  private mapearTipoProductoParaVista(tipo: TipoProducto): string {
    const mapeo: Record<TipoProducto, string> = {
      [TipoProducto.ALIMENTOS]: "Productos alimenticios",
      [TipoProducto.BEBIDAS]: "Bebidas y refrescos",
      [TipoProducto.LACTEOS]: "Productos lácteos",
      [TipoProducto.CARNES]: "Carnes y embutidos",
      [TipoProducto.PANADERIA]: "Panadería y repostería",
      [TipoProducto.FRUTAS_VERDURAS]: "Frutas y verduras",
      [TipoProducto.CONGELADOS]: "Alimentos congelados",
      [TipoProducto.LIMPIEZA]: "Productos de limpieza",
      [TipoProducto.HIGIENE]: "Productos de higiene personal",
      [TipoProducto.MASCOTAS]: "Productos para mascotas",
      [TipoProducto.HOGAR]: "Artículos para el hogar",
      [TipoProducto.ELECTRONICA]: "Electrodomésticos y electrónica"
    };
    return mapeo[tipo] || tipo;
  }

  // Método que se ejecuta cuando el usuario selecciona una nueva imagen para el producto
  public seleccionarImagen(event: any): void {
    if (event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];  // Obtiene el archivo de imagen seleccionado
      const reader = new FileReader();
      reader.readAsDataURL(this.imagenSeleccionada);  // Lee la imagen como una URL de datos
      reader.onload = () => {
        this.imagenPrevia = reader.result as string;  // Muestra la previsualización de la imagen
      };
    }
  }

  // Método para subir la imagen seleccionada al backend
  public subirImagen(callback?: () => void): void {
    if (!this.imagenSeleccionada) {
      Swal.fire('Error', 'Seleccione una imagen antes de subir.', 'error');  // Verifica si se seleccionó una imagen
      return;
    }

    this.imagenService.uploadImage(this.imagenSeleccionada).subscribe({
      next: (url: string) => {
        this.productoForm.patchValue({ imageUrl: url });  // Actualiza la URL de la imagen en el formulario
        Swal.fire('Imagen Cargada', 'La imagen se subió correctamente.', 'success')
          .then(() => {
            if (callback) callback();  // Llama al callback si está presente
          });
      },
      error: (error: any) => {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen. Inténtelo de nuevo.', 'error');
      }
    });
  }

  // Método para editar el producto con los datos del formulario
  public editarProducto(): void {
    if (this.productoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error');  // Verifica si el formulario es válido
      return;
    }

    const rawValues = this.productoForm.getRawValue();  // Obtiene los valores sin procesar del formulario

    // Crea un objeto DTO para editar el producto
    const productoActualizado: EditarProductoDTO = {
      ...rawValues,
      tipoProducto: rawValues.tipoProducto as TipoProducto  // Asegura que tipoProducto sea del tipo adecuado
    };

    console.log(productoActualizado);
    console.log(productoActualizado.imageUrl, "url nueva");

    // Llama al servicio para editar el producto en el backend
    this.authService.editarProducto(productoActualizado).subscribe({
      next: (data) => {
        Swal.fire('Producto actualizado', data.respuesta, 'success')
          .then(() => this.router.navigate(['/home']));  // Redirige al usuario después de la actualización
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el producto', 'error');
      }
    });
  }

  // Método para eliminar el producto
  eliminarProducto(): void {
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
        this.authService.eliminarProducto(this.productoId).subscribe({
          next: (data) => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.router.navigate(['/home']);  // Redirige al usuario después de la eliminación
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', error.error?.respuesta || 'No se logró eliminar el producto', 'error');
          }
        });
      }
    });
  }

  // Método para cancelar la edición y regresar a la página principal
  public cancelarEdicion(): void {
    this.router.navigate(['/home']);  // Redirige a la página principal
  }
}
