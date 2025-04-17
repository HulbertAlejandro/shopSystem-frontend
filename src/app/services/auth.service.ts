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
import { ActualizarItemCarritoDTO } from '../dto/carrito/actualizar-item-carrito-dto';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';
import { AplicarCuponDTO } from '../dto/cupon/aplicar-cupon-dto';
import { CrearOrdenDTO } from '../dto/orden/crear-orden-dto';
import { IdOrdenDTO } from '../dto/orden/id-orden-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { EditarProductoDTO } from '../dto/producto/editar-producto-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) { }

  /***
  * METODOS PUBLICOS 
  */
      /**
      * PRODUCTOS
      */
          public listarProductos(): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/listar-productos`);
          }

          public obtenerProductoCarrito(id: string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/producto/informacion/${id}`);
          }
        
          public obtenerOrden(idOrden: string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/orden/obtener/${idOrden}`);
          }
                
          public obtenerOrdenesUsuario(id: string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/orden/usuario/${id}`);
          }  

      /**
      * CUENTA 
      */

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

      /**
      * CARRITO
      */

          public obtenerItems(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
            return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
          }
            
          public obtenerCarritoCliente(id: string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/carrito/cliente/${id}`);
          }
      
          public obtenerInformacionCarrito(idCarrito : string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/carrito/obtener-informacion/${idCarrito}`);
          }
      
          actualizarCantidadCarrito(actualizarItemCarritoDTO : ActualizarItemCarritoDTO) {
            return this.http.put(`${this.authURL}/carrito/actualizar-item`,actualizarItemCarritoDTO);
          }

          public eliminarItem(idProducto: string, idCliente: string): Observable<MensajeDTO> {
            return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-producto?idProducto=${idProducto}&idCliente=${idCliente}`);
          }
      /**
      * CUPON
      */
          public aplicarCupon(codigoCupon: string): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/cupon/aplicar/${codigoCupon}`);
          }
      
  /***
  * METODOS ADMINISTRADOR
  */ 
      /**
      * ORDEN
      */
          public crearOrden(crearOrden: CrearOrdenDTO): Observable<MensajeDTO> {
            return this.http.post<MensajeDTO>(`${this.authURL}/orden/crear`, crearOrden);
          } 
      /**
      * CUPON
      */
          public crearCupon(cuponDTO: CrearCuponDTO): Observable<MensajeDTO> {
            return this.http.post<MensajeDTO>(`${this.authURL}/cupon/crear`, cuponDTO);
          }

          public editarCupon(cuponDTO: EditarCuponDTO): Observable<MensajeDTO> {
            return this.http.put<MensajeDTO>(`${this.authURL}/editar-cupon`, cuponDTO);
          } 

          public eliminarCupon(id: string): Observable<MensajeDTO> {
            return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cupon/${id}`);
          }

          public obtenerCupones(): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/listar-cupones`);
          }
      /**
      * CLIENTES
      */
          public listarClientes(): Observable<MensajeDTO> {
            return this.http.get<MensajeDTO>(`${this.authURL}/listar-clientes`);
          }
  
          public eliminarCuentaCliente(id: string): Observable<MensajeDTO> {
            return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cliente/${id}`);
          }
      
      /**
      * PRODUCTO
      */
        public crearProducto(crearProducto: CrearProductoDTO): Observable<MensajeDTO> {
          return this.http.post<MensajeDTO>(`${this.authURL}/crear-producto`, crearProducto);
        }

        public eliminarProducto(id: string): Observable<MensajeDTO> {
          return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-producto/${id}`);
        }

        public editarProducto(productoDTO: EditarProductoDTO): Observable<MensajeDTO> {
          return this.http.put<MensajeDTO>(`${this.authURL}/editar-producto`, productoDTO);
        } 

        public obtenerProducto(id:string): Observable<MensajeDTO>{
          return this.http.get<MensajeDTO>(`${this.authURL}/producto/obtener/${id}`);
        }

  /***
  * METODOS CLIENTES
  */
      
      /**
      * CUENTA
      */
            public editarCuenta(cuentaDTO: EditarCuentaDTO): Observable<MensajeDTO> {
              return this.http.put<MensajeDTO>(`${this.authURL}/editar-perfil`, cuentaDTO);
            } 
          
            public eliminarCuenta(id: string): Observable<MensajeDTO> {
              return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar/${id}`);
            }

      /**
      * CARRITO
      */
            public agregarItem(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
              return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
            }

      /**
      * PAGO
      */
                      
            public realizarPago(idOrden: IdOrdenDTO): Observable<MensajeDTO> {
              return this.http.post<MensajeDTO>(`${this.authURL}/orden/realizar-pago`, idOrden);
            }
        
      /**
      * CUPON
      */
}