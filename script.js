/**
 * @type HTMLCanvasElement
 */

// grab all the required elements
const guide = document.querySelector(".guide");
const canvas = document.querySelector(".canvas");
const colorInput = document.querySelector(".colorInput");
const toggleGuide = document.querySelector(".toggleGuide");
const clearBtn = document.querySelector(".clearButton");
const drawingPad = canvas.getContext("2d");
const inputNum = document.querySelector(".inputNum");
// create a obj to define what colors were used for what x, y axis
const colors = {};
let num;
let pixelSize;
inputNum.addEventListener("change", function () {
  num = inputNum.value;
  // create value for grid layout
  let columnSize = num;
  // // canvas pixel sizes
  pixelSize = canvas.width / columnSize;
  // input  event listener

  // set a default value for the input color display
  colorInput.value = "#00FF00";

  // Setting canvas background color
  drawingPad.fillStyle = "#FFFFFF";

  // filling the canvas with pixels
  drawingPad.fillRect(0, 0, canvas.width, canvas.height);
  console.log(canvas.children);

  while (guide.firstChild) {
    guide.removeChild(guide.firstChild);
  }
  // Setting up guidelines
  {
    guide.style.width = `${canvas.width}px`;
    guide.style.height = `${canvas.height}px`;
    guide.style.gridTemplateColumns = `repeat(${columnSize}, 1fr)`;
    guide.style.gridTemplateRows = `repeat(${columnSize}, 1fr)`;
    [...Array(columnSize ** 2)].forEach(() => {
      guide.insertAdjacentHTML("beforeend", "<div></div>");
    });
  }
});
//Handle mouse down clicks
function handleMousedown(e) {
  // Using Proper primary button
  if (e.button !== 0) {
    return;
  }
  // get the obj of the info of the canvas
  const canvasBoundingRect = canvas.getBoundingClientRect();
  // get the x and y values from the clicking point

  const x = e.clientX - canvasBoundingRect.left;
  const y = e.clientY - canvasBoundingRect.top;

  // getting cell size in px
  const cellX = Math.floor(x / pixelSize);
  const cellY = Math.floor(y / pixelSize);

  // allowing for ctrl clicking to get a already used color
  const currentColor = colors[`${cellX}_${cellY}`];

  if (e.ctrlKey) {
    if (currentColor) {
      colorInput.value = currentColor;
    } else {
      fillCells(cellX, cellY);
    }
  }
  // Fill the cell that was clicked
  fillCells(cellX, cellY);
}

// Fill the Cells
function fillCells(cellX, cellY) {
  // getting pixel placement
  const startX = cellX * pixelSize;
  const startY = cellY * pixelSize;
  // setting color of the color input to the fill color
  drawingPad.fillStyle = colorInput.value;
  // filling it at x, and y position with the size of the pixel size
  drawingPad.fillRect(startX, startY, pixelSize, pixelSize);
  // Adding to the color history
  colors[`${cellX}_${cellY}`] = colorInput.value;
}

// Handle the CheckMark (toggle)
function handleCheckMark() {
  guide.style.display = toggleGuide.checked ? null : "none";
}

// Handle the Clear Button
function clearButton() {
  const yes = confirm("Are you sure you want to clear the canvas?");

  // if they say yes return
  if (!yes) return;

  // give the clear to the canvas
  drawingPad.fillStyle = "#FFFFFF";
  drawingPad.fillRect(0, 0, canvas.width, canvas.height);
}

// Event listeners
canvas.addEventListener("mousedown", handleMousedown);
clearBtn.addEventListener("click", clearButton);
toggleGuide.addEventListener("change", handleCheckMark);
