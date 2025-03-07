import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';
import { Observable } from 'rxjs';
import { VerificacionDTO } from '../dto/verificacion-dto';
import { ValidarCuentaDTO } from '../dto/validar-cuenta-dto';
import { EditarCuentaDTO } from '../dto/editar-cuenta-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) { }

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  public verificarSesion(verificacionDTO: VerificacionDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/verificar-sesion`, verificacionDTO);
  }

  public activarCuenta(activarCuentaDTO: ValidarCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/activar-cuenta`, activarCuentaDTO);
  }

  public obtenerCuenta(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener/${id}`);
  }

  public editarCuenta(cuentaDTO: EditarCuentaDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/editar-perfil`, cuentaDTO);
  } 
}
