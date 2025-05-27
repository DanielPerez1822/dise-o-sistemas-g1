import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = ''; // Cambia 'email' por 'username'
  password = '';
  error = '';
  success = '';

  // Cambia aquí la URL base según tu entorno
  private apiBase = 'http://localhost:9000';
  // Si usas DevTunnels, descomenta la siguiente línea y comenta la anterior:
  // private apiBase = 'https://<tu-tunnel>.devtunnels.ms';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.success = '';
    // Usa /auth/login y envía username (el backend lo acepta como email o username)
    this.http.post<any>(`${this.apiBase}/auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.success = 'Inicio de sesión exitoso';
        // Guarda el estado de login (puede ser token, usuario, etc.)
        localStorage.setItem('isLoggedIn', 'true');
        // Si el backend devuelve un token, guárdalo también:
        // localStorage.setItem('token', res.token);
        setTimeout(() => this.router.navigate(['/estudiantes']), 1000);
      },
      error: err => {
        // Manejo de error mejorado
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.error && err.error.message) {
          this.error = err.error.message;
        } else if (err.message) {
          this.error = err.message;
        } else {
          this.error = 'Credenciales incorrectas o usuario no verificado';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
