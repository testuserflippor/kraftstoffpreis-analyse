const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const API_KEY = process.env.TANKERKOENIG_API_KEY;
const RADIUS = 250;
const LAT = 51.1657;
const LNG = 10.4515;

app.get("/api/cheapest-now", async (req, res) => {
  const type = req.query.type || "diesel";
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${LAT}&lng=${LNG}&rad=${RADIUS}&sort=price&type=${type}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const stations = response.data.stations;
    if (stations && stations.length > 0) {
     const availableStations = stations.filter(station => station.price !== null);
if (availableStations.length > 0) {
  const cheapest = availableStations[0];
  res.json({
    name: cheapest.name,
    price: cheapest.price,
    address: cheapest.street + ", " + cheapest.place,
  });
} else {
  res.status(404).send("Keine Tankstellen mit verfügbaren Preisen gefunden.");
}

    } else {
      res.status(404).send("Keine Tankstellen gefunden.");
    }
  } catch (error) {
    res.status(500).send("Fehler bei der API-Anfrage.");
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
app.get("/api/cheapest-365-days", async (req, res) => {
  const type = req.query.type || "diesel";  // diesel, e5, e10
  const historicalUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${LAT}&lng=${LNG}&rad=${RADIUS}&sort=price&type=${type}&apikey=${API_KEY}&date=365`;

  try {
    const response = await axios.get(historicalUrl);
    const stations = response.data.stations;

    if (stations && stations.length > 0) {
      // Finde die Tankstelle mit dem günstigsten Preis
      const cheapestStation = stations.reduce((min, station) =>
        (station.price < min.price ? station : min)
      );

      res.json({
        name: cheapestStation.name,
        price: cheapestStation.price,
        address: `${cheapestStation.street}, ${cheapestStation.place}`,
      });
    } else {
      res.status(404).send("Keine Tankstellen gefunden.");
    }
  } catch (error) {
    res.status(500).send("Fehler bei der API-Anfrage.");
  }
});

