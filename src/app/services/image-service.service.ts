import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para manejar la carga de imágenes.
 * Permite subir imágenes a un servidor y obtener el estado de la carga.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'https://shop-system-frontend-822c9.web.app/api/auth/images/subir-imagen'; // URL del endpoint para subir imágenes
  private uploadStatusSubject = new BehaviorSubject<boolean>(false); // Estado de la carga, inicialmente false

  /**
   * Constructor que inyecta el HttpClient para hacer peticiones HTTP.
   * @param http - El cliente HTTP para realizar las peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Subir una imagen al servidor.
   * Este método envía un archivo como parte de un formulario.
   * @param file - El archivo de imagen a subir.
   * @returns Un observable que emite la respuesta del servidor (generalmente un URL o mensaje de éxito).
   */
  public uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file); // Se agrega el archivo al formulario.

    // Se devuelve un observable que maneja el proceso de carga
    return new Observable<string>((observer) => {
      this.http.post<string>(this.apiUrl, formData, { responseType: 'text' as 'json' }).subscribe(
        (response) => {
          this.uploadStatusSubject.next(true); // Marca la carga como exitosa
          observer.next(response); // Envía la respuesta al observador
          observer.complete(); // Completa el observable
        },
        (error) => {
          this.uploadStatusSubject.next(false); // Marca la carga como fallida
          observer.error(error); // Envía el error al observador
        }
      );
    });
  }

  /**
   * Obtiene el estado actual de la carga.
   * @returns Un observable que emite el estado de la carga (true si la carga fue exitosa, false en caso contrario).
   */
  public getUploadStatus(): Observable<boolean> {
    return this.uploadStatusSubject.asObservable(); // Devuelve el estado de la carga como un observable
  }
}
