import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherData(endpoint: string): Observable<any> {
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    // Manejo básico de errores
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
