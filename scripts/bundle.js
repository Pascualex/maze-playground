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
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var Queue_1 = require("./Queue");
var Pair_1 = require("./Pair");
var Direction_1 = require("./Direction");
var BFSPathfinder = /** @class */ (function (_super) {
    __extends(BFSPathfinder, _super);
    function BFSPathfinder(gridModel) {
        var _this = _super.call(this, gridModel) || this;
        _this.discoveredTiles = new Queue_1.Queue();
        _this.reset();
        return _this;
    }
    BFSPathfinder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.discoveredTiles.clear();
    };
    BFSPathfinder.prototype.initialization = function () {
        var x = this.gridModel.getEntryTileX();
        var y = this.gridModel.getEntryTileY();
        this.discoveredTiles.enqueue(new Pair_1.Pair(x, y));
    };
    BFSPathfinder.prototype.step = function () {
        if (this.discoveredTiles.isEmpty()) {
            this.running = false;
            return;
        }
        var current = this.discoveredTiles.dequeue();
        if (this.onstep != null)
            this.onstep(current.x, current.y, TileState_1.TileState.Visited, null);
        for (var _i = 0, _a = Direction_1.getAllDirections(); _i < _a.length; _i++) {
            var direction = _a[_i];
            var d = Direction_1.getDirectionValue(direction);
            if (this.gridModel.getStateAt(current.x + d.x, current.y + d.y) == TileState_1.TileState.Undiscovered) {
                if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType_1.TileType.Exit) {
                    var invertedDirection = Direction_1.invertDirection(direction);
                    this.exitFound = true;
                    this.pathX = current.x + d.x;
                    this.pathY = current.y + d.y;
                    if (this.onstep != null) {
                        this.onstep(current.x + d.x, current.y + d.y, TileState_1.TileState.Discovered, invertedDirection);
                    }
                    return;
                }
                if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType_1.TileType.Floor) {
                    var invertedDirection = Direction_1.invertDirection(direction);
                    this.discoveredTiles.enqueue(new Pair_1.Pair(current.x + d.x, current.y + d.y));
                    if (this.onstep != null) {
                        this.onstep(current.x + d.x, current.y + d.y, TileState_1.TileState.Discovered, invertedDirection);
                    }
                }
            }
        }
    };
    return BFSPathfinder;
}(Pathfinder_1.Pathfinder));
exports.BFSPathfinder = BFSPathfinder;

},{"./Direction":3,"./Pair":9,"./Pathfinder":10,"./Queue":11,"./TileState":12,"./TileType":13}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants;
(function (Constants) {
    Constants[Constants["TileSize"] = 32] = "TileSize";
})(Constants = exports.Constants || (exports.Constants = {}));

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pair_1 = require("./Pair");
var Direction;
(function (Direction) {
    Direction[Direction["None"] = 0] = "None";
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Right"] = 2] = "Right";
    Direction[Direction["Down"] = 3] = "Down";
    Direction[Direction["Left"] = 4] = "Left";
})(Direction = exports.Direction || (exports.Direction = {}));
function getAllDirections() {
    return [
        Direction.Right,
        Direction.Left,
        Direction.Up,
        Direction.Down
    ];
}
exports.getAllDirections = getAllDirections;
function getRandomizedDirections() {
    return shuffle([
        Direction.Up,
        Direction.Right,
        Direction.Down,
        Direction.Left
    ]);
}
exports.getRandomizedDirections = getRandomizedDirections;
function getDirectionValue(direction) {
    if (direction == Direction.Up)
        return new Pair_1.Pair(0, -1);
    else if (direction == Direction.Right)
        return new Pair_1.Pair(1, 0);
    else if (direction == Direction.Down)
        return new Pair_1.Pair(0, 1);
    else if (direction == Direction.Left)
        return new Pair_1.Pair(-1, 0);
    else
        return new Pair_1.Pair(0, 0);
}
exports.getDirectionValue = getDirectionValue;
function invertDirection(direction) {
    if (direction == Direction.Up)
        return Direction.Down;
    else if (direction == Direction.Right)
        return Direction.Left;
    else if (direction == Direction.Down)
        return Direction.Up;
    else if (direction == Direction.Left)
        return Direction.Right;
    else
        return Direction.None;
}
exports.invertDirection = invertDirection;
function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}

},{"./Pair":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var BFSPathfinder_1 = require("./BFSPathfinder");
var LevelBuilderX_1 = require("./LevelBuilderX");
var TileType_1 = require("./TileType");
var Constants_1 = require("./Constants");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas, scale) {
        this.htmlCanvas = htmlCanvas;
        var realTileSize = (Constants_1.Constants.TileSize * scale) + 1;
        var gridWidth = Math.floor((htmlCanvas.width - 1) / realTileSize);
        var gridHeight = Math.floor((htmlCanvas.height - 1) / realTileSize);
        this.gridModel = new GridModel_1.GridModel(gridWidth, gridHeight);
        this.gridView = new GridView_1.GridView(htmlCanvas, scale, this.gridModel);
        this.pathfinder = new BFSPathfinder_1.BFSPathfinder(this.gridModel);
        this.levelBuilder = new LevelBuilderX_1.LevelBuilderX(this.gridModel);
        this.currentTileType = TileType_1.TileType.Floor;
        this.setupEvents();
        this.gridView.draw();
    }
    Grid.prototype.reset = function (scale) {
        var realTileSize = (Constants_1.Constants.TileSize * scale) + 1;
        var gridWidth = Math.floor((this.htmlCanvas.width - 1) / realTileSize);
        var gridHeight = Math.floor((this.htmlCanvas.height - 1) / realTileSize);
        this.gridModel.reset(gridWidth, gridHeight);
        this.gridView.reset(scale);
        this.pathfinder.reset();
        this.currentTileType = TileType_1.TileType.Floor;
        this.gridView.draw();
    };
    Grid.prototype.runPathfinder = function () {
        if (!this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (!this.levelBuilder.isUnactivated()) {
            this.levelBuilder.reset();
        }
        this.pathfinder.run();
    };
    Grid.prototype.runLevelBuilder = function () {
        if (!this.levelBuilder.isUnactivated()) {
            this.levelBuilder.reset();
        }
        if (!this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.pathfinder.reset();
        }
        this.gridModel.resetTiles();
        this.gridView.draw();
        this.levelBuilder.run();
    };
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.ontiletypeselect = function (x, y) {
            _this.handleOnTileTypeSelectEvent(x, y);
        };
        this.gridView.ontileclick = function (x, y) {
            _this.handleOnTileClickEvent(x, y);
        };
        this.pathfinder.onstep = function (x, y, tileState, direction) {
            _this.handleOnPathfinderStep(x, y, tileState, direction);
        };
        this.pathfinder.onpathstep = function (x, y, tileState, direction) {
            _this.handleOnPathfinderPathStep(x, y, tileState, direction);
        };
        this.levelBuilder.onstep = function (x, y, tileType) {
            _this.handleOnLevelBuilderStep(x, y, tileType);
        };
    };
    Grid.prototype.handleOnTileTypeSelectEvent = function (x, y) {
        var newTileType = this.gridModel.getTypeAt(x, y);
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
        if (!this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (!this.levelBuilder.isUnactivated()) {
            this.levelBuilder.reset();
        }
    };
    Grid.prototype.handleOnTileClickEvent = function (x, y) {
        var tileType = this.gridModel.getTypeAt(x, y);
        if (tileType == null)
            return;
        if (tileType == this.currentTileType)
            return;
        if (tileType == TileType_1.TileType.Entry || tileType == TileType_1.TileType.Exit) {
            this.gridModel.setTypeAt(x, y, this.currentTileType);
        }
        else if (this.currentTileType == TileType_1.TileType.Entry) {
            var oldEntryTileX = this.gridModel.getEntryTileX();
            var oldEntryTileY = this.gridModel.getEntryTileY();
            this.gridModel.setTypeAt(x, y, TileType_1.TileType.Entry);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldEntryTileX, oldEntryTileY);
        }
        else if (this.currentTileType == TileType_1.TileType.Exit) {
            var oldExitTileX = this.gridModel.getExitTileX();
            var oldExitTileY = this.gridModel.getExitTileY();
            this.gridModel.setTypeAt(x, y, TileType_1.TileType.Exit);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);
        }
        else {
            this.gridModel.setTypeAt(x, y, this.currentTileType);
            this.gridView.drawTileAndNeighbours(x, y);
        }
        if (!this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (!this.levelBuilder.isUnactivated()) {
            this.levelBuilder.reset();
        }
    };
    Grid.prototype.handleOnPathfinderStep = function (x, y, tileState, direction) {
        this.gridModel.setStateAt(x, y, tileState);
        if (direction != null)
            this.gridModel.setDirectionAt(x, y, direction);
        this.gridView.drawTile(x, y);
    };
    Grid.prototype.handleOnPathfinderPathStep = function (x, y, tileState, direction) {
        this.gridModel.setStateAt(x, y, tileState);
        if (direction != null)
            this.gridModel.setDirectionAt(x, y, direction);
        this.gridView.drawTileAndNeighbours(x, y);
    };
    Grid.prototype.handleOnLevelBuilderStep = function (x, y, tileType) {
        this.gridModel.setTypeAt(x, y, tileType);
        this.gridView.drawTileAndNeighbours(x, y);
    };
    return Grid;
}());
exports.Grid = Grid;

},{"./BFSPathfinder":1,"./Constants":2,"./GridModel":5,"./GridView":6,"./LevelBuilderX":8,"./TileType":13}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var Direction_1 = require("./Direction");
var GridModel = /** @class */ (function () {
    function GridModel(width, height) {
        this.reset(width, height);
    }
    GridModel.prototype.reset = function (width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(height);
        this.states = new Array(height);
        this.directions = new Array(height);
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = new Array(this.width);
            this.states[i] = new Array(this.width);
            this.directions[i] = new Array(this.width);
        }
        this.resetTiles();
        this.resetStates();
        this.resetDirections();
    };
    GridModel.prototype.resetTiles = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.tiles[i][j] = TileType_1.TileType.Floor;
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
    GridModel.prototype.resetStates = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.states[i][j] = TileState_1.TileState.Undiscovered;
            }
        }
    };
    GridModel.prototype.resetDirections = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.directions[i][j] = Direction_1.Direction.None;
            }
        }
    };
    GridModel.prototype.getTypeAt = function (x, y) {
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
    GridModel.prototype.getDirectionAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return null;
        if (y < 0 || y >= this.height)
            return null;
        return this.directions[y][x];
    };
    GridModel.prototype.getWidth = function () {
        return this.width;
    };
    GridModel.prototype.getHeight = function () {
        return this.height;
    };
    GridModel.prototype.getEntryTileX = function () {
        return this.entryTileX;
    };
    GridModel.prototype.getEntryTileY = function () {
        return this.entryTileY;
    };
    GridModel.prototype.getExitTileX = function () {
        return this.exitTileX;
    };
    GridModel.prototype.getExitTileY = function () {
        return this.exitTileY;
    };
    GridModel.prototype.setTypeAt = function (x, y, tileType) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        var currentTileType = this.getTypeAt(x, y);
        if (currentTileType == TileType_1.TileType.Entry) {
            if (tileType != TileType_1.TileType.Exit)
                this.entryPreviousTile = tileType;
        }
        else if (currentTileType == TileType_1.TileType.Exit) {
            if (tileType != TileType_1.TileType.Entry)
                this.exitPreviousTile = tileType;
        }
        else if (tileType == TileType_1.TileType.Entry) {
            this.setEntryTileAt(x, y);
        }
        else if (tileType == TileType_1.TileType.Exit) {
            this.setExitTileAt(x, y);
        }
        else {
            this.tiles[y][x] = tileType;
        }
    };
    GridModel.prototype.setStateAt = function (x, y, tileState) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.states[y][x] = tileState;
    };
    GridModel.prototype.setDirectionAt = function (x, y, direction) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.directions[y][x] = direction;
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
    return GridModel;
}());
exports.GridModel = GridModel;

},{"./Direction":3,"./TileState":12,"./TileType":13}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var Pair_1 = require("./Pair");
var Direction_1 = require("./Direction");
var Constants_1 = require("./Constants");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, scale, gridModel) {
        this.htmlCanvas = htmlCanvas;
        this.canvas = htmlCanvas.getContext('2d');
        this.gridModel = gridModel;
        this.reset(scale);
        this.ontiletypeselect = null;
        this.ontileclick = null;
        this.setupEvents(htmlCanvas);
    }
    GridView.prototype.reset = function (scale) {
        this.scale = scale;
        this.width = this.htmlCanvas.width;
        this.height = this.htmlCanvas.height;
        var realTileSize = (Constants_1.Constants.TileSize * scale) + 1;
        this.offsetX = Math.floor(((this.width - 1) % realTileSize) / 2);
        this.offsetY = Math.floor(((this.height - 1) % realTileSize) / 2);
        this.gridWidth = Math.floor((this.width - 1) / realTileSize);
        this.gridHeight = Math.floor((this.height - 1) / realTileSize);
        this.mousePressed = false;
        this.mousePressedLastX = 0;
        this.mousePressedLastY = 0;
    };
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
        for (var _i = 0, _a = Direction_1.getAllDirections(); _i < _a.length; _i++) {
            var direction = _a[_i];
            var d = Direction_1.getDirectionValue(direction);
            this.drawTile(x + d.x, y + d.y);
        }
    };
    GridView.prototype.drawTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var s = this.scale;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xCenter = xStart + (17 * s);
        var yCenter = yStart + (17 * s);
        var xSize = (Constants_1.Constants.TileSize * s) + 2;
        var ySize = (Constants_1.Constants.TileSize * s) + 2;
        var tileType = this.gridModel.getTypeAt(x, y);
        if (tileType == TileType_1.TileType.Wall) {
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fillRect(xStart, yStart, xSize, ySize);
            this.printWallDetail(x, y);
        }
        else if (tileType == TileType_1.TileType.Floor) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            this.printStateDetail(x, y);
        }
        else if (tileType == TileType_1.TileType.Entry) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (14 * s), 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (10 * s), 0, 2 * Math.PI);
            this.canvas.fillStyle = '#30b348';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (4 * s), 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
        }
        else if (tileType == TileType_1.TileType.Exit) {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#ffffff';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (14 * s), 0, 2 * Math.PI);
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (10 * s), 0, 2 * Math.PI);
            this.canvas.fillStyle = '#f71b39';
            this.canvas.fill();
            this.canvas.beginPath();
            this.canvas.arc(xCenter, yCenter, (4 * s), 0, 2 * Math.PI);
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
        var xSize = (Constants_1.Constants.TileSize * this.scale) + 2;
        var ySize = (Constants_1.Constants.TileSize * this.scale) + 2;
        if (this.gridModel.getTypeAt(x, y - 1) == TileType_1.TileType.Wall) {
            yStart++;
            ySize--;
        }
        if (this.gridModel.getTypeAt(x + 1, y) == TileType_1.TileType.Wall) {
            xSize--;
        }
        if (this.gridModel.getTypeAt(x, y + 1) == TileType_1.TileType.Wall) {
            ySize--;
        }
        if (this.gridModel.getTypeAt(x - 1, y) == TileType_1.TileType.Wall) {
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
        var s = this.scale;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = (Constants_1.Constants.TileSize * s) + 2;
        var ySize = (Constants_1.Constants.TileSize * s) + 2;
        var up = (this.gridModel.getTypeAt(x, y - 1) == TileType_1.TileType.Wall);
        var right = (this.gridModel.getTypeAt(x + 1, y) == TileType_1.TileType.Wall);
        var down = (this.gridModel.getTypeAt(x, y + 1) == TileType_1.TileType.Wall);
        var left = (this.gridModel.getTypeAt(x - 1, y) == TileType_1.TileType.Wall);
        this.canvas.fillStyle = '#3af0c8';
        if (right && left && !up && !down) {
            this.canvas.fillRect(xStart, yStart + (15 * s), xSize, ySize - (30 * s));
        }
        else if (up && down && !right && !left) {
            this.canvas.fillRect(xStart + (15 * s), yStart, xSize - (30 * s), ySize);
        }
        else {
            this.canvas.fillRect(xStart + (13 * s), yStart + (13 * s), xSize - (26 * s), ySize - (26 * s));
            if (up)
                this.canvas.fillRect(xStart + (15 * s), yStart, xSize - (30 * s), ySize - (23 * s));
            if (right)
                this.canvas.fillRect(xStart + (23 * s), yStart + (15 * s), xSize - (23 * s), ySize - (30 * s));
            if (down)
                this.canvas.fillRect(xStart + (15 * s), yStart + (23 * s), xSize - (30 * s), ySize - (23 * s));
            if (left)
                this.canvas.fillRect(xStart, yStart + (15 * s), xSize - (23 * s), ySize - (30 * s));
        }
    };
    GridView.prototype.printStateDetail = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var s = this.scale;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xCenter = xStart + (17 * s);
        var yCenter = yStart + (17 * s);
        var xSize = (Constants_1.Constants.TileSize * s) + 2;
        var ySize = (Constants_1.Constants.TileSize * s) + 2;
        var tileState = this.gridModel.getStateAt(x, y);
        var direction = this.gridModel.getDirectionAt(x, y);
        if (tileState == TileState_1.TileState.Undiscovered)
            return;
        var up = false;
        var right = false;
        var down = false;
        var left = false;
        if (tileState == TileState_1.TileState.Discovered) {
            this.canvas.fillStyle = '#ad3df2';
        }
        else if (tileState == TileState_1.TileState.Visited) {
            this.canvas.fillStyle = '#a85e32';
        }
        else if (tileState == TileState_1.TileState.Path) {
            this.canvas.fillStyle = '#f71b39';
            up = (this.gridModel.getStateAt(x, y - 1) == TileState_1.TileState.Path);
            right = (this.gridModel.getStateAt(x + 1, y) == TileState_1.TileState.Path);
            down = (this.gridModel.getStateAt(x, y + 1) == TileState_1.TileState.Path);
            left = (this.gridModel.getStateAt(x - 1, y) == TileState_1.TileState.Path);
        }
        else {
            this.canvas.fillStyle = '#f01fff';
        }
        this.canvas.beginPath();
        this.canvas.arc(xCenter, yCenter, (5 * s), 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.beginPath();
        if (direction == Direction_1.Direction.Up && !up) {
            this.canvas.moveTo(xCenter, yStart + (7 * s));
            this.canvas.lineTo(xCenter + (4 * s), yCenter - (2 * s));
            this.canvas.lineTo(xCenter - (4 * s), yCenter - (2 * s));
            this.canvas.lineTo(xCenter, yStart + (7 * s));
        }
        else if (direction == Direction_1.Direction.Right && !right) {
            this.canvas.moveTo(xStart + (27 * s), yCenter);
            this.canvas.lineTo(xCenter + (2 * s), yCenter + (4 * s));
            this.canvas.lineTo(xCenter + (2 * s), yCenter - (4 * s));
            this.canvas.lineTo(xStart + (27 * s), yCenter);
        }
        else if (direction == Direction_1.Direction.Down && !down) {
            this.canvas.moveTo(xCenter, yStart + (27 * s));
            this.canvas.lineTo(xCenter + (4 * s), yCenter + (2 * s));
            this.canvas.lineTo(xCenter - (4 * s), yCenter + (2 * s));
            this.canvas.lineTo(xCenter, yStart + (27 * s));
        }
        else if (direction == Direction_1.Direction.Left && !left) {
            this.canvas.moveTo(xStart + (7 * s), yCenter);
            this.canvas.lineTo(xCenter - (2 * s), yCenter + (4 * s));
            this.canvas.lineTo(xCenter - (2 * s), yCenter - (4 * s));
            this.canvas.lineTo(xStart + (7 * s), yCenter);
        }
        if (up)
            this.canvas.fillRect(xStart + (15 * s), yStart, xSize - (30 * s), ySize - (20 * s));
        if (right)
            this.canvas.fillRect(xStart + (20 * s), yStart + (15 * s), xSize - (20 * s), ySize - (30 * s));
        if (down)
            this.canvas.fillRect(xStart + (15 * s), yStart + (20 * s), xSize - (30 * s), ySize - (20 * s));
        if (left)
            this.canvas.fillRect(xStart, yStart + (15 * s), xSize - (20 * s), ySize - (30 * s));
        this.canvas.fill();
    };
    GridView.prototype.tileToCoordinateX = function (x) {
        return this.offsetX + (x * ((Constants_1.Constants.TileSize * this.scale) + 1));
    };
    GridView.prototype.tileToCoordinateY = function (y) {
        return this.offsetY + (y * ((Constants_1.Constants.TileSize * this.scale) + 1));
    };
    GridView.prototype.coordinateXToTile = function (coordinateX) {
        return Math.floor((coordinateX - (this.offsetX + 1)) / ((Constants_1.Constants.TileSize * this.scale) + 1));
    };
    GridView.prototype.coordinateYToTile = function (coordinateY) {
        return Math.floor((coordinateY - (this.offsetY + 1)) / ((Constants_1.Constants.TileSize * this.scale) + 1));
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
            crossedTiles[i] = new Pair_1.Pair(x, y);
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
        var tileType = this.gridModel.getTypeAt(x, y);
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

},{"./Constants":2,"./Direction":3,"./Pair":9,"./TileState":12,"./TileType":13}],7:[function(require,module,exports){
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
var LevelBuilder = /** @class */ (function () {
    function LevelBuilder(gridModel) {
        this.gridModel = gridModel;
        this.running = false;
        this.runningId = 0;
        this.stepDelay = 50;
        this.unactivated = true;
        this.onstep = null;
    }
    LevelBuilder.prototype.reset = function () {
        this.running = false;
        this.unactivated = true;
    };
    LevelBuilder.prototype.run = function () {
        if (!this.running) {
            this.unactivated = false;
            this.running = true;
            this.runningId++;
            this.stepLoop(this.runningId);
        }
    };
    LevelBuilder.prototype.pause = function () {
        this.running = false;
    };
    LevelBuilder.prototype.isUnactivated = function () {
        return this.unactivated;
    };
    LevelBuilder.prototype.stepLoop = function (runningId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.initialization();
                        _a.label = 1;
                    case 1:
                        if (!(this.running && runningId == this.runningId)) return [3 /*break*/, 3];
                        this.step();
                        return [4 /*yield*/, this.delay(this.stepDelay)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    LevelBuilder.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return LevelBuilder;
}());
exports.LevelBuilder = LevelBuilder;

},{}],8:[function(require,module,exports){
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
var TileType_1 = require("./TileType");
var Direction_1 = require("./Direction");
var LevelBuilder_1 = require("./LevelBuilder");
var LevelBuilderX = /** @class */ (function (_super) {
    __extends(LevelBuilderX, _super);
    function LevelBuilderX(gridModel) {
        var _this = _super.call(this, gridModel) || this;
        _this.reset();
        return _this;
    }
    LevelBuilderX.prototype.reset = function () {
        _super.prototype.reset.call(this);
    };
    LevelBuilderX.prototype.initialization = function () {
        this.direction = Direction_1.Direction.Right;
        this.x = 0;
        this.y = 0;
    };
    LevelBuilderX.prototype.step = function () {
        if (this.direction == Direction_1.Direction.Right) {
            if (this.onstep)
                this.onstep(this.x, this.y, TileType_1.TileType.Wall);
            if (this.x + 1 >= this.gridModel.getWidth()) {
                this.direction = Direction_1.Direction.Down;
                this.y++;
            }
            else {
                this.x++;
            }
        }
        else if (this.direction == Direction_1.Direction.Down) {
            if (this.onstep)
                this.onstep(this.x, this.y, TileType_1.TileType.Wall);
            if (this.y + 1 >= this.gridModel.getHeight()) {
                this.direction = Direction_1.Direction.Left;
                this.x--;
            }
            else {
                this.y++;
            }
        }
        else if (this.direction == Direction_1.Direction.Left) {
            if (this.onstep)
                this.onstep(this.x, this.y, TileType_1.TileType.Wall);
            if (this.x - 1 < 0) {
                this.direction = Direction_1.Direction.Up;
                this.y--;
            }
            else {
                this.x--;
            }
        }
        else if (this.direction == Direction_1.Direction.Up) {
            if (this.onstep)
                this.onstep(this.x, this.y, TileType_1.TileType.Wall);
            if (this.x - 1 >= 0) {
                this.running = false;
                return;
            }
            else {
                this.y--;
            }
        }
    };
    return LevelBuilderX;
}(LevelBuilder_1.LevelBuilder));
exports.LevelBuilderX = LevelBuilderX;

},{"./Direction":3,"./LevelBuilder":7,"./TileType":13}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pair = /** @class */ (function () {
    function Pair(x, y) {
        this.x = x;
        this.y = y;
    }
    return Pair;
}());
exports.Pair = Pair;

},{}],10:[function(require,module,exports){
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
var TileType_1 = require("./TileType");
var TileState_1 = require("./TileState");
var Direction_1 = require("./Direction");
var Pathfinder = /** @class */ (function () {
    function Pathfinder(gridModel) {
        this.gridModel = gridModel;
        this.running = false;
        this.exitFound = false;
        this.runningId = 0;
        this.stepDelay = 50;
        this.unactivated = true;
        this.onstep = null;
        this.onpathstep = null;
    }
    Pathfinder.prototype.reset = function () {
        this.running = false;
        this.exitFound = false;
        this.unactivated = true;
    };
    Pathfinder.prototype.run = function () {
        if (!this.running) {
            this.unactivated = false;
            this.running = true;
            this.runningId++;
            this.stepLoop(this.runningId);
        }
    };
    Pathfinder.prototype.pause = function () {
        this.running = false;
    };
    Pathfinder.prototype.isUnactivated = function () {
        return this.unactivated;
    };
    Pathfinder.prototype.stepLoop = function (runningId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.initialization();
                        _a.label = 1;
                    case 1:
                        if (!(this.running && runningId == this.runningId)) return [3 /*break*/, 3];
                        if (!this.exitFound)
                            this.step();
                        else
                            this.pathStep();
                        return [4 /*yield*/, this.delay(this.stepDelay)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Pathfinder.prototype.pathStep = function () {
        if (this.onpathstep != null)
            this.onpathstep(this.pathX, this.pathY, TileState_1.TileState.Path, null);
        if (this.gridModel.getTypeAt(this.pathX, this.pathY) == TileType_1.TileType.Entry) {
            this.running = false;
            return;
        }
        var direction = this.gridModel.getDirectionAt(this.pathX, this.pathY);
        var d = Direction_1.getDirectionValue(direction);
        this.pathX += d.x;
        this.pathY += d.y;
    };
    Pathfinder.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Pathfinder;
}());
exports.Pathfinder = Pathfinder;

},{"./Direction":3,"./TileState":12,"./TileType":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = /** @class */ (function () {
    function Queue() {
        this.storage = new Array();
    }
    Queue.prototype.clear = function () {
        this.storage.length = 0;
    };
    Queue.prototype.enqueue = function (value) {
        this.storage.push(value);
    };
    Queue.prototype.dequeue = function () {
        var value = this.storage.shift();
        if (value == undefined)
            return null;
        return value;
    };
    Queue.prototype.size = function () {
        return this.storage.length;
    };
    Queue.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    return Queue;
}());
exports.Queue = Queue;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["Undiscovered"] = 0] = "Undiscovered";
    TileState[TileState["Discovered"] = 1] = "Discovered";
    TileState[TileState["Visited"] = 2] = "Visited";
    TileState[TileState["Path"] = 3] = "Path";
})(TileState = exports.TileState || (exports.TileState = {}));

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType;
(function (TileType) {
    TileType[TileType["Floor"] = 0] = "Floor";
    TileType[TileType["Wall"] = 1] = "Wall";
    TileType[TileType["Entry"] = 2] = "Entry";
    TileType[TileType["Exit"] = 3] = "Exit";
})(TileType = exports.TileType || (exports.TileType = {}));

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./Grid");
var grid;
var htmlGrid;
var findButton;
var generateButton;
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
        var scale = 1;
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight;
        if ((window.innerWidth / window.devicePixelRatio) <= 600)
            scale = 2;
        grid = new Grid_1.Grid(htmlGrid, scale);
    }
    else {
        grid = null;
    }
}
function resetGrid() {
    if (htmlGrid instanceof HTMLCanvasElement) {
        var scale = 1;
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight;
        if ((window.innerWidth / window.devicePixelRatio) <= 600)
            scale = 2;
        if (grid != null)
            grid.reset(scale);
    }
}
function runPathfinder() {
    if (grid != null)
        grid.runPathfinder();
}
function runLevelBuilder() {
    if (grid != null)
        grid.runLevelBuilder();
}
function openResizeMessage() {
    if (resizeMessage != null) {
        resizeMessage.style.display = 'block';
    }
}
function closeResizeMessage(reset) {
    if (reset && grid != null)
        resetGrid();
    if (resizeMessage != null) {
        resizeMessage.style.display = 'none';
    }
}
function setupHtmlElements() {
    htmlGrid = document.getElementById('grid');
    findButton = document.getElementById('find-button');
    generateButton = document.getElementById('generate-button');
    resetButton = document.getElementById('reset-button');
    resizeMessage = document.getElementById('resize-message');
    var resizeMessageYes = document.getElementById('resize-message-yes');
    var resizeMessageNo = document.getElementById('resize-message-no');
    if (resetButton instanceof HTMLAnchorElement) {
        resetButton.onclick = function () { return resetGrid(); };
    }
    if (findButton instanceof HTMLAnchorElement) {
        findButton.onclick = function () { return runPathfinder(); };
    }
    if (generateButton instanceof HTMLAnchorElement) {
        generateButton.onclick = function () { return runLevelBuilder(); };
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

},{"./Grid":4}]},{},[14]);
