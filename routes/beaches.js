const express = require('express');
const axios = require('axios');
const router = express.Router();
const Beach = require('../models/beach'); 
const apiKey = process.env.OPEN_WEATHER;
const classifyWindSpeed =require('../models/scripts/vento.js')
const kelvinToCelsius = require('../models/scripts/kelvinToC.js')
module.exports = () => { 

  


  router.get('/', async (req, res) => {
    try {
      console.log('Fetching beaches from database...');
      const beaches = await Beach.find({});
      console.log('Beaches fetched:', beaches);
  
      const beachDataPromises = beaches.map(async (beach) => {
        try {
          console.log(`Fetching weather for beach: ${beach.name}`);
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${beach.latitude}&lon=${beach.longitude}&exclude=hourly,daily&appid=${apiKey}&lang=it`
          );
  
          const weatherData = weatherResponse.data.current;
          const weather = weatherData.weather[0].description;
          const windSpeed = classifyWindSpeed(weatherData.wind_speed);
          const temperature = kelvinToCelsius(weatherData.temp);
  
          return { 
            ...beach.toObject(), 
            weather,
            windSpeed,
            temperature 
          };
        } catch (error) {
          console.error(`Error fetching weather data for beach ${beach.name}:`, error);
          // Ritornare la spiaggia senza i dati meteo in caso di errore
          return { ...beach.toObject(), weather: null, windSpeed: null, temperature: null };
        }
      });
  
      // Attendi il completamento di tutte le promesse
      const beachData = await Promise.all(beachDataPromises);
  
      // Invia i dati delle spiagge insieme ai dati meteo come risposta
      res.json(beachData);
    } catch (err) {
      console.error('Error occurred while fetching beach data:', err);
      // Gestisci gli errori
      res.status(500).send(err);
    }
  });
router.post('/', async (req, res) => {
  try {
    // Estrai i dati dalla richiesta
    const { name, location, bandiera_blu, latitude, longitude } = req.body;

    // Crea una nuova istanza di Beach utilizzando i dati ricevuti
    const newBeach = new Beach({
      name,
      location,
      bandiera_blu,
      latitude,
      longitude
    });

    // Salva la nuova spiaggia nel database
    await newBeach.save();

    // Invia la nuova spiaggia come risposta
    res.status(201).json(newBeach);
  } catch (err) {
    // Gestisci gli errori
    console.error('Error adding beach:', err);
    res.status(500).send('Error adding beach');
  }
});

    return router;
};
