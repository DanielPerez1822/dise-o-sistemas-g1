import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Estudiante } from './estudiante';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseDto } from '../dto/ApiResponseDto';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  private urlEndpoint='http://localhost:9000/api/estudiantes'

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http:HttpClient) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<ApiResponseDto<Estudiante[]>>(this.urlEndpoint).pipe(
      map((response) => response.data) // Extraer los datos del ApiResponseDto
    );
  }

  getEstudiantesActivos(options = {}): Observable<Estudiante[]> {
    return this.http.get<ApiResponseDto<Estudiante[]>>(`${this.urlEndpoint}/status/true`, { ...options, withCredentials: true }).pipe(
      map((response) => response.data) // Extraer los datos del ApiResponseDto
  );
}

  create(estudiante:Estudiante):Observable<Estudiante>{
    return this.http.post<ApiResponseDto<Estudiante>>(this.urlEndpoint, estudiante, {headers: this.httpHeaders, withCredentials: true}).pipe(
      map((response) => response.data)
    );
  }

  //Método de editar tarea    
  getEstudiante(id: any):Observable<Estudiante>{
    return this.http.get<ApiResponseDto<Estudiante>>(`${this.urlEndpoint}/${id}`, { withCredentials: true }).pipe(
      map((response) => response.data)
    );
  }
  
  update(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<ApiResponseDto<Estudiante>>(`${this.urlEndpoint}/${estudiante.id}`, estudiante, { headers: this.httpHeaders, withCredentials: true }).pipe(
      map((response) => response.data)
    );  
  }  

  //Eliminar
  delete(id: number): Observable<Estudiante> {
    return this.http.delete<ApiResponseDto<Estudiante>>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders, withCredentials: true }).pipe(
      map((response)  => response.data)
    );
  }

}
