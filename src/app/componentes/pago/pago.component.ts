import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InformacionOrdenDTO } from '../../dto/orden/informacion-orden-dto';

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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService : AuthService) {
    this.pagoForm = this.fb.group({
      pedidoId: ['', Validators.required],
      codigoPasarela: ['', Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
      metodoPago: ['', Validators.required],
      nombre: ['', Validators.required],  // ➜ Agregado
      email: ['', [Validators.required, Validators.email]], // ➜ Agregado con validación de email
      telefono: ['']  // ➜ Agregado (opcional)
    });
    
  }

  ngOnInit(): void {
    // Aquí puedes inicializar el total con un valor desde el backend o servicio
    this.pagoForm.patchValue({ total: 0 });
    this.route.queryParams.subscribe(params => {
      this.idOrden = params['idOrden'];
      console.log("ID de la orden recibida:", this.idOrden); // ✅ Verificar que el ID llega bien
    });
    this.cargarDatos();
  }

  cargarDatos() : void {
    this.authService.obtenerOrden(this.idOrden).subscribe({
      next: (data) => {
          console.log(data.respuesta); // Verificar el contenido de los datos
          this.orden = data.respuesta;
      },
      error: (error) => {
          console.log(error.mensaje);
      },
    });
  }

  realizarPago(): void {
    if (this.pagoForm.valid) {
      console.log('Datos del pago:', this.pagoForm.value);
      alert('Pago realizado con éxito');
      // Aquí iría la lógica para enviar el pago al backend
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
}
