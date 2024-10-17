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
    drag: Point[];
    thickness: number;
}

let lineContainer: markerLine[] = [];
let isDrawing: boolean = false;
let x:number = 0;
let y:number = 0;

canvas.addEventListener("mousedown", (e)=>{
    let insert: Point = {x:e.offsetX, y:e.offsetY, ctx:context};
    let line: markerLine = {initial: insert, drag: [], thickness: thickness}
    lineContainer.push(line);
    isDrawing = true;
    canvas.dispatchEvent(new Event("drawing-changed"));
})

canvas.addEventListener("mousemove", (e)=>{
    if (isDrawing) {
        let toInsert: Point = {x:e.offsetX,y:e.offsetY, ctx:context};
        lineContainer[lineContainer.length-1].drag.push(toInsert);
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
    for(let i = 0; i < lineContainer.length; i++){
            context?.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = lineContainer[i].thickness;
            console.log(thickness);
            context?.moveTo(lineContainer[i].initial.x,lineContainer[i].initial.y);
        for(let j = 0; j < lineContainer[i].drag.length; j++){
            context?.lineTo(lineContainer[i].drag[j].x,lineContainer[i].drag[j].y)
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
    lineContainer = [];
    undoStack = [];
})

app.append(clearButton);

//Undo Button
let undoStack: markerLine[] = []; //Emulate stack behavior with push and pop

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo"

undoButton.addEventListener("click", ()=>{
    if(lineContainer.length != 0){
        let temp: markerLine= lineContainer.pop();
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
        let temp: markerLine = undoStack.pop();
        lineContainer.push(temp);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
})

app.append(redoButton);

//Marker Selector
let thickness: number = 1;
const thinButton = document.createElement("button");
const thickButton = document.createElement("button");
thinButton.innerHTML = "thin";
thickButton.innerHTML = "thick";

thinButton.addEventListener("click",()=>{
    thickness = 1;
})
thickButton.addEventListener("click", ()=>{
    thickness = 3;
})

app.append(thinButton);
app.append(thickButton);