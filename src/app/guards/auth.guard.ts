import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate{
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('authToken');
    const departamentoId = localStorage.getItem('departamentoId');
    
    
    if (token) {
      return true;  // El usuario está autenticado
    } else {
      this.router.navigate(['/login']);  // Redirigir a la página de login si no está autenticado
      return false;
    }
  }
}
