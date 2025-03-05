import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';
import { Observable } from 'rxjs';
import { VerificacionDTO } from '../dto/verificacion-dto';


@Injectable({
 providedIn: 'root'
})
export class AuthService {


 private authURL = "http://localhost:8080/api/auth";
 
 public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
 }
 
 public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
 }

 public verificarSesion(verificacionDTO: VerificacionDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/verificar-sesion`, verificacionDTO);
   }

 constructor(private http: HttpClient) { 
  
 }

 
}
