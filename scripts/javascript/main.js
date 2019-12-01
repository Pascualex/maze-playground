"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grid_1 = require("./grid");
var grid;
window.onload = function () {
    var htmlGrid = document.getElementById("grid");
    if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
        grid = new grid_1.Grid(htmlGrid);
    }
};
