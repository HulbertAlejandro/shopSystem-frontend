import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Importaciones necesarias para formularios reactivos
import { CommonModule } from '@angular/common'; // Módulo para directivas comunes como *ngIf y *ngFor
import { FormsModule } from '@angular/forms'; // Módulo para usar formularios basados en template
import { MostrarOrdenReabastecimientoDTO } from '../../dto/abastecimiento/mostrar-orden-reabastecimiento-dto';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { IdOrdenReabastecimientoDTO } from '../../dto/abastecimiento/id-orden-reabastecimiento';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-distribuidora', // Selector que identifica este componente en la plantilla HTML
    standalone: true, // Marca el componente como independiente
    imports: [CommonModule, ReactiveFormsModule, FormsModule], // Módulos necesarios para el funcionamiento del componente
    templateUrl: './distribuidora.component.html', // Ruta a la plantilla HTML
    styleUrls: ['./distribuidora.component.css'] // Ruta a los estilos CSS del componente
})

export class DistribuidoraComponent {

    // Inicializa las órdenes de la distribuidora con información ficticia de bodegas y productos
    ordenesBodega: MostrarOrdenReabastecimientoDTO[] = [];
    rolActual: string = '';

    constructor(private authService: AuthService, private tokenService: TokenService, private router : Router) {
        this.rolActual = this.tokenService.getRol();
        this.cargarOrdenesBodega();
    }
    
    cargarOrdenesBodega() {
      this.authService.listarOrdenesBodega().subscribe({
            next: (data) => {
              this.ordenesBodega = data.respuesta;
            },
            error: (error) => {
              console.error('Error al cargar productos:', error); // Mostrar error en caso de fallo
            },
      });
    }

  entregar(idOrden: string) {
    const IdOrdenReabastecimiento: IdOrdenReabastecimientoDTO = {
      idOrdenReabastecimiento: idOrden
    };

    this.authService.entregarOrdenes(IdOrdenReabastecimiento).subscribe({
      next: () => {
            Swal.fire('Éxito', 'Orden enviada correctamente', 'success').then(() => {
                this.router.navigate(['/inicio']);
              });
            },
            error: (error) => {
              let mensaje = 'Ha ocurrido un error al enviar la orden.';
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
