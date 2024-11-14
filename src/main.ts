import "./style.css";

const APP_NAME = "sdasdasd";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
//app.innerHTML = APP_NAME;

//App defaults
const defaultWidth = 256;
const defaultHeight = 256;
const exportWidth = 1024;
const exportHeight = 1024;
const exportRatioWidth = defaultWidth/exportWidth;
const exportRatioHeight = defaultHeight/exportHeight;

//Title
const title = document.createElement("h1");
title.innerHTML = "TSPaint";
app.append(title);

//Canvas
const canvas = document.createElement("canvas");
const context:CanvasRenderingContext2D = canvas.getContext("2d");
canvas.style.cursor = "none";
let currentColor: string = "black";


canvas.width = defaultWidth;
canvas.height = defaultWidth; 

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
    currentThickness: number;
    currentColor: string;
}

let lineContainer: markerLine[] = [];
let isDrawing: boolean = false;

function CreateButton(text: string, clickHandler: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.addEventListener("click", clickHandler);
    return button;
}

canvas.addEventListener("mousedown", (e)=>{
    if(!isEmoji){
        isDrawing = true;
        lineContainer.push({initial: {x:e.offsetX, y:e.offsetY, ctx:context}, drag: [], currentThickness: currentThickness, currentColor: currentColor});
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
    else{
        canvas.dispatchEvent(new Event("emoji-placed"));
    }
})

canvas.addEventListener("mousemove", (e)=>{
    if (isDrawing) {
        lineContainer[lineContainer.length-1].drag.push({x:e.offsetX,y:e.offsetY, ctx:context});
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
    context.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < lineContainer.length; i++){
            context?.beginPath();
            context.strokeStyle = lineContainer[i].currentColor;
            context.lineWidth = lineContainer[i].currentThickness;
            context?.moveTo(lineContainer[i].initial.x,lineContainer[i].initial.y);
        for(let j = 0; j < lineContainer[i].drag.length; j++){
            context?.lineTo(lineContainer[i].drag[j].x,lineContainer[i].drag[j].y)
            context?.stroke();
            
        }
        context?.closePath();
    }
    for(let i = 0; i< emojiList.length;i++){
        if(emojiList[i].location){
            context.fillText(emojiList[i].name,emojiList[i].location.x,emojiList[i].location.y);
        }
    }
})

//Clear Button
const clearButton = CreateButton("Clear", () => {
    context?.clearRect(0, 0, canvas.width, canvas.height);
    lineContainer = [];
    undoStack = [];
});

app.append(clearButton);

//Undo Button
let undoStack: markerLine[] = []; //Emulate stack behavior with push and pop

const undoButton = CreateButton("Undo", () => {
    if (lineContainer.length != 0) {
        const temp: markerLine = lineContainer.pop();
        undoStack.push(temp);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

app.append(undoButton);

//Redo Button
const redoButton = CreateButton("Redo", () => {
    if (undoStack.length != 0) {
        const temp: markerLine = undoStack.pop();
        lineContainer.push(temp);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

app.append(redoButton);

//Marker Selector
let currentThickness: number = 1;
const thinButton = CreateButton("thin", () => {
    currentThickness = 1;
    isEmoji = false;
});
const thickButton = CreateButton("thick", () => {
    currentThickness = 3;
    isEmoji = false;
});

app.append(thinButton);
app.append(thickButton);

//Custom Pointer
interface cursorLocation{
    x:number;
    y:number;
}
let cursor: cursorLocation | null = null;
canvas.addEventListener("mouseenter",(e)=>{
    cursor = {x:e.offsetX, y:e.offsetY};
})

canvas.addEventListener("mouseleave",()=>{
    context?.clearRect(0,0,canvas.width,canvas.height);
    canvas.dispatchEvent(new Event("drawing-changed"));
    cursor = null;
})
canvas.addEventListener("mousemove",(e)=>{
    if(cursor && !isDrawing){
        context?.clearRect(0,0,canvas.width,canvas.height);
        canvas.dispatchEvent(new Event("drawing-changed"));
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        canvas.dispatchEvent(new Event("tool-moved"));
    }
})

canvas.addEventListener("tool-moved",()=>{
    if(isEmoji){
        emojiMarker();
    
    }
    else{
        cursorMarker(context);
    }
})
let cursorIcon: string;
function cursorMarker(ctx:CanvasRenderingContext2D){
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y,currentThickness, 0, 2*Math.PI);
    ctx.stroke();
}
function emojiMarker(){
    context.fillText(cursorIcon,cursor.x,cursor.y);
}

//Emojis
interface Emoji{
    location: Point | null;
    name :string;    
}
canvas.addEventListener("emoji-placed",()=>{
    for(let i = 0; i < emojiList.length; i++){
        if(emojiList[i].name == cursorIcon){
            if(!emojiList[i].location){
                emojiList[i].location = {x:cursor.x,y:cursor.y,ctx:context};

            }
            else{
                emojiList[i].location = {x:cursor?.x, y:cursor.y, ctx:context};
            }
        }
    }
})

const emojiList: Emoji[] = [];
const emojiNames:string[] = ["🐥","🦧","🇹🇼"]

for(let i = 0; i < emojiNames.length; i++){
    emojiList.push({location: null,name: emojiNames[i]});
}

let isEmoji: boolean = false;
const chickenButton = document.createElement("button");
chickenButton.innerHTML = "🐥";
chickenButton.addEventListener("click",()=>toggleEmoji(chickenButton));

const monkeButton = document.createElement("button");
monkeButton.innerHTML = "🦧";
monkeButton.addEventListener("click",()=>toggleEmoji(monkeButton));

const taiwanButton = document.createElement("button");
taiwanButton.innerHTML = "🇹🇼";
taiwanButton.addEventListener("click",()=>toggleEmoji(taiwanButton));

app.append(chickenButton);
app.append(monkeButton);
app.append(taiwanButton);   

function toggleEmoji(e:HTMLButtonElement){
    context.font = "30px serif";
    isEmoji = true;
    cursorIcon = e.innerHTML;
}

//Emoji Prompt


let customText:string | null;

const customButton = CreateButton("Custom Sticker", () => {
    customText = prompt("Custom Sticker");
    if (customText) {
        emojiList.push({ location: null, name: customText });
        isEmoji = true;
        cursorIcon = customText;
    }
});

app.append(customButton);   

//Export
const exportButton = document.createElement("button");
exportButton.innerHTML = "Export";

const exportCanvas = document.createElement("canvas");
const exportContext:CanvasRenderingContext2D = exportCanvas.getContext("2d");
exportCanvas.style.cursor = "none";

exportCanvas.width = exportWidth;
exportCanvas.height = exportWidth; 
exportContext.scale(exportRatioWidth,exportRatioHeight);

exportButton.addEventListener("click",()=>{
    exportContext.clearRect(0,0,exportCanvas.width,exportCanvas.height);
    for(let i = 0; i < lineContainer.length; i++){
            exportContext?.beginPath();
            exportContext.strokeStyle = lineContainer[i].currentColor;
            exportContext.lineWidth = lineContainer[i].currentThickness;
            exportContext?.moveTo(lineContainer[i].initial.x,lineContainer[i].initial.y);
        for(let j = 0; j < lineContainer[i].drag.length; j++){
            exportContext?.lineTo(lineContainer[i].drag[j].x,lineContainer[i].drag[j].y)
            exportContext?.stroke();
            
        }
        exportContext?.closePath();
    }
    for(let i = 0; i< emojiList.length;i++){
        if(emojiList[i].location){
            exportContext.fillText(emojiList[i].name,emojiList[i].location.x,emojiList[i].location.y);
        }
    }
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "sketchpad.png";
    anchor.click();

})


app.append(exportButton);

//Color
const redButton = CreateButton("red", () => currentColor = "red");
const blackButton = CreateButton("black", () => currentColor = "black");

function colorControl(e){
    currentColor = e.innerHTML;
}

app.append(blackButton);
app.append(redButton);