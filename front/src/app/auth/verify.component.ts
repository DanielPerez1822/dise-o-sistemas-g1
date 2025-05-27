import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  email = '';
  verificationCode = '';
  error = '';
  success = '';
  loading = false;

  // Cambia aquí la URL base según tu entorno
  private apiBase = 'http://localhost:9000';
  // Si usas DevTunnels, descomenta la siguiente línea y comenta la anterior:
  // private apiBase = 'https://<tu-tunnel>.devtunnels.ms';

  constructor(private http: HttpClient, private route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  verify() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.http.post<any>('http://localhost:9000/auth/verify', {
      email: this.email,
      verificationCode: this.verificationCode
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.error = ''; // Limpia cualquier error previo
        this.success = res?.text || 'Cuenta verificada correctamente. Ahora puedes iniciar sesión.';
        // Redirige inmediatamente al login tras verificación exitosa
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.success = ''; // Limpia cualquier éxito previo
        if (err.error && typeof err.error === 'object') {
          this.error = err.error.message || err.error.text || JSON.stringify(err.error);
        } else {
          this.error = err.error || 'Error al verificar la cuenta';
        }
      }
    });
  }

  resend() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.http.post<any>(`${this.apiBase}/auth/resend?email=` + encodeURIComponent(this.email), {})
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Código reenviado. Revisa tu correo.';
        },
        error: err => {
          this.loading = false;
          this.error = err.error || 'No se pudo reenviar el código';
        }
      });
  }
}
