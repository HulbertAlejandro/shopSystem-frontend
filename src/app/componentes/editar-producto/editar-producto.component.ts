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
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  productoForm!: FormGroup;
  tiposProductos = Object.values(TipoProducto);
  imagenSeleccionada!: File;
  imagenPrevia: string | ArrayBuffer | null = null;
  productoId!: string;

  productoLlegada: InformacionProductoDTO = {
    referencia: '',
    nombre: '',
    tipoProducto: TipoProducto.ALIMENTOS,
    imageUrl: '',
    descripcion: '',
    unidades: 0,
    precio: 0
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private imagenService: ImageService
  ) {}

  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['id'];
    this.cargarProducto();
    this.crearFormulario();
  }

  private crearFormulario() {
    this.productoForm = this.formBuilder.group({
      referencia: [{ value: '', disabled: true }, [Validators.required]],
      nombre: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      unidades: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required]]
    });
  }

  private cargarProducto(): void {
    this.authService.obtenerProducto(this.productoId).subscribe({
      next: (data: MensajeDTO) => {
        const producto = data.respuesta as InformacionProductoDTO;

        this.productoForm.patchValue({
          referencia: producto.referencia,
          nombre: producto.nombre,
          tipoProducto: producto.tipoProducto,
          imageUrl: producto.imageUrl,
          descripcion: producto.descripcion,
          unidades: producto.unidades,
          precio: producto.precio
        });

        this.imagenPrevia = producto.imageUrl;
      }
    });
  }

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

  public seleccionarImagen(event: any): void {
    if (event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.imagenSeleccionada);
      reader.onload = () => {
        this.imagenPrevia = reader.result as string;
      };
    }
  }

  public subirImagen(callback?: () => void): void {
    if (!this.imagenSeleccionada) {
      Swal.fire('Error', 'Seleccione una imagen antes de subir.', 'error');
      return;
    }

    this.imagenService.uploadImage(this.imagenSeleccionada).subscribe({
      next: (url: string) => {
        this.productoForm.patchValue({ imageUrl: url });
        Swal.fire('Imagen Cargada', 'La imagen se subió correctamente.', 'success')
          .then(() => {
            if (callback) callback();
          });
      },
      error: (error: any) => {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen. Inténtelo de nuevo.', 'error');
      }
    });
  }

  public editarProducto(): void {
    if (this.productoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error');
      return;
    }

    const rawValues = this.productoForm.getRawValue();

    const productoActualizado: EditarProductoDTO = {
      ...rawValues,
      tipoProducto: rawValues.tipoProducto as TipoProducto
    };

    console.log(productoActualizado);
    console.log(productoActualizado.imageUrl, "url nueva");

    this.authService.editarProducto(productoActualizado).subscribe({
      next: (data) => {
        Swal.fire('Producto actualizado', data.respuesta, 'success')
          .then(() => this.router.navigate(['/home']));
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el producto', 'error');
      }
    });
  }

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
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', error.error?.respuesta || 'No se logró eliminar el producto', 'error');
          }
        });
      }
    });
  }

  public cancelarEdicion(): void {
    this.router.navigate(['/home']);
  }
}
