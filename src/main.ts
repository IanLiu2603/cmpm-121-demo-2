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
interface Point {
    x: number;
    y: number;
    ctx: CanvasRenderingContext2D;

}

interface markerLine{
    initial: Point;
    drag: Point;
}

let pointContainer: Point [][] = [];
let isDrawing: boolean = false;
let x:number = 0;
let y:number = 0;

canvas.addEventListener("mousedown", (e)=>{
    let insert: Point = {x:e.offsetX, y:e.offsetY, ctx:context};
    pointContainer.push([insert]);
    isDrawing = true;
    canvas.dispatchEvent(new Event("drawing-changed"));
})

canvas.addEventListener("mousemove", (e)=>{
    if (isDrawing) {
        let toInsert: Point = {x:e.offsetX,y:e.offsetY, ctx:context};
        pointContainer[pointContainer.length-1].push(toInsert);
        canvas.dispatchEvent(new Event("drawing-changed"));
      }
})

canvas.addEventListener("mouseup", ()=>{
    if (isDrawing) {
        isDrawing = false;
      }
})

//Drawing-changed Event
canvas.addEventListener("drawing-changed", ()=>{
    context?.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < pointContainer.length; i++){
            context?.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context?.moveTo(pointContainer[i][0].x, pointContainer[i][0].y);
        for(let j = 0; j < pointContainer[i].length; j++){
            context?.lineTo(pointContainer[i][j].x,pointContainer[i][j].y)
            context?.stroke();
            
        }
        context?.closePath();
    }
})

//Clear Button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";

clearButton.addEventListener("click", ()=>{
    context?.clearRect(0,0,canvas.width,canvas.height);
    pointContainer = [];
    undoStack = [];
})

app.append(clearButton);

//Undo Button
let undoStack: Point[][] = []; //Emulate stack behavior with push and pop

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo"

undoButton.addEventListener("click", ()=>{
    if(pointContainer.length != 0){
        let temp: Point[]= pointContainer.pop();
        undoStack.push(temp);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
})

app.append(undoButton);

//Redo Button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo"

redoButton.addEventListener("click", ()=>{
    if(undoStack.length!=0){
        let temp: Point = undoStack.pop();
        pointContainer.push(temp);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
})

app.append(redoButton);