import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObtenerProductoDTO } from '../../dto/producto/obtener-producto-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProductoCarritoDTO } from '../../dto/producto/producto-carrito-dto';
import { TipoProducto } from '../../dto/producto/tipo-producto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  filtro: string = '';
  filtroTemp: string = '';
  categoriaSeleccionada: string = '';
  carrito: any[] = [];

  productos : ObtenerProductoDTO [] = [];

  categorias = [...new Set(this.productos.map(p => p.tipoProducto))];

  constructor(private authService: AuthService, private tokenService : TokenService) {
      this.cargarProductos();
  }

  productosFiltrados() {
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase()) &&
      (this.categoriaSeleccionada === '' || p.tipoProducto === this.categoriaSeleccionada)
    );
  }

  buscar() {
    this.filtro = this.filtroTemp;
  }

  agregarAlCarrito(producto: ObtenerProductoDTO, cantidad: number) {
    if (cantidad < 1) return;
  
    if (!this.tokenService.isLogged()) {
      this.tokenService.logout();
      return;
    }
  
    const tipoProducto = this.mapearTipoProducto(producto.tipoProducto);
  
    const productoCarritoDTO: ProductoCarritoDTO = {
      id: producto.referencia,
      idUsuario: this.tokenService.getIDCuenta(),
      nombreProducto: producto.nombre,
      tipoProducto: tipoProducto, // Conversión explícita
      unidades: Math.round(cantidad), // Asegura que sea entero
      precio: producto.precio
    };
  
    // Console.log detallado
    console.log('Datos a enviar al backend:', {
      id: productoCarritoDTO.id,
      idUsuario: productoCarritoDTO.idUsuario,
      nombreProducto: productoCarritoDTO.nombreProducto,
      tipoProducto: productoCarritoDTO.tipoProducto,
      unidades: productoCarritoDTO.unidades,
      precio: productoCarritoDTO.precio,
    });
  
    this.authService.agregarItem(productoCarritoDTO).subscribe({
      next: (respuesta) => {

        Swal.fire({
                  title: 'Producto Agregado',
                  text: 'El producto ha sido agregado al carrito',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
      },
      error: (error) => {
              console.log(error);
              Swal.fire({
                title: 'Error',
                text: error.error.respuesta,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
    });
  }

  // Método para mapear el tipo de producto si es necesario
  private mapearTipoProducto(tipo: string): TipoProducto {
    // Si ya está en el formato correcto
    if (Object.values(TipoProducto).includes(tipo as TipoProducto)) {
      return tipo as TipoProducto;
    }
    
    // Mapeo de valores alternativos
    const mapeo: {[key: string]: TipoProducto} = {
      'Productos alimenticios': TipoProducto.ALIMENTOS,
      'Bebidas y refrescos': TipoProducto.BEBIDAS,
      // ... otros mapeos si son necesarios
    };
    
    return mapeo[tipo] || TipoProducto.ALIMENTOS; // Valor por defecto
  }

  cargarProductos(): void {
    this.authService.listarProductos().subscribe({
        next: (data) => {
            console.log(data.respuesta); // Verificar el contenido de los datos
            this.productos = data.respuesta;
        },
        error: (error) => {
            console.log(error.mensaje);
        },
    });
}
}
