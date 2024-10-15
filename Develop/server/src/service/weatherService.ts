import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
lat: string;
lon: string;

}

//where do i define city the user will enter??? 
// let city;  ???
// TODO: Define a class for the Weather objlet
class Weather {
  temperature: string;
  conditions: string;


  constructor(temperature: string, conditions: string) {
    this.temperature = temperature;
    this.conditions = conditions;
    
  
}
};


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  city = '';
  coordinates: Coordinates = { lat: '', lon: '' };
 
  private baseURL?: string ;
  private apiKey?: string;
  private cityName: string="";

  constructor() {
    this.baseURL = process.env.baseURL || "" ;
    this.apiKey = process.env.apiKey || "";
  
  }
  public setCityName(cityName: string) {
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
  //i dont know lat and lon at this point???  only city  name

private async fetchLocationData() {
  const endpoint = `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
   
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch location data:', how);
    throw error;
  }
}
  // TODO: Create destructureLocationData method
  private async destructureLocationData(): Promise<Coordinates> {
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

      return this.coordinates;
  
  } catch (error) {
      console.error('Error destructuring location data:', error);
      throw error;
  }
}       


  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    //const apiKey = "eda7f63ba9da46c2e35c77bcaaf13ed8"; 
    return `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`; //not sure what url to use here if user entering cityname
   
}

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coord: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    await fetch(this.buildGeocodeQuery());
    return this.destructureLocationData();
}

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData;
}

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp: temperature, weather: conditions } = response.current;
    return new Weather(temperature, conditions);
}

  // TODO: Complete buildForecastArray method
  private buildForecastArray( weatherData: any[]) {
    return weatherData.map(day => ({
      date: day.dt,
      temperature: day.temp.day,
      conditions: day.weather[0].description,
    }));
}

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    await this.fetchAndDestructureLocationData(); // lat lon
    const weatherData = await this.fetchWeatherData(this.coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.daily);
    return { currentWeather, forecastArray };
}

}

export default new WeatherService();
