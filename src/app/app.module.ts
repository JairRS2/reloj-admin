import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { authGuard } from './guards/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChecadasComponent } from './components/checadas/checadas.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator'; // Importar el módulo
import { MatTableModule } from '@angular/material/table'; // Tabla
import { MatSortModule } from '@angular/material/sort'; // Para el ordenamiento
import { MatIconModule } from '@angular/material/icon'; // Iconos
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; 
import { MAT_DATE_LOCALE } from '@angular/material/core';

// Registrar la localización en español
registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ChecadasComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule, // Agregar el módulo
    MatTableModule, // Agregar el módulo
    MatSortModule, // Agregar el módulo
    MatIconModule, // Agregar el módulo
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatInputModule
  ],
  providers: [
     { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },authGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
