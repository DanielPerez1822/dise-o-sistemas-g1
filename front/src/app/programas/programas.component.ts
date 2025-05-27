import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Asegúrate de importar FormsModule
import Swal from 'sweetalert2';
import { Programa } from './programa';
import { ProgramasService } from './programas.service';


@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <-- Agrega FormsModule aquí
  templateUrl: './programas.component.html',
  styleUrl: './programas.component.css'
})
export class ProgramasComponent implements OnInit {

  programas: Programa[] = []; // Inicializa el array vacío
  error: string | null = null;
  searchText: string = ''; // Barra de búsqueda

  constructor(private programasService: ProgramasService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.programasService.getActivoProgramas({ withCredentials: true }).subscribe({
      next: (programas) => {
        this.programas = programas;
      },
      error: (err) => {
        // Si la respuesta es HTML, probablemente es una redirección del backend
        if (typeof err.error === 'string' && err.error.startsWith('<!DOCTYPE')) {
          this.error = 'Sesión expirada o no autenticado. Por favor inicia sesión.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. ¿Está el backend levantado?';
        } else {
          this.error = 'Error al cargar los programas activos: ' + (err.message || err.error);
        }
      }
    });
  }
  

  delete(programa:Programa):void{
    Swal.fire({
      title: "Esta segur@?",
      text: `Seguro deseas eliminar la Programa: ${programa.nomPrograma} !`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.programasService.delete(programa.id).subscribe(
          response=>{
            this.programas = this.programas.filter(est=> est !== programa)
            Swal.fire({
              title: "Borrada!",
              text: `Tu Programa ha sido eliminado: ${programa.nomPrograma}`,
              icon: "success"
            });
          }
        )
      }
    });
  }

  get programasFiltrados(): Programa[] {
    if (!this.searchText) return this.programas;
    const texto = this.searchText.toLowerCase();
    return this.programas.filter(p =>
      p.nomPrograma && p.nomPrograma.toLowerCase().includes(texto)
    );
  }

}


