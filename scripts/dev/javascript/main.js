"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./Grid");
var grid;
window.onload = function () {
    var htmlGrid = document.getElementById("grid");
    if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
        htmlGrid.width = window.innerWidth - 3;
        htmlGrid.height = window.innerHeight - 3;
        console.log('width', window.innerWidth, 'height', window.innerHeight);
        grid = new Grid_1.Grid(htmlGrid, 32);
    }
};
