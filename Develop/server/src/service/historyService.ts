//import { promises as fs } from 'fs';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
   name: string;
   id: string;

   constructor(name: string, id: string){
    this.name = name;
    this.id = id;
   }
}

class HistoryService {
  private async read() {
    try {
      await fs.access('./db/searchHistory.json');
    } catch (err) {
      await fs.writeFile('./db/searchHistory.json', '[]');
    }
    return await fs.readFile('./db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile('./db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  async addCity(city: string){
    if (!city) {
      throw new Error('city cannot be blank');
    }

    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
