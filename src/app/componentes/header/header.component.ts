import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',                  // Selector para utilizar este componente en las plantillas
  templateUrl: './header.component.html',   // Ubicación del archivo de plantilla (HTML)
  styleUrls: ['./header.component.css']     // Ubicación de los archivos de estilo (CSS)
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged = false;                        // Estado de autenticación
  isVerified = false;                      // Estado de verificación
  rol = '';                                // Rol del usuario
  nombre = '';                             // Nombre del usuario
  private subs = new Subscription();       // Suscripción a los eventos de autenticación y navegación

  constructor(
    public tokenService: TokenService,      // Servicio para manejar el token
    private router: Router                  // Servicio de enrutamiento
  ) {}

  ngOnInit(): void {
    this.updateAuthState();                // Actualiza el estado de autenticación

    // Escucha cambios de ruta
    this.subs.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)  // Filtra eventos de cambio de ruta
      ).subscribe(() => {
        this.updateAuthState();            // Actualiza el estado de autenticación
      })
    );

    // Escucha cambios de autenticación
    this.subs.add(
      this.tokenService.getIsLoggedIn().subscribe((loggedIn) => {
        this.isLogged = loggedIn;
        this.updateUserData();
      })
    );

    // Escucha cambios de verificación
    this.subs.add(
      this.tokenService.getIsVerified().subscribe((verified) => {
        this.isVerified = verified;
      })
    );
  }

  private updateAuthState(): void {
    this.isLogged = this.tokenService.isLogged();  // Verifica si el usuario está logueado
    this.updateUserData();                        // Actualiza los datos del usuario
  }

  private updateUserData(): void {
    if (this.isLogged) {
      const userInfo = this.tokenService.getUsuarioInfo();  // Obtiene los datos del usuario
      this.rol = userInfo.rol;                             // Asigna el rol
      this.nombre = userInfo.nombre;                         // Asigna el nombre
      this.isVerified = userInfo.isVerified;                 // Asigna el estado de verificación
    } else {
      this.clearUserData();  // Limpia los datos si no está logueado
    }
  }

  private clearUserData(): void {
    this.rol = '';           // Limpia el rol
    this.nombre = '';        // Limpia el nombre
    this.isVerified = false; // Limpia el estado de verificación
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).catch(err => {
      console.error('Error de navegación:', err);  // Manejo de errores de navegación
      this.router.navigate(['/']);                 // Navega a la ruta raíz en caso de error
    });
  }

  logout(): void {
    this.tokenService.logout();  // Cierra la sesión
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();  // Cancela las suscripciones cuando el componente se destruye
  }

  // Métodos auxiliares para el template
  shouldShowUserOptions(): boolean {
    return this.isLogged && this.isVerified;  // Solo muestra opciones si está verificado
  }

  isAdmin(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'ADMINISTRADOR';  // Verifica si es Administrador
  }

  isClient(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'CLIENTE';  // Verifica si es Cliente
  }

  isAuxiliarBodega(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'AUXILIAR_BODEGA';  // Verifica si es Auxiliar de Bodega
  }

  isProveedor(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'PROVEEDOR';  // Verifica si es Proveedor
  }
}