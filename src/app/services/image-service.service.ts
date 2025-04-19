import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'https://shopsystem.onrender.com/api/auth/images/subir-imagen';
  private uploadStatusSubject = new BehaviorSubject<boolean>(false); // Estado de carga

  constructor(private http: HttpClient) {}

  public uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Observable<string>((observer) => {
      this.http.post<string>(this.apiUrl, formData, { responseType: 'text' as 'json' }).subscribe(
        (response) => {
          this.uploadStatusSubject.next(true); // Marcar como subida exitosa
          observer.next(response);
          observer.complete();
        },
        (error) => {
          this.uploadStatusSubject.next(false); // Marcar como fallo
          observer.error(error);
        }
      );
    });
  }

  public getUploadStatus(): Observable<boolean> {
    return this.uploadStatusSubject.asObservable();
  }
}
