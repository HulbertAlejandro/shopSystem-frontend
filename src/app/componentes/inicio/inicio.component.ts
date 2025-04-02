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
// ... (imports y decorador permanecen iguales)

export class InicioComponent {
  filtro: string = '';
  filtroTemp: string = '';
  categoriaSeleccionada: string = '';
  carrito: any[] = [];

  // Paginación
  paginaActual: number = 1;
  productosPorPagina: number = 6;

  productos: ObtenerProductoDTO[] = [];
  categorias: {valor: string, texto: string, icono: string}[] = [];

  constructor(private authService: AuthService, private tokenService: TokenService) {
    this.cargarProductos();
  }

  get productosPaginados() {
    const startIndex = (this.paginaActual - 1) * this.productosPorPagina;
    const endIndex = startIndex + this.productosPorPagina;
    return this.productosFiltrados().slice(startIndex, endIndex);
  }

  productosFiltrados() {
    return this.productos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(this.filtro.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === '' || 
                             p.tipoProducto === this.categoriaSeleccionada;
      return coincideNombre && coincideCategoria;
    });
  }

  buscar() {
    this.filtro = this.filtroTemp;
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) {
      this.paginaActual = pagina;
      window.scrollTo(0, 0);
    }
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = '';
    this.filtro = '';
    this.filtroTemp = '';
    this.paginaActual = 1;
  }

  getTotalPaginas(): number {
    return Math.ceil(this.productosFiltrados().length / this.productosPorPagina);
  }

  getPaginas(): number[] {
    const totalPaginas = this.getTotalPaginas();
    const paginas: number[] = [];
    
    // Mostrar máximo 5 páginas en la paginación
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);
    
    // Ajustar si estamos cerca del final
    if (fin - inicio < 4 && inicio > 1) {
      inicio = Math.max(1, fin - 4);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  getProductosMostradosInicio(): number {
    return (this.paginaActual - 1) * this.productosPorPagina + 1;
  }

  getProductosMostradosFin(): number {
    return Math.min(this.paginaActual * this.productosPorPagina, this.productosFiltrados().length);
  }

  cargarProductos(): void {
    this.authService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data.respuesta;
        this.actualizarCategorias();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  private actualizarCategorias(): void {
    this.categorias = [
      { valor: 'ALIMENTOS', texto: 'Alimentos', icono: '🍎' },
      { valor: 'BEBIDAS', texto: 'Bebidas', icono: '🥤' },
      { valor: 'LACTEOS', texto: 'Lácteos', icono: '🥛' },
      { valor: 'CARNES', texto: 'Carnes', icono: '🥩' },
      { valor: 'PANADERIA', texto: 'Panadería', icono: '🍞' },
      { valor: 'FRUTAS_VERDURAS', texto: 'Frutas/Verduras', icono: '🥦' },
      { valor: 'CONGELADOS', texto: 'Congelados', icono: '❄️' },
      { valor: 'LIMPIEZA', texto: 'Limpieza', icono: '🧼' },
      { valor: 'HIGIENE', texto: 'Higiene', icono: '🧴' },
      { valor: 'MASCOTAS', texto: 'Mascotas', icono: '🐶' },
      { valor: 'HOGAR', texto: 'Hogar', icono: '🏠' },
      { valor: 'ELECTRONICA', texto: 'Electrónica', icono: '📱' }
    ];
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
      tipoProducto: tipoProducto,
      unidades: Math.round(cantidad),
      precio: producto.precio
    };
  
    this.authService.agregarItem(productoCarritoDTO).subscribe({
      next: (respuesta) => {
        Swal.fire({
          title: 'Producto Agregado',
          text: 'El producto ha sido agregado al carrito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
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

  private mapearTipoProducto(tipo: string): TipoProducto {
    if (Object.values(TipoProducto).includes(tipo as TipoProducto)) {
      return tipo as TipoProducto;
    }
    
    // Mapeo de descripciones a valores enum
    const mapeo: {[key: string]: TipoProducto} = {
      'Productos alimenticios': TipoProducto.ALIMENTOS,
      'Bebidas y refrescos': TipoProducto.BEBIDAS,
      'Productos lácteos': TipoProducto.LACTEOS,
      'Carnes y embutidos': TipoProducto.CARNES,
      'Panadería y repostería': TipoProducto.PANADERIA,
      'Frutas y verduras': TipoProducto.FRUTAS_VERDURAS,
      'Alimentos congelados': TipoProducto.CONGELADOS,
      'Productos de limpieza': TipoProducto.LIMPIEZA,
      'Productos de higiene personal': TipoProducto.HIGIENE,
      'Productos para mascotas': TipoProducto.MASCOTAS,
      'Artículos para el hogar': TipoProducto.HOGAR,
      'Electrodomésticos y electrónica': TipoProducto.ELECTRONICA
    };
    
    return mapeo[tipo] || TipoProducto.ALIMENTOS;
  }


}