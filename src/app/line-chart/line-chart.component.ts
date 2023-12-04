import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../weather.service';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  chart!: Chart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
    ) { }
  
    

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
    
        if (id) {
          const urlMap: { [key: string]: string } = {
            'LWX': 'https://api.weather.gov/gridpoints/LWX/31,80/forecast',
            'TOP': 'https://api.weather.gov/gridpoints/TOP/31,80/forecast'
          };
    
          const url = urlMap[id];
          if (url) {
            this.weatherService.getWeatherData(url).subscribe(
              data => {
                console.log('Datos del clima:', data.properties.periods); // Muestra los datos en la consola
                this.updateChartData(data);
                // Aquí también podrías llamar a otros métodos para procesar los datos
              },
              error => {
                console.error('Hubo un error al obtener los datos del clima:', error);
              }
            );
          } else {
            console.error('Identificador de URL no válido:', id);
          }
        } else {
          console.error('No se proporcionó un identificador de ruta');
        }
      });
    }
    
    updateChartData(data: any): void {
      const periods = data.properties.periods;
    
      const labels = periods.map((period: any) => period.name);
      const temperatureData = periods.map((period: any) => ({
        temperature: period.temperature,
        unit: period.temperatureUnit
      }));
    
      this.createChart(labels, temperatureData);
    }

  goBack(): void {
    this.router.navigate(['/']);
  }

  createChart(labels: string[], temperatureData: { temperature: number; unit: string }[]): void {
    this.chart = new Chart('canvasId', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura',
          data: temperatureData.map(data => data.temperature),
          borderColor: '#007bff', // Color azul para la línea
          backgroundColor: 'rgba(0, 123, 255, 0.3)', // Color de fondo azul claro
          borderWidth: 2,
          pointBackgroundColor: '#007bff', // Color de los puntos
          pointBorderColor: '#fff', // Borde blanco para los puntos
          pointHoverBackgroundColor: '#fff', // Color de hover para los puntos
          pointHoverBorderColor: '#007bff' // Color de borde al hacer hover
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value,index) {
                return `${value} ${temperatureData[index].unit}`; // Añade la unidad a cada valor
              },
              color: '#343a40', // Color de los ticks (marcas) del eje Y
              font: {
                size: 12 // Tamaño de la fuente
              }
            }
          },
          x: {
            ticks: {
              color: '#343a40', // Color de los ticks del eje X
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Color de fondo para los tooltips
            borderColor: 'rgba(255, 255, 255, 0.8)', // Color del borde
            borderWidth: 1,
            titleFont: {
              size: 16 // Tamaño de fuente para el título del tooltip
            },
            bodyFont: {
              size: 14 // Tamaño de fuente para el cuerpo del tooltip
            }
          },
          legend: {
            display: true
          }
        }
      }
    });
  }
  
  
  
}