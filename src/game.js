const gamecanvasID = document.getElementById("gameCanvas");
const context = gamecanvasID.getContext("2d");

// Load the map image
const img = new Image();
img.src = "../assets/supplychainmap.png";

// Load truck image
const truckImg = new Image();
truckImg.src = "../assets/truck.png";

const stores = [
  { id: 'store-1', x: 37, y: 225, forecast: 50 },
  { id: 'store-2', x: 353, y: 35, forecast: 75 },
  { id: 'store-3', x: 425, y: 205, forecast: 30 },
  { id: 'store-4', x: 630, y: 50, forecast: 50 },
  { id: 'store-5', x: 265, y: 520, forecast: 75 },
  { id: 'store-6', x: 780, y: 245, forecast: 30 },
  { id: 'store-7', x: 1205, y: 240, forecast: 30 },
  { id: 'store-8', x: 1165, y: 695, forecast: 30 },
  { id: 'store-9', x: 1159, y: 490, forecast: 30 },
  { id: 'store-10', x: 640, y: 680, forecast: 30 },
];



const ship = {
  id: 'container-ship',
  x: 20,
  y: 435,
  stock: 450,
  minStock: 300,
  maxStock: 600
};

const truckDepot = {
  x: 100,
  y: 550
};

const distributionCenter = {
  id: 'distribution-center',
  x: 440,
  y: 500,
  stock: 0
};

let animationRunning = false;

img.onload = function () {
  console.log("Image loaded successfully!");
  console.log("Original dimensions:", img.width, "x", img.height);

  gamecanvasID.width = img.width;
  gamecanvasID.height = img.height;
  context.drawImage(img, 0, 0);

  createStoreControls();
  createShipControl();
}

function createStoreControls() {
  const controlsContainer = document.getElementById('store-controls');
  controlsContainer.innerHTML = '';

  stores.forEach((store, index) => {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'store-control';
    controlDiv.style.left = `${store.x}px`;
    controlDiv.style.top = `${store.y}px`;

    controlDiv.innerHTML = `
        <div class="forecast-display">
            ${store.name || `Store ${index + 1}`}
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

function createShipControl() {
  const controlsContainer = document.getElementById('store-controls');

  const shipDiv = document.createElement('div');
  shipDiv.className = 'ship-control';
  shipDiv.style.left = `${ship.x}px`;
  shipDiv.style.top = `${ship.y}px`;

  shipDiv.innerHTML = `
      <div class="forecast-display">
          Container Ship
      </div>
      <div class="forecast-display">
          Stock: <span id="ship-stock">${ship.stock}</span>
      </div>
      <div class="control-buttons">
          <button class="control-btn" onclick="adjustShipStock(-25)">−</button>
          <button class="control-btn" onclick="adjustShipStock(25)">+</button>
      </div>
      <div class="ship-actions">
          <button class="receive-btn" onclick="receiveStock()">Receive Stock</button>
      </div>
  `;

  controlsContainer.appendChild(shipDiv);
}

function adjustForecast(storeId, change) {
  const store = stores.find(s => s.id === storeId);
  store.forecast = Math.max(0, store.forecast + change);
  document.getElementById(`forecast-${storeId}`).textContent = store.forecast;

  console.log(`Store ${storeId} forecast updated to ${store.forecast}`);
}

function adjustShipStock(change) {
  ship.stock = Math.min(ship.maxStock, Math.max(ship.minStock, ship.stock + change));
  document.getElementById('ship-stock').textContent = ship.stock;
  console.log(`Ship stock updated to ${ship.stock}`);
}

function receiveStock() {
  if (animationRunning) return;

  console.log(`Receiving ${ship.stock} items from ship`);
  animationRunning = true;

  document.querySelector('.receive-btn').disabled = true;
  document.querySelector('.receive-btn').textContent = 'Shipping...';

  animateTruckDelivery(ship.stock);
}

function animateTruckDelivery(stockAmount) {
  const truck = document.createElement('div');
  truck.className = 'delivery-truck';
  truck.style.left = truckDepot.x + 'px';
  truck.style.top = truckDepot.y + 'px';

  truck.innerHTML = `
    <img src="../assets/truck.png" class="truck-image" alt="Delivery Truck">
    <div class="truck-cargo-label">${stockAmount}</div>
  `;

  document.getElementById('store-controls').appendChild(truck);

  const waypoints = [
    { x: truckDepot.x, y: truckDepot.y },
    { x: truckDepot.x + 100, y: truckDepot.y },
    { x: truckDepot.x + 100, y: truckDepot.y - 70 },
    { x: distributionCenter.x, y: distributionCenter.y }
  ];

  let currentWaypointIndex = 0;
  const segmentDuration = 2000;

  function animateToNextWaypoint() {
    if (currentWaypointIndex >= waypoints.length - 1) {
      onTruckArrived(stockAmount, truck);
      return;
    }

    const startPoint = waypoints[currentWaypointIndex];
    const endPoint = waypoints[currentWaypointIndex + 1];

    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    const startTime = performance.now();

    function animateSegment(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / segmentDuration, 1);

      const currentX = startPoint.x + (deltaX * progress);
      const currentY = startPoint.y + (deltaY * progress);

      truck.style.left = currentX + 'px';
      truck.style.top = currentY + 'px';
      truck.style.transform = `rotate(${angle}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animateSegment);
      } else {
        currentWaypointIndex++;
        animateToNextWaypoint();
      }
    }

    requestAnimationFrame(animateSegment);
  }

  animateToNextWaypoint();
}

function onTruckArrived(stockAmount, truck) {
  truck.classList.add('truck-arrived');
  distributionCenter.stock += stockAmount;

  setTimeout(() => {
    truck.remove();
    ship.stock = 450;
    document.getElementById('ship-stock').textContent = ship.stock;

    document.querySelector('.receive-btn').disabled = false;
    document.querySelector('.receive-btn').textContent = 'Receive Stock';

    showAllocateButton();
    animationRunning = false;
    console.log(`Truck delivered ${stockAmount} items. DC stock: ${distributionCenter.stock}`);
  }, 800);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function showAllocateButton() {
  const existingBtn = document.getElementById('allocate-btn');
  if (existingBtn) existingBtn.remove();

  const allocateBtn = document.createElement('button');
  allocateBtn.id = 'allocate-btn';
  allocateBtn.className = 'allocate-btn';
  allocateBtn.textContent = `Allocate ${distributionCenter.stock} items`;
  allocateBtn.onclick = allocateStock;

  allocateBtn.style.position = 'absolute';
  allocateBtn.style.left = distributionCenter.x + 'px';
  allocateBtn.style.top = (distributionCenter.y - 40) + 'px';

  document.getElementById('store-controls').appendChild(allocateBtn);
}

function allocateStock() {
  if (distributionCenter.stock === 0) {
    alert('No stock available to allocate!');
    return;
  }

  console.log('Allocating stock to stores based on forecasts...');

  const allocateBtn = document.getElementById('allocate-btn');
  if (allocateBtn) allocateBtn.remove();

  const totalDemand = stores.reduce((sum, store) => sum + store.forecast, 0);

  const allocations = stores.map(store => {
    const allocation = Math.min(
      Math.floor((store.forecast / totalDemand) * distributionCenter.stock),
      store.forecast
    );
    return { store, allocation };
  }).filter(item => item.allocation > 0);

  distributionCenter.stock = 0;

  allocations.forEach((item, index) => {
    setTimeout(() => {
      sendTruckToStore(item.store, item.allocation);
    }, index * 600);
  });
}

function sendTruckToStore(store, amount) {
  const truck = document.createElement('div');
  truck.className = 'delivery-truck';
  truck.style.left = distributionCenter.x + 'px';
  truck.style.top = distributionCenter.y + 'px';

  truck.innerHTML = `
    <img src="../assets/truck.png" class="truck-image" alt="Delivery Truck">
    <div class="truck-cargo-label">${amount}</div>
  `;

  document.getElementById('store-controls').appendChild(truck);

  const targetX = store.deliveryX || store.x;
  const targetY = store.deliveryY || store.y;

  const deltaX = targetX - distributionCenter.x;
  const deltaY = targetY - distributionCenter.y;
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  const duration = 2500;
  const startTime = performance.now();

  function animateFrame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    const currentX = distributionCenter.x + (deltaX * easedProgress);
    const currentY = distributionCenter.y + (deltaY * easedProgress);

    truck.style.left = currentX + 'px';
    truck.style.top = currentY + 'px';
    truck.style.transform = `rotate(${angle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animateFrame);
    } else {
      truck.classList.add('truck-arrived');
      setTimeout(() => {
        truck.remove();
        console.log(`Delivered ${amount} items to ${store.id}`);
      }, 500);
    }
  }

  requestAnimationFrame(animateFrame);
}


gamecanvasID.addEventListener('click', function(e) {
  const rect = gamecanvasID.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  console.log(`Clicked at: x: ${Math.round(x)}, y: ${Math.round(y)}`);
});

