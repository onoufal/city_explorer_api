const locations = [];

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
////////////////////////////////////////////////
const handleLoc = (req, res) => {
  const location = require('./data/location.json');
  location.forEach(elem => {
    const locinfo = new Location(req.query.city, elem.display_name, elem.lat, elem.lon);
    locations.push(locinfo);
  });

  locations.forEach(elem => {
    const city = elem.formatted_query.split(',')[0];
    if (city === req.query.city) {
      // res.status(200).json(`lat: ${elem.lat}, long:${elem.long}`);
      res.status(200).json(elem);

    }
  })


}
app.get('/location', handleLoc);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}