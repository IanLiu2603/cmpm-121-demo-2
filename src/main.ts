import "./style.css";

const APP_NAME = "sdasdasd";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
//app.innerHTML = APP_NAME;

//Title
const title = document.createElement("h1");
title.innerHTML = "TSPaint";
app.append(title);

//Canvas
const canvas = document.createElement("canvas");
const context:CanvasRenderingContext2D = canvas.getContext("2d");
canvas.style.cursor = "none";

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
    if(!isEmoji){
        isDrawing = true;
        let line: markerLine = {initial: insert, drag: [], thickness: thickness}
        lineContainer.push(line);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
    else{
        canvas.dispatchEvent(new Event("emoji-placed"));
    }
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
    context.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < lineContainer.length; i++){
            context?.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = lineContainer[i].thickness;
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
    isEmoji = false;
})
thickButton.addEventListener("click", ()=>{
    thickness = 3;
    isEmoji = false;
})

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
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y,thickness, 0, 2*Math.PI);
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
                let toPush:Point = {x:cursor.x,y:cursor.y,ctx:context};
                emojiList[i].location = toPush;

            }
            else{
                emojiList[i].location = {x:cursor?.x, y:cursor.y, ctx:context};
            }
        }
    }
})

let emojiList: Emoji[] = [];
let emojiNames:string[] = ["🐥","🦧","🇹🇼"]

for(let i = 0; i < emojiNames.length; i++){
    emojiList.push({location: null,name: emojiNames[i]});
}

let isEmoji: boolean = false;
const chickenButton = document.createElement("button");
const monkeButton = document.createElement("button");
const taiwanButton = document.createElement("button")

chickenButton.innerHTML = "🐥";
monkeButton.innerHTML = "🦧";
taiwanButton.innerHTML = "🇹🇼";

app.append(chickenButton);
app.append(monkeButton);
app.append(taiwanButton);   

function toggleEmoji(e:HTMLButtonElement){
    isEmoji = true;
    cursorIcon = e.innerHTML;
}

chickenButton.addEventListener("click",()=>toggleEmoji(chickenButton));
monkeButton.addEventListener("click",()=>toggleEmoji(monkeButton));
taiwanButton.addEventListener("click",()=>toggleEmoji(taiwanButton));

//Emoji Prompt
const customButton = document.createElement("button");
customButton.innerHTML = "Custom Sticker";

let customText:string | null;

customButton.addEventListener("click",()=>{
    customText = prompt("Custom Sticker");
    if(customText){
        emojiList.push({location:null , name: customText});
        isEmoji = true;
        cursorIcon = customText;
    }
})

app.append(customButton);   

//Export
const exportButton = document.createElement("button");
exportButton.innerHTML = "Export";

const exportCanvas = document.createElement("canvas");
const exportContext:CanvasRenderingContext2D = exportCanvas.getContext("2d");
exportCanvas.style.cursor = "none";

exportCanvas.width = 1024;
exportCanvas.height = 1024; 
exportContext.scale(4,4);

exportButton.addEventListener("click",()=>{
    console.log("exporting");
    exportContext.clearRect(0,0,exportCanvas.width,exportCanvas.height);
    for(let i = 0; i < lineContainer.length; i++){
            exportContext?.beginPath();
            exportContext.strokeStyle = "black";
            exportContext.lineWidth = lineContainer[i].thickness;
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
