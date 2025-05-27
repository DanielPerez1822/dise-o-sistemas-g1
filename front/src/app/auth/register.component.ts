import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  // Cambia aquí la URL base según tu entorno
  private apiBase = 'http://localhost:9000';
  // Si usas DevTunnels, descomenta la siguiente línea y comenta la anterior:
  // private apiBase = 'https://<tu-tunnel>.devtunnels.ms';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.http.post<any>(`${this.apiBase}/auth/signup`, {
      email: this.email,
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Revisa tu correo para el código de verificación.';
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/verify'], { queryParams: { email: this.email } });
        }, 1200);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Error en el registro';
      }
    });
  }
}
