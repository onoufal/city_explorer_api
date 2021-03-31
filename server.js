'use strict';
/********************************************************/
let locations = {};
let waetherData = {};
let parks = {};
/********************************************************/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
const superagent = require('superagent');
/********************************************************/
/********************************************************/
const locationHandlar = (req, res) => {
  try {
    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`
    if (locations[url]) {
      res.status(200).send(locations[url]);
    } else {
      superagent.get(url).then(data => {
        const geoData = data.body[0];
        const location = new Location(city, geoData);
        locations[url] = location;
        res.status(200).send(locations[url]);
      });
    }
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).send(`Oooops! Something went wrong ${error}`);
  }

}
/*************************************************************/
/*************************************************************/

app.get('/location', locationHandlar);

app.get('/weather', weatherHandlar);

app.get('*', handleError);

function handleError(req, res) {
  res.status(404).send({ status: 404, respondText: 'sorry this page does not exist' });
}

function weatherHandlar(req, res) {
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
  this.formatted_query = location.display_name;
  this.latitude = location.lat;
  this.longitude = location.lon;
}

