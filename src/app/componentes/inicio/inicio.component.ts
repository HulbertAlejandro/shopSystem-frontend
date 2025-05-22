import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObtenerProductoDTO } from '../../dto/producto/obtener-producto-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProductoCarritoDTO } from '../../dto/producto/producto-carrito-dto';
import { TipoProducto } from '../../dto/producto/tipo-producto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
// Componente principal de la página de inicio
export class InicioComponent {
  filtro: string = ''; // Filtro de búsqueda por nombre de producto
  filtroTemp: string = ''; // Filtro temporal para buscar
  categoriaSeleccionada: string = ''; // Categoría seleccionada para filtrar productos
  carrito: any[] = []; // Carrito de compras del usuario
  isLogged = false; // Estado de inicio de sesión del usuario
  isProveedor = false; // Estado si el usuario es proveedor
  isClient = false; // Estado si el usuario es cliente

  // Paginación
  paginaActual: number = 1; // Página actual de productos mostrados
  productosPorPagina: number = 6; // Número de productos por página

  productos: ObtenerProductoDTO[] = []; // Lista de productos obtenidos desde la API
  categorias: {valor: string, texto: string, icono: string}[] = []; // Categorías de productos disponibles

  // Constructor donde se inicializan los servicios y se cargan productos
  constructor(private authService: AuthService, private tokenService: TokenService, private router : Router) {
    this.cargarProductos(); // Cargar productos al inicializar
    this.isLogged = this.tokenService.isLogged(); // Verificar si el usuario está logueado
  
    // Obtener la información del usuario para saber si es proveedor o cliente
    const userInfo = this.tokenService.getUsuarioInfo();
    if (this.isLogged && userInfo) {
      this.isProveedor = userInfo.rol === 'PROVEEDOR' && userInfo.isVerified;
      this.isClient = userInfo.rol === 'CLIENTE' && userInfo.isVerified;
    }
  }

  // Método para obtener los productos que se mostrarán en la página actual
  get productosPaginados() {
    const startIndex = (this.paginaActual - 1) * this.productosPorPagina;
    const endIndex = startIndex + this.productosPorPagina;
    return this.productosFiltrados().slice(startIndex, endIndex); // Retorna los productos filtrados y paginados
  }

  // Método para filtrar los productos basados en el nombre y la categoría seleccionada
  productosFiltrados() {
    return this.productos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(this.filtro.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === '' || 
                             p.tipoProducto === this.categoriaSeleccionada;
      return coincideNombre && coincideCategoria;
    });
  }

  // Método para realizar la búsqueda cuando el usuario ingresa texto en el filtro
  buscar() {
    this.filtro = this.filtroTemp;
    this.paginaActual = 1; // Resetear la página a la primera cuando se realiza una nueva búsqueda
  }

  // Cambia la página actual de productos mostrados
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) {
      this.paginaActual = pagina;
      window.scrollTo(0, 0); // Desplaza la página al inicio
    }
  }

  // Establece la categoría seleccionada para filtrar productos
  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.paginaActual = 1; // Resetear la página a la primera cuando se selecciona una categoría
  }

  // Limpia todos los filtros aplicados (categoría y texto de búsqueda)
  limpiarFiltros() {
    this.categoriaSeleccionada = '';
    this.filtro = '';
    this.filtroTemp = '';
    this.paginaActual = 1; // Resetear la página a la primera
  }

  // Calcula el total de páginas basadas en el número de productos filtrados y la cantidad de productos por página
  getTotalPaginas(): number {
    return Math.ceil(this.productosFiltrados().length / this.productosPorPagina);
  }

  // Genera una lista de las páginas a mostrar en la paginación
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

  // Devuelve el número de producto que se está mostrando en la página actual
  getProductosMostradosInicio(): number {
    return (this.paginaActual - 1) * this.productosPorPagina + 1;
  }

  // Devuelve el último producto mostrado en la página actual
  getProductosMostradosFin(): number {
    return Math.min(this.paginaActual * this.productosPorPagina, this.productosFiltrados().length);
  }

  // Método para cargar los productos desde la API
  cargarProductos(): void {
    console.log("ROL ", this.tokenService.getRol())
    if(this.tokenService.getRol() == "PROVEEDOR"){
      this.authService.listarProductosBodega().subscribe({
            next: (data) => {
              this.productos = data.respuesta; // Asignar los productos obtenidos
              this.actualizarCategorias(); // Actualizar las categorías disponibles
            },
            error: (error) => {
              console.error('Error al cargar productos:', error); // Mostrar error en caso de fallo
            },
      });
    }

    if(this.tokenService.getRol() == "ADMINISTRADOR" || this.tokenService.getRol() == "CLIENTE"){
      this.authService.listarProductos().subscribe({
            next: (data) => {
              this.productos = data.respuesta; // Asignar los productos obtenidos
              this.actualizarCategorias(); // Actualizar las categorías disponibles
            },
            error: (error) => {
              console.error('Error al cargar productos:', error); // Mostrar error en caso de fallo
            },
      });
    }
    
  }

  // Método para actualizar la lista de categorías disponibles
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

  // Método para agregar productos al carrito
  agregarAlCarrito(producto: ObtenerProductoDTO, cantidad: number) {
    if (cantidad < 1) return; // No permitir cantidades negativas o cero
  
    if (!this.tokenService.isLogged()) {
      this.tokenService.logout(); // Deslogear si no está autenticado
      return;
    }
  
    // Mapear el tipo de producto a un valor del enum TipoProducto
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

  // Método para mapear el tipo de producto de su descripción a su valor en el enum
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
    
    return mapeo[tipo] || TipoProducto.ALIMENTOS; // Retorna un valor por defecto si no se encuentra el tipo
  }

  // Método para navegar a la página de edición de un producto específico
  editarProducto(id: string): void {
    this.router.navigate(['/editar-producto', id]); // Navega con el ID del producto
  }
}
