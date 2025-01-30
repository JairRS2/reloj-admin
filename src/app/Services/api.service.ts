import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Checada {
  idChecada: number;
  ClaveEmpleado: string;
  Nombre: string;
  Departamento: string;
  Zona: string;
  FechaChecada: Date;
  Puesto: string;
  ClavePuesto: string;
  Activos: number;
  Checados: number;
  HoraEntrada: string;
  HoraSalida: string;
  HorasLaboradas?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // URL de la API

  constructor(private http: HttpClient) {}

  // Método de login
  login(nickname: string, device_password: string, db: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nickname,device_password, db });
  }

  // Método para obtener todas las checadas
  getChecadas(db: string): Observable<Checada[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Checada[]>(`${this.apiUrl}/checadas/${db}`, { headers });
  }

  getChecadasPorDepartamento(departamentoId: string, db: string): Observable<Checada[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Ajusta la URL para pasar db correctamente como parámetro
    return this.http.get<Checada[]>(`${this.apiUrl}/checadas/departamento/${departamentoId}/${db}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener las checadas:', error);
        throw error;
      })
    );
  }
  
}
