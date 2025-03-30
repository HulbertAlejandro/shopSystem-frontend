import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [ReactiveFormsModule, ReactiveFormsModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup;
  metodosPago: string[] = ['Tarjeta de Crédito', 'Débito', 'PayPal', 'Transferencia Bancaria'];

  constructor(private fb: FormBuilder) {
    this.pagoForm = this.fb.group({
      pedidoId: ['', Validators.required],
      codigoPasarela: ['', Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
      metodoPago: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aquí puedes inicializar el total con un valor desde el backend o servicio
    this.pagoForm.patchValue({ total: 0 });
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
