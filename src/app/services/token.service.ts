import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

const TOKEN_KEY = "AuthToken";
const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000; // 5 minutos antes de expirar

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  private isVerifiedSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimer: any;

  constructor(private router: Router) {
    this.startTokenExpirationCheck();
    this.setupStorageListener();
  }

  // ==================== MÉTODOS PÚBLICOS PRINCIPALES ====================
  public setToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.updateAuthState(true);
    this.scheduleTokenExpirationCheck();
  }

  public login(token: string, redirectTo?: string): void {
    this.setToken(token);
    const targetRoute = redirectTo || this.getDefaultRoute();
    this.router.navigate([targetRoute]);
  }

  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  // ==================== MÉTODOS DE VERIFICACIÓN ====================
  public isLogged(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  public getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  // ==================== MÉTODOS DE INFORMACIÓN DEL TOKEN ====================
  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getTokenPayload(): any {
    const token = this.getToken();
    return token ? this.decodePayload(token) : null;
  }

  // ==================== MÉTODOS DE USUARIO ====================
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

  public getUsuarioInfo$(): Observable<ReturnType<typeof this.getUsuarioInfo>> {
    return this.isLoggedInSubject.pipe(
      map(() => this.getUsuarioInfo())
    );
  }

  // ==================== MÉTODOS DE VERIFICACIÓN 2FA ====================
  public setIsVerified(value: boolean): void {
    this.isVerifiedSubject.next(value);
  }

  public getIsVerified(): Observable<boolean> {
    return this.isVerifiedSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  public getIsVerifiedSync(): boolean {
    return this.isVerifiedSubject.value;
  }

  // ==================== MÉTODOS DE ACCESO RÁPIDO ====================
  public getIDCuenta(): string { return this.getUsuarioInfo().id; }
  public getRol(): string { return this.getUsuarioInfo().rol; }
  public getCedula(): string { return this.getUsuarioInfo().cedula; }
  public getCorreo(): string { return this.getUsuarioInfo().correo; }
  public getNombre(): string { return this.getUsuarioInfo().nombre; }
  public getTelefono(): string { return this.getUsuarioInfo().telefono; }
  public getDireccion(): string { return this.getUsuarioInfo().direccion; }

  // ==================== MÉTODOS PRIVADOS ====================
  private checkInitialAuthState(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private updateAuthState(isLogged: boolean): void {
    this.isLoggedInSubject.next(isLogged);
    if (!isLogged) {
      this.isVerifiedSubject.next(false);
    }
  }

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

  private isTokenExpired(token?: string | null): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;
    
    const payload = this.decodePayload(tokenToCheck);
    if (!payload || !payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  }

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

  private startTokenExpirationCheck(): void {
    if (this.isLogged()) {
      this.scheduleTokenExpirationCheck();
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === TOKEN_KEY) {
        const isLogged = this.checkInitialAuthState();
        this.updateAuthState(isLogged);
      }
    });
  }

  private clearSession(): void {
    window.sessionStorage.clear();
    clearTimeout(this.tokenExpirationTimer);
    this.updateAuthState(false);
  }

  private getDefaultRoute(): string {
    const rol = this.getTokenPayload()?.rol;
    return rol === 'ADMINISTRADOR' ? '/panel-admin' : '/home';
  }

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