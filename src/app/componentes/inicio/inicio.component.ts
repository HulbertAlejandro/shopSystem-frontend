import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObtenerProductoDTO } from '../../dto/producto/obtener-producto-dto';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {
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

  agregarAlCarrito(producto: any, cantidad: number) {
    if (cantidad < 1) return; // Evita agregar cantidades inválidas

    const productoEnCarrito = this.carrito.find(item => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad; // Aumenta la cantidad si ya existe en el carrito
    } else {
        this.carrito.push({ ...producto, cantidad }); // Agrega con la cantidad seleccionada
    }

    console.log("Carrito actualizado:", this.carrito);
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
