(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Pathfinder_1 = require("./Pathfinder");
var TileState_1 = require("./TileState");
var BFSPathfinder = /** @class */ (function (_super) {
    __extends(BFSPathfinder, _super);
    function BFSPathfinder(gridModel) {
        var _this = _super.call(this, gridModel) || this;
        _this.x = 0;
        return _this;
    }
    BFSPathfinder.prototype.reset = function () {
    };
    BFSPathfinder.prototype.pause = function () {
    };
    BFSPathfinder.prototype.step = function () {
        this.gridModel.setStateAt(this.x, 0, TileState_1.TileState.Visited);
        if (this.onstep != null) {
            this.onstep(this.x, 0);
        }
        this.x++;
        if (this.x >= this.gridModel.getWidth()) {
            this.running = false;
        }
    };
    return BFSPathfinder;
}(Pathfinder_1.Pathfinder));
exports.BFSPathfinder = BFSPathfinder;

},{"./Pathfinder":5,"./TileState":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var BFSPathfinder_1 = require("./BFSPathfinder");
var TileType_1 = require("./TileType");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas, tileSize) {
        var gridHeight = Math.floor((htmlCanvas.width - 1) / (tileSize + 1));
        var gridWidth = Math.floor((htmlCanvas.height - 1) / (tileSize + 1));
        this.gridModel = new GridModel_1.GridModel(gridHeight, gridWidth);
        this.gridView = new GridView_1.GridView(htmlCanvas, tileSize, this.gridModel);
        this.pathfinder = new BFSPathfinder_1.BFSPathfinder(this.gridModel);
        this.currentTileType = TileType_1.TileType.Floor;
        this.setupEvents();
        this.gridView.draw();
        this.pathfinder.run();
    }
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.ontiletypeselect = function (x, y) {
            _this.handleOnTileTypeSelectEvent(x, y);
        };
        this.gridView.ontileclick = function (x, y) {
            _this.handleOnTileClickEvent(x, y);
        };
        this.pathfinder.onstep = function (x, y) {
            _this.handleOnStep(x, y);
        };
    };
    Grid.prototype.handleOnTileTypeSelectEvent = function (x, y) {
        var newTileType = this.gridModel.getTileAt(x, y);
        if (newTileType != null) {
            if (newTileType == TileType_1.TileType.Wall) {
                this.currentTileType = TileType_1.TileType.Floor;
            }
            else if (newTileType == TileType_1.TileType.Entry) {
                this.currentTileType = TileType_1.TileType.Entry;
            }
            else if (newTileType == TileType_1.TileType.Exit) {
                this.currentTileType = TileType_1.TileType.Exit;
            }
            else {
                this.currentTileType = TileType_1.TileType.Wall;
            }
        }
    };
    Grid.prototype.handleOnTileClickEvent = function (x, y) {
        var tileType = this.gridModel.getTileAt(x, y);
        if (tileType == null)
            return;
        if (tileType == this.currentTileType)
            return;
        if (tileType == TileType_1.TileType.Entry || tileType == TileType_1.TileType.Exit) {
            this.gridModel.setTileAt(x, y, this.currentTileType);
        }
        else if (this.currentTileType == TileType_1.TileType.Entry) {
            var oldEntryTileX = this.gridModel.getExtryTileX();
            var oldEntryTileY = this.gridModel.getExtryTileY();
            this.gridModel.setTileAt(x, y, TileType_1.TileType.Entry);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldEntryTileX, oldEntryTileY);
        }
        else if (this.currentTileType == TileType_1.TileType.Exit) {
            var oldExitTileX = this.gridModel.getExitTileX();
            var oldExitTileY = this.gridModel.getExitTileY();
            this.gridModel.setTileAt(x, y, TileType_1.TileType.Exit);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);
        }
        else {
            this.gridModel.setTileAt(x, y, this.currentTileType);
            this.gridView.drawTileAndNeighbours(x, y);
        }
    };
    Grid.prototype.handleOnStep = function (x, y) {
        this.gridView.drawTile(x, y);
    };
    return Grid;
}());
exports.Grid = Grid;

},{"./BFSPathfinder":1,"./GridModel":3,"./GridView":4,"./TileType":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var GridModel = /** @class */ (function () {
    function GridModel(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(height);
        this.states = new Array(height);
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = new Array(this.width);
            this.states[i] = new Array(this.width);
        }
        this.clear();
    }
    GridModel.prototype.clear = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.tiles[i][j] = TileType_1.TileType.Floor;
                this.states[i][j] = TileState_1.TileState.Undiscovered;
            }
        }
        if (this.width < 5)
            return;
        if (this.height < 1)
            return;
        var xCenter = Math.floor((this.width - 1) / 2);
        var yCenter = Math.floor((this.height - 1) / 2);
        this.entryTileX = xCenter - 2;
        this.entryTileY = yCenter;
        this.entryPreviousTile = TileType_1.TileType.Floor;
        this.exitTileX = xCenter + 3 - (this.width % 2);
        this.exitTileY = yCenter;
        this.exitPreviousTile = TileType_1.TileType.Floor;
        this.tiles[this.entryTileY][this.entryTileX] = TileType_1.TileType.Entry;
        this.tiles[this.exitTileY][this.exitTileX] = TileType_1.TileType.Exit;
    };
    GridModel.prototype.getTileAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return null;
        if (y < 0 || y >= this.height)
            return null;
        return this.tiles[y][x];
    };
    GridModel.prototype.getStateAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return null;
        if (y < 0 || y >= this.height)
            return null;
        return this.states[y][x];
    };
    GridModel.prototype.setTileAt = function (x, y, tileType) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        var currentTileType = this.getTileAt(x, y);
        if (currentTileType == TileType_1.TileType.Entry)
            this.entryPreviousTile = tileType;
        else if (currentTileType == TileType_1.TileType.Exit)
            this.exitPreviousTile = tileType;
        else if (tileType == TileType_1.TileType.Entry)
            this.setEntryTileAt(x, y);
        else if (tileType == TileType_1.TileType.Exit)
            this.setExitTileAt(x, y);
        else
            this.tiles[y][x] = tileType;
    };
    GridModel.prototype.setStateAt = function (x, y, tileState) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.states[y][x] = tileState;
    };
    GridModel.prototype.setEntryTileAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.tiles[this.entryTileY][this.entryTileX] = this.entryPreviousTile;
        this.entryTileX = x;
        this.entryTileY = y;
        this.entryPreviousTile = this.tiles[y][x];
        this.tiles[y][x] = TileType_1.TileType.Entry;
    };
    GridModel.prototype.setExitTileAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.tiles[this.exitTileY][this.exitTileX] = this.exitPreviousTile;
        this.exitTileX = x;
        this.exitTileY = y;
        this.exitPreviousTile = this.tiles[y][x];
        this.tiles[y][x] = TileType_1.TileType.Exit;
    };
    GridModel.prototype.getWidth = function () {
        return this.width;
    };
    GridModel.prototype.getHeight = function () {
        return this.height;
    };
    GridModel.prototype.getExtryTileX = function () {
        return this.entryTileX;
    };
    GridModel.prototype.getExtryTileY = function () {
        return this.entryTileY;
    };
    GridModel.prototype.getExitTileX = function () {
        return this.exitTileX;
    };
    GridModel.prototype.getExitTileY = function () {
        return this.exitTileY;
    };
    return GridModel;
}());
exports.GridModel = GridModel;

},{"./TileState":6,"./TileType":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, tileSize, gridModel) {
        this.canvas = htmlCanvas.getContext('2d');
        this.tileSize = tileSize;
        this.width = htmlCanvas.width;
        this.height = htmlCanvas.height;
        this.offsetX = Math.floor(((this.width - 1) % (tileSize + 1)) / 2);
        this.offsetY = Math.floor(((this.height - 1) % (tileSize + 1)) / 2);
        this.gridWidth = Math.floor((this.width - 1) / (tileSize + 1));
        this.gridHeight = Math.floor((this.height - 1) / (tileSize + 1));
        this.gridModel = gridModel;
        this.mousePressed = false;
        this.mousePressedLastX = 0;
        this.mousePressedLastY = 0;
        this.ontiletypeselect = null;
        this.ontileclick = null;
        this.setupEvents(htmlCanvas);
    }
    GridView.prototype.setupEvents = function (htmlCanvas) {
        var _this = this;
        htmlCanvas.onmousedown = function (event) {
            _this.handleOnMouseDownEvent(event);
        };
        htmlCanvas.onmousemove = function (event) {
            _this.handleOnMouseMoveEvent(event);
        };
        htmlCanvas.onmouseup = function (event) {
            _this.handleOnMouseUpEvent(event);
        };
        htmlCanvas.onmouseleave = function (event) {
            _this.handleOnMouseLeaveEvent(event);
        };
    };
    GridView.prototype.draw = function () {
        if (this.canvas == null)
            return;
        for (var i = 0; i < this.gridModel.getHeight(); i++) {
            for (var j = 0; j < this.gridModel.getWidth(); j++) {
                this.drawTile(j, i);
            }
        }
    };
    GridView.prototype.drawTileAndNeighbours = function (x, y) {
        this.drawTile(x, y);
        this.drawTile(x, y - 1);
        this.drawTile(x + 1, y);
        this.drawTile(x, y + 1);
        this.drawTile(x - 1, y);
    };
    GridView.prototype.drawTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        var tileType = this.gridModel.getTileAt(x, y);
        var tileState = this.gridModel.getStateAt(x, y);
        if (tileType == TileType_1.TileType.Wall) {
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fillRect(xStart, yStart, xSize, ySize);
            this.canvas.fillStyle = '#42eb3f';
            this.printWallDetail(x, y);
        }
        else if (tileType == TileType_1.TileType.Floor) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            if (tileState == TileState_1.TileState.Visited) {
                this.canvas.fillStyle = '#a85e32';
                this.canvas.fillRect(xStart + 12, yStart + 12, xSize - 24, ySize - 24);
            }
        }
        else if (tileType == TileType_1.TileType.Entry) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 14, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 10, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#30b348';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 4, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
        }
        else if (tileType == TileType_1.TileType.Exit) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 14, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 10, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#f71b39';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xStart + 17, yStart + 17, 4, 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
        }
        else {
            this.canvas.fillStyle = '#f01fff';
            this.canvas.fillRect(xStart, yStart, xSize, ySize);
        }
    };
    GridView.prototype.clearTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        if (this.gridModel.getTileAt(x, y - 1) == TileType_1.TileType.Wall) {
            yStart++;
            ySize--;
        }
        if (this.gridModel.getTileAt(x + 1, y) == TileType_1.TileType.Wall) {
            xSize--;
        }
        if (this.gridModel.getTileAt(x, y + 1) == TileType_1.TileType.Wall) {
            ySize--;
        }
        if (this.gridModel.getTileAt(x - 1, y) == TileType_1.TileType.Wall) {
            xStart++;
            xSize--;
        }
        this.canvas.fillStyle = '#6da6b3';
        this.canvas.fillRect(xStart, yStart, xSize, ySize);
    };
    GridView.prototype.printWallDetail = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        var top = (this.gridModel.getTileAt(x, y - 1) == TileType_1.TileType.Wall);
        var right = (this.gridModel.getTileAt(x + 1, y) == TileType_1.TileType.Wall);
        var bottom = (this.gridModel.getTileAt(x, y + 1) == TileType_1.TileType.Wall);
        var left = (this.gridModel.getTileAt(x - 1, y) == TileType_1.TileType.Wall);
        this.canvas.fillStyle = '#3af0c8';
        if (right && left && !top && !bottom) {
            this.canvas.fillRect(xStart, yStart + 15, xSize, ySize - 30);
        }
        else if (top && bottom && !right && !left) {
            this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize);
        }
        else {
            this.canvas.fillRect(xStart + 13, yStart + 13, xSize - 26, ySize - 26);
            if (top)
                this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize - 23);
            if (right)
                this.canvas.fillRect(xStart + 23, yStart + 15, xSize - 23, ySize - 30);
            if (bottom)
                this.canvas.fillRect(xStart + 15, yStart + 23, xSize - 30, ySize - 23);
            if (left)
                this.canvas.fillRect(xStart, yStart + 15, xSize - 23, ySize - 30);
        }
    };
    GridView.prototype.tileToCoordinateX = function (x) {
        return this.offsetX + (x * (this.tileSize + 1));
    };
    GridView.prototype.tileToCoordinateY = function (y) {
        return this.offsetY + (y * (this.tileSize + 1));
    };
    GridView.prototype.coordinateXToTile = function (coordinateX) {
        return Math.floor((coordinateX - (this.offsetX + 1)) / (this.tileSize + 1));
    };
    GridView.prototype.coordinateYToTile = function (coordinateY) {
        return Math.floor((coordinateY - (this.offsetY + 1)) / (this.tileSize + 1));
    };
    GridView.prototype.raytraceTiles = function (startX, startY, endX, endY) {
        var distanceX = Math.abs(endX - startX);
        var distanceY = Math.abs(endY - startY);
        var xIncrement = (endX > startX) ? 1 : -1;
        var yIncrement = (endY > startY) ? 1 : -1;
        var tileCount = distanceX + distanceY + 1;
        var error = distanceX - distanceY;
        var x = startX;
        var y = startY;
        var crossedTiles = new Array(tileCount);
        for (var i = 0; i < tileCount; i++) {
            crossedTiles[i] = { x: x, y: y };
            if (error > 0) {
                x += xIncrement;
                error -= distanceY * 2;
            }
            else {
                y += yIncrement;
                error += distanceX * 2;
            }
        }
        return crossedTiles;
    };
    GridView.prototype.handleOnMouseDownEvent = function (event) {
        this.mousePressed = true;
        this.mousePressedLastX = event.offsetX;
        this.mousePressedLastY = event.offsetY;
        this.triggerOnTileTypeSelectEvent(event);
        this.triggerOnTileClickEvent(event);
    };
    GridView.prototype.handleOnMouseMoveEvent = function (event) {
        var x = this.coordinateXToTile(event.offsetX);
        var y = this.coordinateYToTile(event.offsetY);
        var tileType = this.gridModel.getTileAt(x, y);
        if (tileType == TileType_1.TileType.Entry || tileType == TileType_1.TileType.Exit) {
            document.body.style.cursor = 'pointer';
        }
        else {
            document.body.style.cursor = 'default';
        }
        if (this.mousePressed) {
            var startX = this.coordinateXToTile(this.mousePressedLastX);
            var startY = this.coordinateYToTile(this.mousePressedLastY);
            var crossedTiles = this.raytraceTiles(startX, startY, x, y);
            this.triggerOnTileClickEvents(crossedTiles);
            this.mousePressedLastX = event.offsetX;
            this.mousePressedLastY = event.offsetY;
            this.triggerOnTileClickEvent(event);
        }
    };
    GridView.prototype.handleOnMouseUpEvent = function (event) {
        this.mousePressed = false;
    };
    GridView.prototype.handleOnMouseLeaveEvent = function (event) {
        this.mousePressed = false;
    };
    GridView.prototype.triggerOnTileTypeSelectEvent = function (event) {
        if (this.ontiletypeselect == null)
            return;
        var x = this.coordinateXToTile(event.offsetX);
        var y = this.coordinateYToTile(event.offsetY);
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        this.ontiletypeselect(x, y);
    };
    GridView.prototype.triggerOnTileClickEvent = function (event) {
        if (this.ontileclick == null)
            return;
        var x = this.coordinateXToTile(event.offsetX);
        var y = this.coordinateYToTile(event.offsetY);
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        this.ontileclick(x, y);
    };
    GridView.prototype.triggerOnTileClickEvents = function (tiles) {
        if (this.ontileclick == null)
            return;
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].x < 0 || tiles[i].x >= this.gridWidth)
                continue;
            if (tiles[i].y < 0 || tiles[i].y >= this.gridHeight)
                continue;
            this.ontileclick(tiles[i].x, tiles[i].y);
        }
    };
    return GridView;
}());
exports.GridView = GridView;

},{"./TileState":6,"./TileType":7}],5:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pathfinder = /** @class */ (function () {
    function Pathfinder(gridModel) {
        this.gridModel = gridModel;
        this.running = false;
        this.stepDelay = 500;
        this.onstep = null;
    }
    Pathfinder.prototype.run = function () {
        if (!this.running) {
            this.running = true;
            this.stepLoop();
        }
    };
    Pathfinder.prototype.pause = function () {
        this.running = false;
    };
    Pathfinder.prototype.stepLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.running) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delay(this.stepDelay)];
                    case 1:
                        _a.sent();
                        this.step();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Pathfinder.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Pathfinder;
}());
exports.Pathfinder = Pathfinder;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["Undiscovered"] = 0] = "Undiscovered";
    TileState[TileState["Discovered"] = 1] = "Discovered";
    TileState[TileState["Visited"] = 2] = "Visited";
    TileState[TileState["Path"] = 3] = "Path";
})(TileState = exports.TileState || (exports.TileState = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType;
(function (TileType) {
    TileType[TileType["Floor"] = 0] = "Floor";
    TileType[TileType["Wall"] = 1] = "Wall";
    TileType[TileType["Entry"] = 2] = "Entry";
    TileType[TileType["Exit"] = 3] = "Exit";
})(TileType = exports.TileType || (exports.TileType = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./Grid");
var grid;
var htmlGrid;
var resetButton;
var resizeMessage;
window.onload = function () {
    setupHtmlElements();
    setupTouchEvents();
    createGrid();
};
window.onresize = function () {
    openResizeMessage();
};
function createGrid() {
    if (htmlGrid instanceof HTMLCanvasElement) {
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight;
        grid = new Grid_1.Grid(htmlGrid, 32);
    }
    else {
        grid = null;
    }
}
function openResizeMessage() {
    if (resizeMessage != null) {
        resizeMessage.style.display = 'block';
    }
}
function closeResizeMessage(reset) {
    if (reset)
        createGrid();
    if (resizeMessage != null) {
        resizeMessage.style.display = 'none';
    }
}
function setupHtmlElements() {
    htmlGrid = document.getElementById('grid');
    resetButton = document.getElementById('reset-button');
    resizeMessage = document.getElementById('resize-message');
    var resizeMessageYes = document.getElementById('resize-message-yes');
    var resizeMessageNo = document.getElementById('resize-message-no');
    if (resetButton instanceof HTMLAnchorElement) {
        resetButton.onclick = function () { return createGrid(); };
    }
    if (resizeMessageYes instanceof HTMLAnchorElement) {
        resizeMessageYes.onclick = function () { return closeResizeMessage(true); };
    }
    if (resizeMessageNo instanceof HTMLAnchorElement) {
        resizeMessageNo.onclick = function () { return closeResizeMessage(false); };
    }
}
function setupTouchEvents() {
    if (!(htmlGrid instanceof HTMLCanvasElement))
        return;
    htmlGrid.addEventListener('touchstart', function (e) {
        if (!(htmlGrid instanceof HTMLCanvasElement))
            return;
        var mousePos = getTouchPos(htmlGrid, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        htmlGrid.dispatchEvent(mouseEvent);
    }, false);
    htmlGrid.addEventListener('touchend', function (e) {
        if (!(htmlGrid instanceof HTMLCanvasElement))
            return;
        var mouseEvent = new MouseEvent('mouseup', {});
        htmlGrid.dispatchEvent(mouseEvent);
    }, false);
    htmlGrid.addEventListener('touchmove', function (e) {
        if (!(htmlGrid instanceof HTMLCanvasElement))
            return;
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        htmlGrid.dispatchEvent(mouseEvent);
    }, false);
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
}

},{"./Grid":2}]},{},[8]);
