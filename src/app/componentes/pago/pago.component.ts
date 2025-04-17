import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InformacionOrdenDTO } from '../../dto/orden/informacion-orden-dto';
import Swal from 'sweetalert2';
import { IdOrdenDTO } from '../../dto/orden/id-orden-dto';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup;
  orden: InformacionOrdenDTO = {} as InformacionOrdenDTO;
  metodosPago: string[] = ['Tarjeta de Crédito', 'Débito', 'PayPal', 'Transferencia Bancaria'];
  idOrden!: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService) {
    this.pagoForm = this.fb.group({
      pedidoId: ['', Validators.required],
      codigoPasarela: ['', Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
      metodoPago: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  ngOnInit(): void {
    this.idOrden = this.route.snapshot.paramMap.get('id') || ''; // Obtener la ID de la URL
    console.log("ID de la orden recibida en pago:", this.idOrden);
    this.cargarDatos();
  }

  cargarDatos(): void {
    if (!this.idOrden) return;
    
    this.authService.obtenerOrden(this.idOrden).subscribe({
      next: (data) => {
        console.log(data.respuesta);
        this.orden = data.respuesta;
        this.pagoForm.patchValue({
          pedidoId: this.orden.idOrden,
          total: this.orden.total
        });
      },
      error: (error) => {
        console.log(error.mensaje);
      }
    });
  }

  realizarPago(): void {
    if (!this.idOrden) {
      Swal.fire('Error', 'No se encontró la orden', 'error');
      return;
    }

    const idOrdenDto: IdOrdenDTO = { idOrden: this.idOrden };

    this.authService.realizarPago(idOrdenDto).subscribe({
      next: (data) => {
        console.log("Pago procesado:", data);
        if (data.respuesta && data.respuesta.initPoint) {
          window.location.href = data.respuesta.initPoint; // Redirigir a Mercado Pago
        } else {
          Swal.fire('Error', 'No se pudo obtener la URL de pago', 'error');
        }
      },
      error: (error) => {
        console.error("Error en el pago:", error);
        Swal.fire('Error', 'Error al procesar el pago', 'error');
      }
    });
  }
}
