import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image-service.service';
import { TipoProducto } from '../../dto/producto/tipo-producto';
import { EditarProductoDTO } from '../../dto/producto/editar-producto-dto';

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
  productoSistema!: EditarProductoDTO;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private imagenService: ImageService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['id'];
    this.cargarProducto();
  }

  private cargarProducto(): void {
    this.authService.obtenerProducto(this.productoId).subscribe({
      next: (producto: any) => {

        this.productoSistema = producto.respuesta
        
        const tipoMostrar = this.mapearTipoProductoParaVista(producto.tipoProducto);
        
        this.productoForm.patchValue({
          referencia: producto.referencia,
          nombre: producto.nombre,
          tipoProducto: tipoMostrar,
          imageUrl: producto.imageUrl,
          descripcion: producto.descripcion,
          unidades: producto.unidades,
          precio: producto.precio
        });
      },
      error: (error: any) => {
        console.error('Error al cargar producto:', error);
        Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        this.router.navigate(['/productos']);
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

  private crearFormulario() {
    this.productoForm = this.formBuilder.group({
      referencia: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      unidades: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
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

  /*

  actualizarProducto() {
    if (this.productoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error');
      return;
    }
  
    const descripcionAClave: Record<string, TipoProducto> = {
      "Productos alimenticios": TipoProducto.ALIMENTOS,
      "Bebidas y refrescos": TipoProducto.BEBIDAS,
      "Productos lácteos": TipoProducto.LACTEOS,
      "Carnes y embutidos": TipoProducto.CARNES,
      "Panadería y repostería": TipoProducto.PANADERIA,
      "Frutas y verduras": TipoProducto.FRUTAS_VERDURAS,
      "Alimentos congelados": TipoProducto.CONGELADOS,
      "Productos de limpieza": TipoProducto.LIMPIEZA,
      "Productos de higiene personal": TipoProducto.HIGIENE,
      "Productos para mascotas": TipoProducto.MASCOTAS,
      "Artículos para el hogar": TipoProducto.HOGAR,
      "Electrodomésticos y electrónica": TipoProducto.ELECTRONICA
    };
  
    const productoActualizado = this.productoForm.value as CrearProductoDTO;
    productoActualizado.tipoProducto = descripcionAClave[this.productoForm.value.tipoProducto];
  
    // Implementación temporal - deberás adaptarla a tu AuthService real
    this.authService.actualizarProducto(this.productoId, productoActualizado).subscribe({
      next: () => {
        Swal.fire('Producto actualizado', 'El producto se ha actualizado correctamente.', 'success')
          .then(() => this.router.navigate(['/productos']));
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire('Error', error.error?.respuesta || 'Error al actualizar el producto', 'error');
      }
    });
  }

  */

  cancelarEdicion() {
    this.router.navigate(['/productos']);
  }
}