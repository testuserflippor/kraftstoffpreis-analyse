import React, { useState, useEffect } from "react";

const FuelApp = () => {
  const [fuelType, setFuelType] = useState("diesel");
  const [station, setStation] = useState(null);

  useEffect(() => {
    fetch(`/api/cheapest-now?type=${fuelType}`)
      .then((res) => res.json())
      .then((data) => setStation(data));
  }, [fuelType]);

  return (
    <div>
      <h1>Günstigste Tankstelle in Deutschland</h1>
      <select
        value={fuelType}
       
