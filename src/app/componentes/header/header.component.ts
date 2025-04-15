import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged = false;
  isVerified = false; // Mantenemos el estado de verificación
  rol = '';
  nombre = '';
  private subs = new Subscription();

  constructor(
    public tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateAuthState();

    // Escuchar cambios de ruta
    this.subs.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateAuthState();
      })
    );

    // Escuchar cambios de autenticación
    this.subs.add(
      this.tokenService.getIsLoggedIn().subscribe((loggedIn) => {
        this.isLogged = loggedIn;
        this.updateUserData();
      })
    );

    // IMPORTANTE: Mantenemos la suscripción a la verificación
    this.subs.add(
      this.tokenService.getIsVerified().subscribe((verified) => {
        this.isVerified = verified;
      })
    );
  }

  private updateAuthState(): void {
    this.isLogged = this.tokenService.isLogged();
    this.updateUserData();
  }

  private updateUserData(): void {
    if (this.isLogged) {
      const userInfo = this.tokenService.getUsuarioInfo();
      this.rol = userInfo.rol;
      this.nombre = userInfo.nombre;
      this.isVerified = userInfo.isVerified; // Actualizamos estado de verificación
    } else {
      this.clearUserData();
    }
  }

  private clearUserData(): void {
    this.rol = '';
    this.nombre = '';
    this.isVerified = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).catch(err => {
      console.error('Error de navegación:', err);
      this.router.navigate(['/']);
    });
  }

  logout(): void {
    this.tokenService.logout();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Métodos auxiliares para el template
  shouldShowUserOptions(): boolean {
    return this.isLogged && this.isVerified; // Solo muestra opciones si está verificado
  }

  isAdmin(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'ADMINISTRADOR';
  }

  isClient(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'CLIENTE';
  }

  isAuxiliarBodega(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'AUXILIAR_BODEGA';
  }

  isProveedor(): boolean {
    return this.shouldShowUserOptions() && this.rol === 'PROVEEDOR';
  }
}