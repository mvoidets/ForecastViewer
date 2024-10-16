import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
lat: string;
lon: string;

}

//where do i define city the user will enter??? 
// let city;  ???
// // TODO: Define a class for the Weather objlet
// class Weather {
//   temperature: string;
//   conditions: string;


//   constructor(temperature: string, conditions: string) {
//     this.temperature = temperature;
//     this.conditions = conditions;
    
  
// }
// };


// TODO: Complete the WeatherService class
class WeatherService {
  city = '';
  coordinates: Coordinates = { lat: '', lon: '' };
 
  private baseURL?: string ;
  private apiKey?: string;
  private cityName: string="";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "" ;
    this.apiKey = process.env.API_KEY || "";
  
  }

  // TODO: Create fetchLocationData method
  //i dont know lat and lon at this point???  only city  name

private async fetchLocationData() {
  console.log(this.cityName);
  const endpoint = `${this.baseURL}/data/2.5/weather?q=${this.cityName}&cnt=1&units=imperial&appid=${this.apiKey}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
   
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch location data:', error);
    throw error;
  }
}
  // TODO: Create destructureLocationData method
  private async destructureLocationData() {
    // const  locationData = await this.fetchLocationData(city)
    try {
      const locationData = await this.fetchLocationData();
            // Destructure to get city name and coordinates
      const { name: city, coord } = locationData; // Adjust based on actual data structure
            // Set instance variables
      this.city = city;
      this.coordinates = {
          lat: coord.lat,
          lon: coord.lon
      };
  } catch (error) {
      console.error('Error destructuring location data:', error);
      throw error;
     }
}       


  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
        return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&cnt=1&units=imperial&appid=${this.apiKey}`; 
   
}

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coord: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&cnt=1&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    await fetch(this.buildGeocodeQuery());
    return this.destructureLocationData();
}




  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    //const forecastResponse = await fetch(`${this.baseURL}/data/2.5/forecast/daily?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&cnt=5&appid=${this.apiKey}`);
    const forecastResponse = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&cnt=48&appid=${this.apiKey}`);
    const weatherData = await response.json();
    console.log(weatherData);
    const forecastData = await forecastResponse.json();

    //select 5days of forecast data
    const dailyForecasts = forecastData.list
            .filter((_: any, index: number) => index % 8 === 0) // Get every 8th element
            .slice(0, 6); 
    forecastData.list = dailyForecasts;

    const allWeatherData = { ...weatherData, daily: forecastData.list };
 
    return allWeatherData; 
  }

  // TODO: Build parseCurrentWeather method 
    private parseCurrentWeather(response: any) {
    const { temp: temperature} = response.main;
    const { speed: wind} = response.wind;
    const { humidity: humidity } = response.main;
    const { dt: date} = response;
    const { name: city} = response;
    const { description: description, icon: icon } = response.weather[0];
    return {date, temperature, wind, humidity, description, icon, city};
}

  // TODO: Complete buildForecastArray method
  private buildForecastArray( weatherData: any[]) {
  
    return weatherData.map(data => ({
      date: data.dt,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      temperature: data.main.temp,
      wind: data.wind.speed,
      humidity: data.main.humidity
      
    }));

  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    await this.fetchAndDestructureLocationData(); 
    const weatherData = await this.fetchWeatherData(this.coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.daily);
    return { currentWeather, forecastArray };
}

}

export default new WeatherService();
