import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/',async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const { city } = req.body; 
  if (req.body) {
    try{
    await WeatherService.getWeatherForCity(city); //not sure about this one
    res.json(`Weather added successfully`);
  } catch (error) {
    console.log ('Error adding weather data:', error)
    res.send('Error in adding weather data');
  }
}else{
  res.status(400).send('City name is required');
}
});



// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {

  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'City id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


export default router;
