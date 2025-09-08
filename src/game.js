gamecanvasID = document.getElementById("gameCanvas");

context = gamecanvasID.getContext("2d");

context.fillStyle = 'red';

context.fillRect(0,0,800,600);

const img = new Image();
img.src = "../assets/map.png";

img.onload = function () {
  context.drawImage(img, 0, 0, 800, 600);
}


// Get coordinates relative to the map image
const mapElement = document.querySelector('.usa-map');
const icon = document.querySelector('.distribution-center');

// Nevada approximate position (you'll need to fine-tune)
const nevadaX = mapElement.width * 0.15; // 15% from left
const nevadaY = mapElement.height * 0.45; // 45% from top

icon.style.left = nevadaX + 'px';
icon.style.top = nevadaY + 'px';

// Wait for images to load
window.addEventListener('load', function() {
  // Get coordinates relative to the map image
  const mapElement = document.querySelector('.usa-map');
  const icon = document.querySelector('.distribution-center');

  // Nevada approximate position (you'll need to fine-tune)
  const nevadaX = mapElement.width * 0.15; // 15% from left edge
  const nevadaY = mapElement.height * 0.45; // 45% from top edge

  // Position the icon
  icon.style.left = nevadaX + 'px';
  icon.style.top = nevadaY + 'px';
});