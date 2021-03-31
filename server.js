'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


const handleLoc = (req, res) => {
  try {
    const location = require('./data/location.json');
    const locinfo = new Location(req.query.city, location);
    res.status(200).send(locinfo);
  } catch (error) {
    res.status(500).send(`Oooops! Something went wrong ${error}`);
  }
}


app.get('/location', handleLoc);

app.get('/weather', handleWeather);

app.get('*', handleError);

function handleError(req, res) {
  res.status(404).send({ status: 404, respondText: 'sorry this page does not exist' });
}

function handleWeather(req, res) {
  try {
    const weather = require('./data/weather.json');
    const weatherData = [];
    weather.data.forEach(elem => {
      weatherData.push(new Weather(elem.weather.description, elem.valid_date));
    });
    // console.log(weatherData);
    res.status(200).send(weatherData);
  } catch (error) {
    res.status(500).send(`Oooops Error ${error}`);
  }
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