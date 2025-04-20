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

  /** PRODUCTOS */

  /** Obtiene todos los productos disponibles */
  public listarProductos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/listar-productos`);
  }

  /** Obtiene la información de un producto específico para el carrito */
  public obtenerProductoCarrito(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/producto/informacion/${id}`);
  }

  /** Obtiene los detalles de una orden */
  public obtenerOrden(idOrden: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/orden/obtener/${idOrden}`);
  }

  /** Obtiene todas las órdenes hechas por un usuario */
  public obtenerOrdenesUsuario(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/orden/usuario/${id}`);
  }

  /** CUENTA */

  /** Crea una nueva cuenta */
  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }

  /** Inicia sesión con usuario y contraseña */
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  /** Verifica el código de inicio de sesión enviado al usuario */
  public verificarSesion(verificacionDTO: VerificacionDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/verificar-sesion`, verificacionDTO);
  }

  /** Activa la cuenta del usuario mediante un código enviado */
  public activarCuenta(activarCuentaDTO: ValidarCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/activar-cuenta`, activarCuentaDTO);
  }

  /** Obtiene la información de una cuenta por su ID */
  public obtenerCuenta(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener/${id}`);
  }

  /** CARRITO */

  /** Agrega un ítem al carrito */
  public obtenerItems(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
  }

  /** Obtiene el carrito de un cliente */
  public obtenerCarritoCliente(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/carrito/cliente/${id}`);
  }

  /** Obtiene la información detallada del carrito */
  public obtenerInformacionCarrito(idCarrito: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/carrito/obtener-informacion/${idCarrito}`);
  }

  /** Actualiza la cantidad de un ítem en el carrito */
  public actualizarCantidadCarrito(actualizarItemCarritoDTO: ActualizarItemCarritoDTO) {
    return this.http.put(`${this.authURL}/carrito/actualizar-item`, actualizarItemCarritoDTO);
  }

  /** Elimina un producto del carrito */
  public eliminarItem(idProducto: string, idCliente: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-producto?idProducto=${idProducto}&idCliente=${idCliente}`);
  }

  /** CUPON */

  /** Aplica un cupón al carrito actual */
  public aplicarCupon(codigoCupon: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/cupon/aplicar/${codigoCupon}`);
  }

  /** ORDEN (ADMINISTRADOR) */

  /** Crea una nueva orden */
  public crearOrden(crearOrden: CrearOrdenDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/orden/crear`, crearOrden);
  }

  /** CUPON (ADMINISTRADOR) */

  /** Crea un nuevo cupón */
  public crearCupon(cuponDTO: CrearCuponDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/cupon/crear`, cuponDTO);
  }

  /** Edita un cupón existente */
  public editarCupon(cuponDTO: EditarCuponDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/editar-cupon`, cuponDTO);
  }

  /** Elimina un cupón por su ID */
  public eliminarCupon(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cupon/${id}`);
  }

  /** Obtiene la lista de todos los cupones */
  public obtenerCupones(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/listar-cupones`);
  }

  /** CLIENTES (ADMINISTRADOR) */

  /** Obtiene la lista de todos los clientes registrados */
  public listarClientes(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/listar-clientes`);
  }

  /** Elimina una cuenta de cliente */
  public eliminarCuentaCliente(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cliente/${id}`);
  }

  /** PRODUCTO (ADMINISTRADOR) */

  /** Crea un nuevo producto */
  public crearProducto(crearProducto: CrearProductoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-producto`, crearProducto);
  }

  /** Elimina un producto por ID */
  public eliminarProducto(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-producto/${id}`);
  }

  /** Edita un producto existente */
  public editarProducto(productoDTO: EditarProductoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/editar-producto`, productoDTO);
  }

  /** Obtiene un producto específico por ID */
  public obtenerProducto(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/producto/obtener/${id}`);
  }

  /** CUENTA (CLIENTE) */

  /** Edita la información de perfil del cliente */
  public editarCuenta(cuentaDTO: EditarCuentaDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/editar-perfil`, cuentaDTO);
  }

  /** Elimina la cuenta de un cliente */
  public eliminarCuenta(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar/${id}`);
  }

  /** CARRITO (CLIENTE) */

  /** Agrega un producto al carrito */
  public agregarItem(producto: ProductoCarritoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/carrito/agregar-item`, producto);
  }

  /** PAGO */

  /** Realiza el pago de una orden */
  public realizarPago(idOrden: IdOrdenDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/orden/realizar-pago`, idOrden);
  }
}
