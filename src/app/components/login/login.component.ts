import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  db: string = 'grupo'; // Valor por defecto, puede ser 'grupo' o 'central'

  // Mapeo de usuarios con sus nombres
  userMap: { [key: string]: string } = {
    'A2177': 'ROSA OLIVIA',
    'A2171': 'VIRGINIA',
    'A2166': 'VERONICA',
    'A2161': 'LUZ DEL CARMEN',
    'A2164': 'MARIA DEL PILAR',
    'M0982': 'PEDRO LEONEL',
    'M0121': 'JOSE MANUEL',
    'A1706': 'RUIZ WVILLALDO',
    'A0789': 'JOSEFINA LORENA',
    'A1919': 'PABLO RIVERA ENRIQUE',
    'M0845': 'GERARDO EZPINOSA',
    'M0533': 'JOSE DANIEL',
    'E0507': 'NIETO HERNANDEZ FRANCISCO',
    'M0970': 'MIRANDA ORTIZ GRACIANO'
  };

  constructor(private apiService: ApiService, private router: Router) {}

  // Método para validar si el usuario está en la base de datos correcta
  isValidUserForDatabase(username: string, db: string): boolean {
    const grupoUsers = ['A2177', 'A2171', 'A2166', 'A2161', 'A2164', 'M0982'];
    const centralUsers = [
      'M0121',
      'A1706',
      'A0789',
      'A1140',
      'A1919',
      'M0845',
      'G0230',
      'M0533',
      'M0970',
      'E0507'
    ];

    // Validar si el usuario pertenece a la base de datos seleccionada
    if (db === 'central') {
      return centralUsers.includes(username.toUpperCase());
    } else if (db === 'grupo') {
      return grupoUsers.includes(username.toUpperCase());
    }

    return false; // Por defecto, si no está en ninguna lista
  }
 
  // Método para obtener el nombre del usuario mapeado
  getUserName(username: string): string {
    return this.userMap[username.toUpperCase()] || username; // Si no encuentra, regresa la clave
  }

  onSubmit() {
    // Validar si los campos están vacíos
    if (!this.username || !this.password) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu usuario y contraseña.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return; // Detener la ejecución del método
    }

    // Validación extra en el frontend para verificar que el usuario pertenece a la base de datos seleccionada
    if (!this.isValidUserForDatabase(this.username, this.db)) {
      const errorMessage =
        this.db === 'central'
          ? 'No estás autorizado para acceder al reloj de la central.'
          : 'No estás autorizado para acceder al reloj del grupo.';
      Swal.fire({
        title: 'Acceso no permitido',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return; // Detener la ejecución del método
    }
    
    // Llamar al servicio de login y pasar el parámetro 'db'
    this.apiService.login(this.username, this.password, this.db).subscribe(
      (response) => {
        const userName = this.getUserName(this.username); // Obtener el nombre del usuario mapeado

        // Guardar los datos necesarios en localStorage
        localStorage.setItem('authToken', JSON.stringify(response));
        localStorage.setItem('nickname', response.claveUsuario.toString());
        localStorage.setItem('db', this.db);
        localStorage.setItem('username', userName); // Guardar el nombre en lugar de la clave

        // Mostrar alerta de bienvenida con el nombre mapeado
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola, ${userName}. ¡Nos alegra verte!`,
          icon: 'success',
          confirmButtonText: 'Continuar',
          timer: 2000, // Opcional: cerrar automáticamente después de 3 segundos
        });

        this.router.navigate(['/dashboard/checadas']);
      },
      (error) => {
        // Mostrar alerta de error
        Swal.fire({
          title: 'Error',
          text: 'Usuario o contraseña incorrectos',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });

        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
