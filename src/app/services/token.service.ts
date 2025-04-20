import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

const TOKEN_KEY = "AuthToken"; // Clave de almacenamiento para el token
const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000; // 5 minutos antes de expirar

/**
 * Servicio encargado de manejar la autenticación basada en token.
 * Gestiona el almacenamiento, verificación y caducidad del token, así como la información de usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  private isVerifiedSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimer: any;

  /**
   * Constructor que inicializa el servicio de autenticación, comprobando el estado inicial de la sesión
   * y configurando un listener para detectar cambios en el almacenamiento.
   * @param router - El servicio de navegación para redirigir a las rutas necesarias.
   */
  constructor(private router: Router) {
    this.startTokenExpirationCheck();
    this.setupStorageListener();
  }

  // ==================== MÉTODOS PÚBLICOS PRINCIPALES ====================

  /**
   * Establece el token de autenticación en el almacenamiento de sesión.
   * @param token - El token de autenticación a almacenar.
   */
  public setToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.updateAuthState(true);
    this.scheduleTokenExpirationCheck();
  }

  /**
   * Inicia sesión almacenando el token y redirige a la ruta de destino.
   * @param token - El token de autenticación.
   * @param redirectTo - Ruta a la que redirigir después del login (opcional).
   */
  public login(token: string, redirectTo?: string): void {
    this.setToken(token);
    const targetRoute = redirectTo || this.getDefaultRoute();
    this.router.navigate([targetRoute]);
  }

  /**
   * Cierra la sesión eliminando el token y redirigiendo al login.
   */
  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  // ==================== MÉTODOS DE VERIFICACIÓN ====================

  /**
   * Verifica si el usuario está autenticado.
   * @returns `true` si el usuario está autenticado, `false` si no lo está.
   */
  public isLogged(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  /**
   * Obtiene un observable que emite el estado de autenticación del usuario.
   * @returns Un observable que emite `true` si el usuario está autenticado, `false` si no lo está.
   */
  public getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  // ==================== MÉTODOS DE INFORMACIÓN DEL TOKEN ====================

  /**
   * Obtiene el token de autenticación almacenado en la sesión.
   * @returns El token de autenticación si existe, `null` si no existe.
   */
  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Obtiene la carga útil (payload) decodificada del token de autenticación.
   * @returns La carga útil del token decodificada, o `null` si el token no es válido.
   */
  public getTokenPayload(): any {
    const token = this.getToken();
    return token ? this.decodePayload(token) : null;
  }

  // ==================== MÉTODOS DE USUARIO ====================

  /**
   * Obtiene la información del usuario contenida en el token.
   * @returns Un objeto con la información del usuario (id, rol, nombre, correo, etc.).
   */
  public getUsuarioInfo(): {
    id: string,
    rol: string,
    nombre: string,
    correo: string,
    cedula: string,
    telefono: string,
    direccion: string,
    isVerified: boolean
  } {
    const payload = this.getTokenPayload();
    return payload ? {
      id: payload.id || '',
      rol: payload.rol || '',
      nombre: payload.nombre || '',
      correo: payload.sub || '',
      cedula: payload.cedula || '',
      telefono: payload.telefono || '',
      direccion: payload.direccion || '',
      isVerified: this.isVerifiedSubject.value
    } : this.getEmptyUserInfo();
  }

  /**
   * Obtiene la información del usuario como un observable que emite los datos del usuario.
   * @returns Un observable con la información del usuario.
   */
  public getUsuarioInfo$(): Observable<ReturnType<typeof this.getUsuarioInfo>> {
    return this.isLoggedInSubject.pipe(
      map(() => this.getUsuarioInfo())
    );
  }

  // ==================== MÉTODOS DE VERIFICACIÓN 2FA ====================

  /**
   * Establece el estado de verificación 2FA del usuario.
   * @param value - Estado de verificación (`true` si verificado, `false` si no).
   */
  public setIsVerified(value: boolean): void {
    this.isVerifiedSubject.next(value);
  }

  /**
   * Obtiene un observable que emite el estado de verificación 2FA del usuario.
   * @returns Un observable con el estado de verificación.
   */
  public getIsVerified(): Observable<boolean> {
    return this.isVerifiedSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene el estado de verificación 2FA del usuario de forma sincrónica.
   * @returns El estado de verificación 2FA.
   */
  public getIsVerifiedSync(): boolean {
    return this.isVerifiedSubject.value;
  }

  // ==================== MÉTODOS DE ACCESO RÁPIDO ====================

  /**
   * Obtiene el ID de la cuenta del usuario.
   * @returns El ID de la cuenta.
   */
  public getIDCuenta(): string { return this.getUsuarioInfo().id; }

  /**
   * Obtiene el rol del usuario.
   * @returns El rol del usuario.
   */
  public getRol(): string { return this.getUsuarioInfo().rol; }

  /**
   * Obtiene la cédula del usuario.
   * @returns La cédula del usuario.
   */
  public getCedula(): string { return this.getUsuarioInfo().cedula; }

  /**
   * Obtiene el correo electrónico del usuario.
   * @returns El correo electrónico del usuario.
   */
  public getCorreo(): string { return this.getUsuarioInfo().correo; }

  /**
   * Obtiene el nombre del usuario.
   * @returns El nombre del usuario.
   */
  public getNombre(): string { return this.getUsuarioInfo().nombre; }

  /**
   * Obtiene el teléfono del usuario.
   * @returns El teléfono del usuario.
   */
  public getTelefono(): string { return this.getUsuarioInfo().telefono; }

  /**
   * Obtiene la dirección del usuario.
   * @returns La dirección del usuario.
   */
  public getDireccion(): string { return this.getUsuarioInfo().direccion; }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Verifica el estado inicial de autenticación basado en el token almacenado.
   * @returns `true` si el token es válido y no ha expirado, `false` si no lo está.
   */
  private checkInitialAuthState(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Actualiza el estado de autenticación y verificación del usuario.
   * @param isLogged - El estado de autenticación (true si está autenticado, false si no lo está).
   */
  private updateAuthState(isLogged: boolean): void {
    this.isLoggedInSubject.next(isLogged);
    if (!isLogged) {
      this.isVerifiedSubject.next(false);
    }
  }

  /**
   * Decodifica la carga útil del token JWT.
   * @param token - El token JWT a decodificar.
   * @returns La carga útil del token decodificada.
   */
  private decodePayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
      return JSON.parse(payloadDecoded);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  /**
   * Verifica si el token ha expirado.
   * @param token - El token a verificar (opcional).
   * @returns `true` si el token ha expirado, `false` si no lo ha hecho.
   */
  private isTokenExpired(token?: string | null): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;
    
    const payload = this.decodePayload(tokenToCheck);
    if (!payload || !payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  }

  /**
   * Programa la verificación de expiración del token.
   * Si el token está por expirar, se configura una alarma para borrar la sesión.
   */
  private scheduleTokenExpirationCheck(): void {
    const payload = this.getTokenPayload();
    if (!payload || !payload.exp) return;

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime - TOKEN_EXPIRATION_BUFFER;

    if (timeUntilExpiration > 0) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = setTimeout(() => {
        this.clearSession();
      }, timeUntilExpiration);
    } else {
      this.clearSession();
    }
  }

  /**
   * Inicia el chequeo de expiración del token cuando el servicio es instanciado.
   */
  private startTokenExpirationCheck(): void {
    if (this.isLogged()) {
      this.scheduleTokenExpirationCheck();
    }
  }

  /**
   * Configura un listener para detectar cambios en el almacenamiento y actualizar el estado de autenticación.
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === TOKEN_KEY) {
        const isLogged = this.checkInitialAuthState();
        this.updateAuthState(isLogged);
      }
    });
  }

  /**
   * Limpia la sesión y elimina el token del almacenamiento.
   */
  private clearSession(): void {
    window.sessionStorage.clear();
    clearTimeout(this.tokenExpirationTimer);
    this.updateAuthState(false);
  }

  /**
   * Obtiene la ruta predeterminada según el rol del usuario.
   * @returns La ruta predeterminada para el rol del usuario.
   */
  private getDefaultRoute(): string {
    const rol = this.getTokenPayload()?.rol;
    return rol === 'ADMINISTRADOR' ? '/panel-admin' : '/home';
  }

  /**
   * Obtiene un objeto vacío de información del usuario.
   * @returns Un objeto con los campos vacíos para un usuario.
   */
  private getEmptyUserInfo() {
    return {
      id: '',
      rol: '',
      nombre: '',
      correo: '',
      cedula: '',
      telefono: '',
      direccion: '',
      isVerified: false
    };
  }
}
