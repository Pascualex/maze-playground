(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = /** @class */ (function () {
    function Grid(htmlGrid) {
        this.canvas = htmlGrid.getContext('2d');
        this.width = htmlGrid.width;
        this.height = htmlGrid.height;
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(0, 0, this.width, this.height);
    }
    return Grid;
}());
exports.Grid = Grid;

},{}],2:[function(require,module,exports){
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

},{"./grid":1}]},{},[2]);
