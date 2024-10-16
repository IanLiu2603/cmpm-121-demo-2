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

canvas.width = 256;
canvas.height = 256; 

app.append(canvas);
