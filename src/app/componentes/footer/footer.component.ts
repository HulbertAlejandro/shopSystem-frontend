import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',                // Selector para utilizar este componente en las plantillas
  templateUrl: './footer.component.html',  // Ubicación del archivo de plantilla (HTML)
  styleUrls: ['./footer.component.css']    // Ubicación de los archivos de estilo (CSS)
})
export class FooterComponent {
  footer: string = 'Universidad del Quindio - 2025-1'; // Texto predeterminado del pie de página
}
