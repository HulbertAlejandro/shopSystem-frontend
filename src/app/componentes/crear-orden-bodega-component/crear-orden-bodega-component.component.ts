import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { OrdenAbastecimientoDTO } from '../../dto/abastecimiento/orden-abastecimiento-dto';
import { OrdenAbastecimientoGlobalDTO } from '../../dto/abastecimiento/orden-abastecimiento-global-dto';
import { Router } from '@angular/router';
import { EstadoReabastecimiento } from '../../dto/abastecimiento/estado-reabastecimiento';

@Component({
  selector: 'app-crear-orden-bodega-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-orden-bodega-component.component.html',
  styleUrls: ['./crear-orden-bodega-component.component.scss']
})
export class CrearOrdenBodegaComponentComponent implements OnInit {
  ordenForm!: FormGroup;
  productos: any[] = [];
  productosSeleccionados: { referencia: string, nombre: string, cantidad: number }[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.ordenForm = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });

    this.cargarProductos();
  }

  cargarProductos() {
    this.authService.listarProductosBodega().subscribe({
      next: (data) => {
        this.productos = data.respuesta;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  agregarProducto() {
    const id = this.ordenForm.value.productoId;
    const cantidad = this.ordenForm.value.cantidad;

    const producto = this.productos.find(p => p.referencia === id);

    if (!producto) return;

    const existente = this.productosSeleccionados.find(p => p.referencia === id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.productosSeleccionados.push({
        referencia: producto.referencia,
        nombre: producto.nombre,
        cantidad
      });
    }

    this.ordenForm.reset();
  }

  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  crearOrden() {
    if (this.productosSeleccionados.length === 0) {
      Swal.fire('Error', 'Debes añadir al menos un producto a la orden.', 'warning');
      return;
    }

    const productos: OrdenAbastecimientoDTO[] = this.productosSeleccionados.map(p => ({
      referenciaProducto: p.referencia,
      nombreProducto : p.nombre,
      cantidadAbastecer: p.cantidad
    }));

    const orden: OrdenAbastecimientoGlobalDTO = {
      productos: productos
    };

    this.authService.crearOrdenAbastecimiento(orden).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Orden creada correctamente', 'success').then(() => {
          this.router.navigate(['/inicio']);
        });
      },
      error: (error) => {
        let mensaje = 'Ha ocurrido un error al crear la orden.';
        const respuesta = error?.error?.respuesta;

        if (Array.isArray(respuesta)) {
          mensaje = respuesta.map((err: any) => `• ${err.campo}: ${err.mensaje}`).join('\n');
        } else if (typeof respuesta === 'string') {
          mensaje = respuesta;
        } else if (typeof error?.error === 'string') {
          mensaje = error.error;
        }

        Swal.fire('Error', mensaje, 'error');
      }
    });
  }
}
