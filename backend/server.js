const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const API_KEY = process.env.TANKERKOENIG_API_KEY;
const RADIUS = 25;
const LAT = 51.1657;
const LNG = 10.4515;

app.get("/api/cheapest-now", async (req, res) => {
  const type = req.query.type || "diesel";
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${LAT}&lng=${LNG}&rad=${RADIUS}&sort=price&type=${type}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const stations = response.data.stations;
    if (stations && stations.length > 0) {
      const cheapest = stations[0];
      res.json({
        name: cheapest.name,
        price: cheapest.price,
        address: cheapest.street + ", " + cheapest.place,
      });
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

