import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Programa } from './programa';
import { ApiResponseDto } from '../dto/ApiResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {
  private urlEndpoint = 'http://localhost:9000/api/programas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getProgramas(): Observable<Programa[]> {
    return this.http.get<ApiResponseDto<Programa[]>>(this.urlEndpoint, { withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el array de programas del ApiResponseDto
    );  
  }
    
  getActivoProgramas(options = {}): Observable<Programa[]> {
    return this.http.get<ApiResponseDto<Programa[]>>(`${this.urlEndpoint}/status/true`, { ...options, withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el array de programas activos del ApiResponseDto
    );
  }

  create(programa: Programa): Observable<Programa> {
    return this.http.post<ApiResponseDto<Programa>>(this.urlEndpoint, programa, { headers: this.httpHeaders, withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el programa creado del ApiResponseDto
    );
  }

  getPrograma(id: number): Observable<Programa> {
    return this.http.get<ApiResponseDto<Programa>>(`${this.urlEndpoint}/${id}`, { withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el programa del ApiResponseDto
    );
  }

  update(programa: Programa): Observable<Programa> {
    return this.http.put<ApiResponseDto<Programa>>(`${this.urlEndpoint}/${programa.id}`, programa, { headers: this.httpHeaders, withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el programa actualizado del ApiResponseDto
    );
  }

  delete(id: number): Observable<Programa> {
    return this.http.delete<ApiResponseDto<Programa>>(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders, withCredentials: true }).pipe(
      map((response) => response.data) // Extraer el programa eliminado del ApiResponseDto
    );
  }
}