import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  private apiUrl = 'https://0f46-187-148-190-178.ngrok-free.app/api'; // URL de la API

  constructor(private http: HttpClient) { }
  // Método de login
  login(nickname: string, device_password: string, db: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nickname, device_password, db });
  }

  // Método para obtener todas las checadas
  getChecadas(db: string): Observable<Checada[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Checada[]>(`${this.apiUrl}/checadas/${db}`, { headers });
  }
  //Metodo para pintar las checadas por departamento
  getChecadasPorDepartamento(nickname: string, db: string): Observable<Checada[]> {
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('ngrok-skip-browser-warning', 'true'); // Encabezado para omitir la advertencia

    return this.http.get(`${this.apiUrl}/checadas/departamento/${nickname}/${db}`, {
      headers,
      responseType: 'text', // Recibir la respuesta como texto
    }).pipe(
      map((response: string) => JSON.parse(response)), // Convertir manualmente a JSON
      catchError((error) => {
        console.error('Error al obtener las checadas:', error);
        throw error;
      })
    );
  }

}
