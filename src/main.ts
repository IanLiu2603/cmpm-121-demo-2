import "./style.css";

const APP_NAME = "sdasdasd";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

//Title
const title = document.createElement("h1");
title.innerHTML = "Title";
app.append(title);

//Canvas
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = 256;
canvas.height = 256; 

app.append(canvas);

//Drawing
let isDrawing: boolean = false;
let x:number = 0;
let y:number = 0;

canvas.addEventListener("mousedown", (e)=>{
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
})

canvas.addEventListener("mousemove", (e)=>{
    if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
})

canvas.addEventListener("mouseup", (e)=>{
    if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
})

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }

//Clear Button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";

clearButton.addEventListener("click", ()=>{
    context.reset();
})

app.append(clearButton);