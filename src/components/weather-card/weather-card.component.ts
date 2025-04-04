import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-weather-card',
  imports: [FormsModule, NgClass],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css'
})
export class WeatherCardComponent implements OnInit {
  
  cityName: string = "London";
  data: any = {
    temp: '',
    humidity: '',
    wind: '',
    visibility: '',
    pressure: '',
    city: '',
    main: '',
    imageURL: '',
    description: '',
    feels_like: '',
    min_temp: '',
    max_temp: '',
  };

  constructor( private readonly weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.cityName) {
      this.weatherService.fetchData(this.cityName).subscribe({
        next: (data: any) => {
          console.log(data);
          this.data.temp = (data.main.temp - 273.15).toFixed(2);
          this.data.humidity = data.main.humidity;
          this.data.wind = data.wind.speed;
          this.data.visibility = data.visibility;
          this.data.pressure = data.main.pressure;
          this.data.city = data.name;
          this.data.imageURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
          this.data.main = data.weather[0].main;
          this.data.description = data.weather[0].description;
          this.data.feels_like = (data.main.feels_like - 273.15).toFixed(2);
          this.data.min_temp = (data.main.temp_min - 273.15).toFixed(2);
          this.data.max_temp = (data.main.temp_max - 273.15).toFixed(2);
        },
        error: (error) => {
          console.log("Error while fetching data", error);
        }
      });
    }
  }
  
}
