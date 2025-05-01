const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "DEIN_API_KEY";
const LAT = 50.0; // Dein Breitengrad
const LNG = 10.0; // Dein Längengrad
const RADIUS = 100; // Umkreis in km

// Endpunkt für das Frontend, um aktuelle und historische Daten zu bekommen
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

// Funktion, die alle 10 Minuten die Daten abruft und speichert
const fetchAndSavePrices = async () => {
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${LAT}&lng=${LNG}&rad=${RADIUS}&apikey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const stations = response.data.stations;
    if (stations && stations.length > 0) {
      const timestamp = new Date().toISOString();
      const dataToSave = stations.map(station => ({
        timestamp,
        name: station.name,
        price: station.price,
        address: `${station.street}, ${station.place}`,
      }));
      
      // Speichern in einer Datei
      fs.appendFile('historical_prices.json', JSON.stringify(dataToSave, null, 2), err => {
        if (err) {
          console.log("Fehler beim Speichern der Daten:", err);
        } else {
          console.log("Daten erfolgreich gespeichert.");
        }
      });
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Preise:", error);
  }
};

// Alle 10 Minuten die Daten abrufen
setInterval(fetchAndSavePrices, 10 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
