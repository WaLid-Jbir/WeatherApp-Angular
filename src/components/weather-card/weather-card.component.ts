import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { NgClass } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-weather-card',
  imports: [FormsModule, NgClass],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css'
})
export class WeatherCardComponent implements OnInit {
  
  cityName: string = "London";

  isCelsius: boolean = true; // 🔁 Track current unit

  isDay: boolean = true;
  
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

  private kelvinTempData: any = {};

  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.cityName) {
      this.weatherService.fetchData(this.cityName).subscribe({
        next: (data: any) => {
          console.log(data);
          // Store Kelvin temps to support toggling later
          this.kelvinTempData = {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            min_temp: data.main.temp_min,
            max_temp: data.main.temp_max,
          };

          this.data.humidity = data.main.humidity;
          this.data.wind = data.wind.speed;
          this.data.visibility = data.visibility;
          this.data.pressure = data.main.pressure;
          this.data.city = data.name;
          this.data.imageURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
          this.data.main = data.weather[0].main;
          this.data.description = data.weather[0].description;

          // Set isDay based on weather icon
          this.isDay = data.weather[0].icon.endsWith("d");


          // Display temps initially in Celsius
          this.convertToCelsius();
          this.isCelsius = true;
        },
        error: (error) => {
          alert("The city was not found. Please enter a valid city name.");
          console.log("Error while fetching data", error);
        }
      });
    }
  }

  // Convert to Celsius
  convertToCelsius() {
    this.data.temp = (this.kelvinTempData.temp - 273.15).toFixed(2);
    this.data.feels_like = (this.kelvinTempData.feels_like - 273.15).toFixed(2);
    this.data.min_temp = (this.kelvinTempData.min_temp - 273.15).toFixed(2);
    this.data.max_temp = (this.kelvinTempData.max_temp - 273.15).toFixed(2);
  }

  // Convert to Fahrenheit
  convertToFahrenheit() {
    this.data.temp = ((this.kelvinTempData.temp - 273.15) * 9/5 + 32).toFixed(2);
    this.data.feels_like = ((this.kelvinTempData.feels_like - 273.15) * 9/5 + 32).toFixed(2);
    this.data.min_temp = ((this.kelvinTempData.min_temp - 273.15) * 9/5 + 32).toFixed(2);
    this.data.max_temp = ((this.kelvinTempData.max_temp - 273.15) * 9/5 + 32).toFixed(2);
  }

  // Toggle Unit
  toggleTemperatureUnit() {
    this.isCelsius = !this.isCelsius;
    this.isCelsius ? this.convertToCelsius() : this.convertToFahrenheit();
  }

  getDateNow(): string {
    return `${moment().format('dddd, D MMMM, YYYY, HH:mm')}`;
  }
}
