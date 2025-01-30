import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Definir la interfaz para los datos de checadas
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

@Component({
  selector: 'app-checadas',
  templateUrl: './checadas.component.html',
  styleUrls: ['./checadas.component.css'],
})
export class ChecadasComponent implements OnInit {
  displayedColumns: string[] = ['ClaveEmpleado', 'Nombre', 'Departamento', 'Puesto', 'FechaChecada', 'HoraEntrada', 'HoraSalida', 'HorasLaboradas'];
  dataSource = new MatTableDataSource<Checada>();
  originalData: Checada[] = [];
  errorMessage: string | null = null;
  opcionExportacion: string = 'pagina';
  searchTerm: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  departamentoId: string = '';
  db: string = ''; // Se añadirá el valor de la base de datos seleccionada

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const storedDepartamentoId = localStorage.getItem('departamentoId');
    const storedDb = localStorage.getItem('db'); // Obtén el valor de db desde localStorage
    if (storedDepartamentoId && storedDb) {
      this.departamentoId = storedDepartamentoId;
      this.db = storedDb; // Asigna el valor de db
      this.loadChecadas(this.departamentoId);
    } else {
      this.errorMessage = 'No se pudo recuperar los datos necesarios. Inicie sesión nuevamente.';
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadChecadas(departamentoId: string): void {
    if (!this.db) {
      this.errorMessage = 'No se seleccionó la base de datos.';
      return;
    }

    this.apiService.getChecadasPorDepartamento(departamentoId, this.db).subscribe(
      (response) => {
        const mappedData = response.map((checada: any) => {
          const fechaISO = new Date(checada.FechaChecada);
          const fechaLocal = new Date(fechaISO.getTime() + fechaISO.getTimezoneOffset() * 60000);
          const horaEntrada = new Date(`1970-01-01T${checada.HoraEntrada}:00`);
          const horaSalida = new Date(`1970-01-01T${checada.HoraSalida}:00`);

          return {
            ...checada,
            FechaChecada: fechaLocal,
            HorasLaboradas: this.calcularHorasLaboradas(horaEntrada, horaSalida),
          };
        });

        this.originalData = mappedData;
        this.dataSource.data = [...this.originalData];
      },
      (error) => {
        this.errorMessage = 'Error al cargar las asistencias.';
      }
    );
  }

  applyFilters(): void {
    let filteredData = [...this.originalData]; // Siempre empieza desde los datos originales

    if (this.searchTerm) {
      const filterValue = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter((checada) =>
        checada.Nombre.toLowerCase().includes(filterValue) ||
        checada.ClaveEmpleado.toLowerCase().includes(filterValue)
      );
    }

    if (this.startDate || this.endDate) {
      filteredData = filteredData.filter((checada) => {
        const fecha = new Date(checada.FechaChecada);
        return (
          (!this.startDate || fecha >= this.startDate) &&
          (!this.endDate || fecha <= this.endDate)
        );
      });
    }

    this.dataSource.data = filteredData;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.dataSource.data = [...this.originalData];

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  calcularHorasLaboradas(horaEntrada: Date, horaSalida: Date): string {
    const diferencia = horaSalida.getTime() - horaEntrada.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}m`;
  }

  exportarExcel(): void {
    let datosExportar: Checada[];

    if (this.opcionExportacion === 'pagina') {
      const inicio = this.paginator.pageIndex * this.paginator.pageSize;
      const fin = inicio + this.paginator.pageSize;
      datosExportar = this.dataSource.data.slice(inicio, fin);
    } else {
      datosExportar = this.dataSource.data;
    }

    const datosTransformados = datosExportar.map((checada) => ({
      ClaveEmpleado: checada.ClaveEmpleado,
      Nombre: checada.Nombre,
      Puesto: checada.Puesto,
      FechaChecada: checada.FechaChecada.toLocaleDateString('es-MX', {
        timeZone: 'America/Mexico_City',
      }),
      HoraEntrada: checada.HoraEntrada,
      HoraSalida: checada.HoraSalida,
      HorasLaboradas: checada.HorasLaboradas,
    }));

    const hoja = XLSX.utils.json_to_sheet(datosTransformados);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Checadas');

    const buffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Checadas.xlsx');
  }
}
