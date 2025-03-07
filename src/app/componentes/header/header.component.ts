import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  isVerified = false; // ✅ Nueva variable para verificar el 2FA
  rol: string = "";
  nombreUsuario: string = ""; // ✅ Nueva variable para mostrar el nombre en el header

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    this.tokenService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
      this.rol = this.tokenService.getRol();
      this.nombreUsuario = this.tokenService.getNombre(); // ✅ Obtener el nombre del usuario
    });

    this.tokenService.getIsVerified().subscribe(isVerified => {
      this.isVerified = isVerified; // ✅ Actualiza cuando el usuario pasa el 2FA
    });
  }

  logout() {
    this.tokenService.logout();
    this.isLogged = false;
    this.isVerified = false; // ✅ Resetear verificación en logout
    this.router.navigate(['/login']);
  }
}
