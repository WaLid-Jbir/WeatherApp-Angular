import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor( private http: HttpClient ) { }

  fetchData(cityName: string) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${environment.WEATHER_API_KEY}`;
    return this.http.get(url);
  }
}
