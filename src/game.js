gamecanvasID = document.getElementById("gameCanvas");

context = gamecanvasID.getContext("2d");

context.fillStyle = 'red';

context.fillRect(0,0,800,600);

const img = new Image();
img.src = "./map.png";

img.onload = function () {
  context.drawImage(img, 0, 0, 800, 600);
}