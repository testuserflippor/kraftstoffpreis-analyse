const backendURL = "https://kraftstoffpreis-analyse.onrender.com";

async function loadCheapest() {
  const type = document.getElementById("fuelType").value;
  const url = `${backendURL}/api/cheapest-now?type=${type}`;
  const name = document.getElementById("stationName");
  const price = document.getElementById("stationPrice");
  const address = document.getElementById("stationAddress");

  name.textContent = "Lade...";
  price.textContent = "–";
  address.textContent = "–";

  try {
    const res = await fetch(url);
    const data = await res.json();
    name.textContent = data.name;
    price.textContent = data.price.toFixed(3);
    address.textContent = data.address;
  } catch (err) {
    name.textContent = "Fehler beim Laden.";
  }
}

document.getElementById("loadBtn").addEventListener("click", loadCheapest);
window.addEventListener("DOMContentLoaded", loadCheapest);
