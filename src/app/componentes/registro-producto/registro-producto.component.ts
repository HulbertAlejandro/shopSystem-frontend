import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CrearProductoDTO } from '../../dto/crear-producto-dto';
import { TipoProducto } from '../../dto/tipo-producto';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image-service.service';

@Component({
  selector: 'app-registro-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.css'
})
export class RegistroProductoComponent {
  productoForm!: FormGroup;
  tiposProductos = Object.values(TipoProducto);
  imagenSeleccionada!: File;
  imagenPrevia: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private imagenService: ImageService) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.productoForm = this.formBuilder.group({
      referencia: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      unidades: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }



  public seleccionarImagen(event: any): void {
    if (event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];

      // Previsualizar la imagen seleccionada
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
        console.log('URL de imagen recibida:', url);
        this.productoForm.patchValue({ imageUrl: url });
  
        console.log('Formulario después de asignar la URL:', this.productoForm.value); // Verificar si la URL se asignó
  
        Swal.fire('Imagen Cargada', 'La imagen se subió correctamente.', 'success')
          .then(() => {
            if (callback) callback(); // Ejecutar callback si se pasó como argumento
          });
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen. Inténtelo de nuevo.', 'error');
      }
    });
  }
  
  
    
  registrarProducto() {
    if (this.productoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error');
      return;
    }
  
    const descripcionAClave: Record<string, string> = {
      "Productos alimenticios": "ALIMENTOS",
      "Bebidas y refrescos": "BEBIDAS",
      "Productos lácteos": "LACTEOS",
      "Carnes y embutidos": "CARNES",
      "Panadería y repostería": "PANADERIA",
      "Frutas y verduras": "FRUTAS_VERDURAS",
      "Alimentos congelados": "CONGELADOS",
      "Productos de limpieza": "LIMPIEZA",
      "Productos de higiene personal": "HIGIENE",
      "Productos para mascotas": "MASCOTAS",
      "Artículos para el hogar": "HOGAR",
      "Electrodomésticos y electrónica": "ELECTRONICA"
    };
  
    const nuevoProducto = this.productoForm.value as CrearProductoDTO;
    nuevoProducto.tipoProducto = descripcionAClave[this.productoForm.value.tipoProducto] as TipoProducto;
  
    console.log('Datos del producto a registrar:', nuevoProducto);
  
    this.authService.crearProducto(nuevoProducto).subscribe({
      next: () => Swal.fire('Producto registrado', 'El producto se ha registrado correctamente.', 'success')
        .then(() => this.router.navigate(['/productos'])),
      error: (error) => {
        console.log(error);
        Swal.fire('Error', error.error.respuesta, 'error');
      }
    });
  }
  
    
}
