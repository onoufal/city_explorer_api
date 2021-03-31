'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


const handleLoc = (req, res) => {
  const location = require('./data/location.json');
  const locinfo = new Location(req.query.city, location);
  try {
    res.send(locinfo);
  } catch (error) {
    res.status(404).send(`Oooops! Something went wrong ${error}`);
  }
}


app.get('/location', handleLoc);

app.get('/weather', handleWeather);

function handleWeather(req, res) {
  const weather = require('./data/weather.json');
  const weatherData = [];
  weather.data.forEach(elem => {
    weatherData.push(new Weather(elem.weather.description, elem.valid_date));
  });
  // console.log(weatherData);
  res.status(200).json(weatherData);
}

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function Location(search_query, location) {
  this.search_query = search_query;
  this.formatted_query = location[0].display_name;
  this.latitude = location[0].lat;
  this.longitude = location[0].lon;
}