import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/cuenta/login-dto';
import { Observable } from 'rxjs';
import { CrearCuentaDTO } from '../dto/cuenta/crear-cuenta-dto';
import { VerificacionDTO } from '../dto/cuenta/verificacion-dto';
import { ValidarCuentaDTO } from '../dto/cuenta/validar-cuenta-dto';
import { EditarCuentaDTO } from '../dto/cuenta/editar-cuenta-dto';
import { CrearProductoDTO } from '../dto/producto/crear-producto-dto';
import { ProductoCarritoDTO } from '../dto/producto/producto-carrito-dto';

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

  public listarClientes(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/listar-clientes`);
  }

  public editarCuenta(cuentaDTO: EditarCuentaDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/editar-perfil`, cuentaDTO);
  } 

  public eliminarCuenta(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar/${id}`);
  }

  public eliminarCuentaCliente(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cliente/${id}`);
  }

  public crearProducto(crearProducto: CrearProductoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-producto`, crearProducto);
  }

  public listarProductos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/listar-productos`);
  }

  public agregarItem(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
  }

  public obtenerItems(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
  }

  public obtenerProductoCarrito(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/producto/informacion/${id}`);
  }

  public obtenerCarritoCliente(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/carrito/cliente/${id}`);
  }

  public obtenerInformacionCarrito(idCarrito : string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/carrito/obtener-informacion/${idCarrito}`);
  }
}
