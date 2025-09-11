const gamecanvasID = document.getElementById("gameCanvas");
const context = gamecanvasID.getContext("2d");

// Load the map image
const img = new Image();
img.src = "../assets/supplychainmap.png"; // Fixed path

const stores = [
  { id: 'store-1', x: 28, y: 220, forecast: 50 },
  { id: 'store-2', x: 353, y: 35, forecast: 75 },
  { id: 'store-3', x: 415, y: 200, forecast: 30 },
  { id: 'store-4', x: 630, y: 50, forecast: 50 },
  { id: 'store-5', x: 265, y: 520, forecast: 75 },
  { id: 'store-6', x: 780, y: 245, forecast: 30 },
  { id: 'store-7', x: 1205, y: 240, forecast: 30 },
  { id: 'store-8', x: 1165, y: 695, forecast: 30 },
  { id: 'store-9', x: 1159, y: 490, forecast: 30 },
  { id: 'store-10', x: 640, y: 680, forecast: 30 },
  // Add more stores with actual coordinates from your map
];


img.onload = function () {
  console.log("Image loaded successfully!");
  console.log("Original dimensions:", img.width, "x", img.height);

  // Set canvas to match image dimensions exactly
  gamecanvasID.width = img.width;
  gamecanvasID.height = img.height;

  // Draw image at its original size
  context.drawImage(img, 0, 0);

  createStoreControls();
}

function createStoreControls() {
  const controlsContainer = document.getElementById('store-controls');

  // Clear any existing controls first
  controlsContainer.innerHTML = '';

  stores.forEach((store, index) => {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'store-control';
    controlDiv.style.left = `${store.x}px`;
    controlDiv.style.top = `${store.y}px`;

    controlDiv.innerHTML = `
          <div class="forecast-display">
              Store ${index + 1}
          </div>
          <div class="forecast-display">
              Forecast: <span id="forecast-${store.id}">${store.forecast}</span>
          </div>

          <div class="control-buttons">
              <button class="control-btn" onclick="adjustForecast('${store.id}', -5)">−</button>
              <button class="control-btn" onclick="adjustForecast('${store.id}', 5)">+</button>
          </div>
      `;

    controlsContainer.appendChild(controlDiv);
  });
}

function adjustForecast(storeId, change) {
  const store = stores.find(s => s.id === storeId);
  store.forecast = Math.max(0, store.forecast + change);
  document.getElementById(`forecast-${storeId}`).textContent = store.forecast;

  console.log(`Store ${storeId} forecast updated to ${store.forecast}`);
  // Add your game logic here
}


