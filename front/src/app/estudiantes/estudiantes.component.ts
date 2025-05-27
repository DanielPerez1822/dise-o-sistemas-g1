import { Component, OnInit } from '@angular/core';
import { Estudiante } from './estudiante';
import { EstudiantesService } from './estudiantes.service';
import { ProgramasService } from '../programas/programas.service';
import { Programa } from '../programas/programa';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Agrega esta línea

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <-- Agrega FormsModule aquí
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  programas: Programa[] = [];  // Lista de programas disponibles
  error: string | null = null;
  searchText: string = ''; // Barra de búsqueda

  constructor(
    private estudiantesService: EstudiantesService,
    private programasService: ProgramasService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '/auth/login';
      return;
    }
    this.cargarEstudiantesActivos(); // Cargar estudiantes activos
    this.cargarProgramas();
  }

  cargarEstudiantes(): void {
    this.estudiantesService.getEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes; // Asignar los datos obtenidos
      },
      error: (err) => {
        console.error('Error al cargar los estudiantes:', err);
      }
    });
  }

  getEstadoNombre(status: string): string {
    switch (status) {
      case 'A': return 'Activo';
      case 'I': return 'Inactivo';
      case 'E': return 'Egresado';
      default: return status;
    }
  }

  cargarEstudiantesActivos(): void {
    this.estudiantesService.getEstudiantesActivos({ withCredentials: true }).subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes; // Cargar solo los programas activos
      },
      error: (err) => {
        if (err.status === 200 && typeof err.error === 'string' && err.error.startsWith('<!DOCTYPE')) {
          this.error = 'No autenticado. Por favor inicia sesión.';
          // Opcional: redirige al login
          // this.router.navigate(['/login']);
        } else {
          this.error = 'Error al cargar los estudiantes activos: ' + (err.message || err.error);
        }
      }
    });
  }

  cargarProgramas(): void {
    this.programasService.getProgramas().subscribe(programas => (this.programas = programas));
  }

  get estudiantesFiltrados(): Estudiante[] {
    if (!this.searchText) return this.estudiantes;
    const texto = this.searchText.toLowerCase();
    return this.estudiantes.filter(e =>
      e.nombreEstudiante && e.nombreEstudiante.toLowerCase().includes(texto)
    );
  }

  delete(estudiante: Estudiante): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al estudiante ${estudiante.nombreEstudiante}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.estudiantesService.delete(estudiante.id).subscribe(
          response =>{
            this.estudiantes = this.estudiantes.filter(e => e !== estudiante);
            Swal.fire({
              title: "Borrada!",
              text: `Tu Programa ha sido eliminado: ${estudiante.nombreEstudiante}`,
              icon: "success"
            });
          }
        )
      }
    });
  }
}
