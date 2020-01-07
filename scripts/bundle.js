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
var TileType_1 = require("../utils/TileType");
var Direction_1 = require("../utils/Direction");
var MazeBuilder_1 = require("./MazeBuilder");
var Queue_1 = require("../utils/Queue");
var Pair_1 = require("../utils/Pair");
var BFSMazeBuilder = /** @class */ (function (_super) {
    __extends(BFSMazeBuilder, _super);
    function BFSMazeBuilder() {
        var _this = _super.call(this) || this;
        _this.discoveredTiles = new Queue_1.Queue();
        return _this;
    }
    BFSMazeBuilder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.gridModel == null) {
            return;
        }
        this.tiles = new Array(this.height);
        this.directions = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = new Array(this.width);
            this.directions[i] = new Array(this.width);
        }
    };
    BFSMazeBuilder.prototype.initialization = function () {
        _super.prototype.initialization.call(this);
        if (this.gridModel == null)
            return;
        this.discoveredTiles.clear();
        this.discoveredTiles.enqueue(new Pair_1.Pair(1, 1));
        this.currentTile = null;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.tiles[i][j] = false;
                this.directions[i][j] = Direction_1.Direction.None;
            }
        }
    };
    BFSMazeBuilder.prototype.mazeStep = function () {
        if (this.gridModel == null) {
            this.running = false;
            return;
        }
        if (this.currentTile != null) {
            if (this.onstep != null)
                this.onstep(this.currentTile.x, this.currentTile.y, TileType_1.TileType.Floor);
            this.currentTile = null;
            return;
        }
        var current;
        do {
            if (this.discoveredTiles.isEmpty()) {
                this.running = false;
                return;
            }
            current = this.discoveredTiles.dequeue();
        } while (this.tiles[current.y][current.x]);
        this.tiles[current.y][current.x] = true;
        var d = Direction_1.getDirectionValue(this.directions[current.y][current.x]);
        if (this.onstep != null)
            this.onstep(current.x + d.x, current.y + d.y, TileType_1.TileType.Floor);
        if (this.directions[current.y][current.x] != Direction_1.Direction.None)
            this.currentTile = current;
        if (this.gridModel.getTypeAt(current.x, current.y) == TileType_1.TileType.Exit)
            return;
        for (var _i = 0, _a = Direction_1.getRandomizedDirections(); _i < _a.length; _i++) {
            var direction = _a[_i];
            var d_1 = Direction_1.getDirectionValue(direction);
            var invertedDirection = Direction_1.invertDirection(direction);
            var x = current.x + (d_1.x * 2);
            var y = current.y + (d_1.y * 2);
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                continue;
            this.directions[y][x] = invertedDirection;
            this.discoveredTiles.enqueue(new Pair_1.Pair(x, y));
        }
    };
    return BFSMazeBuilder;
}(MazeBuilder_1.MazeBuilder));
exports.BFSMazeBuilder = BFSMazeBuilder;

},{"../utils/Direction":15,"../utils/Pair":18,"../utils/Queue":19,"../utils/TileType":22,"./MazeBuilder":4}],2:[function(require,module,exports){
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
var Builder = /** @class */ (function () {
    function Builder() {
        this.gridModel = null;
        this.running = false;
        this.runningId = 0;
        this.stepDelay = 50;
        this.unactivated = true;
        this.onstep = null;
    }
    Builder.prototype.setGridModel = function (gridModel) {
        this.gridModel = gridModel;
        this.reset();
    };
    Builder.prototype.reset = function () {
        this.running = false;
        this.unactivated = true;
    };
    Builder.prototype.run = function () {
        if (!this.running) {
            this.unactivated = false;
            this.running = true;
            this.runningId++;
            this.stepLoop(this.runningId);
        }
    };
    Builder.prototype.pause = function () {
        this.running = false;
    };
    Builder.prototype.isUnactivated = function () {
        return this.unactivated;
    };
    Builder.prototype.stepLoop = function (runningId) {
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
    Builder.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Builder;
}());
exports.Builder = Builder;

},{}],3:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var Direction_1 = require("../utils/Direction");
var MazeBuilder_1 = require("./MazeBuilder");
var Stack_1 = require("../utils/Stack");
var Pair_1 = require("../utils/Pair");
var DFSMazeBuilder = /** @class */ (function (_super) {
    __extends(DFSMazeBuilder, _super);
    function DFSMazeBuilder() {
        var _this = _super.call(this) || this;
        _this.discoveredTiles = new Stack_1.Stack();
        return _this;
    }
    DFSMazeBuilder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.gridModel == null) {
            return;
        }
        this.tiles = new Array(this.height);
        this.directions = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = new Array(this.width);
            this.directions[i] = new Array(this.width);
        }
    };
    DFSMazeBuilder.prototype.initialization = function () {
        _super.prototype.initialization.call(this);
        if (this.gridModel == null)
            return;
        this.discoveredTiles.clear();
        this.discoveredTiles.push(new Pair_1.Pair(1, 1));
        this.currentTile = null;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.tiles[i][j] = false;
                this.directions[i][j] = Direction_1.Direction.None;
            }
        }
    };
    DFSMazeBuilder.prototype.mazeStep = function () {
        if (this.gridModel == null) {
            this.running = false;
            return;
        }
        if (this.currentTile != null) {
            if (this.onstep != null)
                this.onstep(this.currentTile.x, this.currentTile.y, TileType_1.TileType.Floor);
            this.currentTile = null;
            return;
        }
        var current;
        do {
            if (this.discoveredTiles.isEmpty()) {
                this.running = false;
                return;
            }
            current = this.discoveredTiles.pop();
        } while (this.tiles[current.y][current.x]);
        this.tiles[current.y][current.x] = true;
        var d = Direction_1.getDirectionValue(this.directions[current.y][current.x]);
        if (this.onstep != null)
            this.onstep(current.x + d.x, current.y + d.y, TileType_1.TileType.Floor);
        if (this.directions[current.y][current.x] != Direction_1.Direction.None)
            this.currentTile = current;
        if (this.gridModel.getTypeAt(current.x, current.y) == TileType_1.TileType.Exit)
            return;
        for (var _i = 0, _a = Direction_1.getRandomizedDirections(); _i < _a.length; _i++) {
            var direction = _a[_i];
            var d_1 = Direction_1.getDirectionValue(direction);
            var invertedDirection = Direction_1.invertDirection(direction);
            var x = current.x + (d_1.x * 2);
            var y = current.y + (d_1.y * 2);
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                continue;
            this.directions[y][x] = invertedDirection;
            this.discoveredTiles.push(new Pair_1.Pair(x, y));
        }
    };
    return DFSMazeBuilder;
}(MazeBuilder_1.MazeBuilder));
exports.DFSMazeBuilder = DFSMazeBuilder;

},{"../utils/Direction":15,"../utils/Pair":18,"../utils/Stack":20,"../utils/TileType":22,"./MazeBuilder":4}],4:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var Builder_1 = require("./Builder");
var MazeBuilder = /** @class */ (function (_super) {
    __extends(MazeBuilder, _super);
    function MazeBuilder() {
        return _super.call(this) || this;
    }
    MazeBuilder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.gridModel == null) {
            return;
        }
        this.width = this.gridModel.getWidth();
        if ((this.width % 2) == 0)
            this.width--;
        this.height = this.gridModel.getHeight();
        if ((this.height % 2) == 0)
            this.height--;
    };
    MazeBuilder.prototype.initialization = function () {
        if (this.gridModel == null) {
            return;
        }
        this.wall = 0;
        this.wallBuilt = false;
        this.wallFilled = false;
        if (this.onstep != null)
            this.onstep(1, 1, TileType_1.TileType.Entry);
        if (this.onstep != null)
            this.onstep(this.width - 2, this.height - 2, TileType_1.TileType.Exit);
    };
    MazeBuilder.prototype.step = function () {
        if (this.gridModel == null) {
            this.running = false;
            return;
        }
        if (!this.wallBuilt)
            this.wallStep();
        else if (!this.wallFilled)
            this.fillStep();
        else
            this.mazeStep();
    };
    MazeBuilder.prototype.wallStep = function () {
        if (this.wall >= Math.max((this.width + 1) / 2, (this.height + 1) / 2)) {
            this.wallBuilt = true;
            this.wall = 1;
            return;
        }
        if (this.wall < ((this.width + 1) / 2)) {
            if (this.onstep != null)
                this.onstep(this.wall, 0, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.width - this.wall - 1, 0, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.wall, this.height - 1, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.width - this.wall - 1, this.height - 1, TileType_1.TileType.Wall);
        }
        if (this.wall < ((this.height + 1) / 2)) {
            if (this.onstep != null)
                this.onstep(0, this.wall, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(0, this.height - this.wall - 1, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.width - 1, this.wall, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.width - 1, this.height - this.wall - 1, TileType_1.TileType.Wall);
        }
        this.wall++;
    };
    MazeBuilder.prototype.fillStep = function () {
        if (this.wall > ((this.width + this.height) / 2)) {
            this.wallFilled = true;
            return;
        }
        var start = Math.max(0, this.wall - this.width + 1);
        var end = Math.min(this.wall + 1, this.height);
        for (var i = start; i < end; i++) {
            if (this.onstep != null)
                this.onstep(this.wall - i, i, TileType_1.TileType.Wall);
            if (this.onstep != null)
                this.onstep(this.width - this.wall + i - 1, this.height - i - 1, TileType_1.TileType.Wall);
        }
        this.wall++;
    };
    return MazeBuilder;
}(Builder_1.Builder));
exports.MazeBuilder = MazeBuilder;

},{"../utils/TileType":22,"./Builder":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = require("../utils/List");
var ControlBar = /** @class */ (function () {
    function ControlBar(builderSelect, generateButton, pathfinderSelect, findButton, resetButton) {
        this.builderSelect = builderSelect;
        this.generateButton = generateButton;
        this.pathfinderSelect = pathfinderSelect;
        this.findButton = findButton;
        this.resetButton = resetButton;
        this.builders = new List_1.List();
        this.pathfinders = new List_1.List();
        this.onbuilderchange = null;
        this.ongenerate = null;
        this.onpathfinderchange = null;
        this.onfind = null;
        this.onreset = null;
        this.setupEvents();
    }
    ControlBar.prototype.setupEvents = function () {
        var _this = this;
        this.builderSelect.onchange = function () {
            _this.handleOnBuilderChangeEvent();
        };
        this.generateButton.onclick = function () {
            _this.handleOnGenerateButtonClickEvent();
        };
        this.pathfinderSelect.onchange = function () {
            _this.handleOnPathfinderChangeEvent();
        };
        this.findButton.onclick = function () {
            _this.handleOnFindButtonClickEvent();
        };
        this.resetButton.onclick = function () {
            _this.handleOnResetButtonClickEvent();
        };
    };
    ControlBar.prototype.addBuilder = function (builderName, builder) {
        var newOption = document.createElement('option');
        newOption.text = builderName;
        newOption.value = '' + this.builders.size();
        this.builders.add(builder);
        this.builderSelect.add(newOption);
    };
    ControlBar.prototype.getDefaultBuilder = function () {
        return this.builders.get(0);
    };
    ControlBar.prototype.addPathfinder = function (pathfinderName, pathfinder) {
        var newOption = document.createElement('option');
        newOption.text = pathfinderName;
        newOption.value = '' + this.pathfinders.size();
        this.pathfinders.add(pathfinder);
        this.pathfinderSelect.add(newOption);
    };
    ControlBar.prototype.getDefaultPathfinder = function () {
        return this.pathfinders.get(0);
    };
    ControlBar.prototype.handleOnBuilderChangeEvent = function () {
        this.triggerOnBuilderChangeEvent();
    };
    ControlBar.prototype.handleOnGenerateButtonClickEvent = function () {
        this.triggerOnGenerateEvent();
    };
    ControlBar.prototype.handleOnPathfinderChangeEvent = function () {
        this.triggerOnPathfinderChangeEvent();
    };
    ControlBar.prototype.handleOnFindButtonClickEvent = function () {
        this.triggerOnFindEvent();
    };
    ControlBar.prototype.handleOnResetButtonClickEvent = function () {
        this.triggerOnResetEvent();
    };
    ControlBar.prototype.triggerOnBuilderChangeEvent = function () {
        if (this.onbuilderchange == null)
            return;
        var index = parseInt(this.builderSelect.value);
        var builder = this.builders.get(index);
        if (builder != null)
            this.onbuilderchange(builder);
    };
    ControlBar.prototype.triggerOnGenerateEvent = function () {
        if (this.ongenerate == null)
            return;
        this.ongenerate();
    };
    ControlBar.prototype.triggerOnPathfinderChangeEvent = function () {
        if (this.onpathfinderchange == null)
            return;
        var index = parseInt(this.pathfinderSelect.value);
        var pathfinder = this.pathfinders.get(index);
        if (pathfinder != null)
            this.onpathfinderchange(pathfinder);
    };
    ControlBar.prototype.triggerOnFindEvent = function () {
        if (this.onfind == null)
            return;
        this.onfind();
    };
    ControlBar.prototype.triggerOnResetEvent = function () {
        if (this.onreset == null)
            return;
        this.onreset();
    };
    return ControlBar;
}());
exports.ControlBar = ControlBar;

},{"../utils/List":17}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var TileType_1 = require("../utils/TileType");
var Constants_1 = require("../utils/Constants");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas, scale) {
        this.htmlCanvas = htmlCanvas;
        var realTileSize = (Constants_1.Constants.TileSize * scale) + 1;
        var gridWidth = Math.floor((htmlCanvas.width - 1) / realTileSize);
        var gridHeight = Math.floor((htmlCanvas.height - 1) / realTileSize);
        this.gridModel = new GridModel_1.GridModel(gridWidth, gridHeight);
        this.gridView = new GridView_1.GridView(htmlCanvas, scale, this.gridModel);
        this.pathfinder = null;
        this.builder = null;
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
        if (this.pathfinder != null)
            this.pathfinder.reset();
        if (this.builder != null)
            this.builder.reset();
        this.currentTileType = TileType_1.TileType.Floor;
        this.gridView.draw();
    };
    Grid.prototype.setPathfinder = function (pathfinder) {
        if (pathfinder == this.pathfinder)
            return;
        if (this.pathfinder != null) {
            this.unsetPathfinderEvents();
            if (!this.pathfinder.isUnactivated()) {
                this.gridModel.resetStates();
                this.gridView.draw();
                this.pathfinder.reset();
            }
        }
        this.pathfinder = pathfinder;
        this.pathfinder.setGridModel(this.gridModel);
        this.setupPathfinderEvents();
    };
    Grid.prototype.runPathfinder = function () {
        if (this.pathfinder == null)
            return;
        if (!this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (this.builder != null && !this.builder.isUnactivated()) {
            this.builder.reset();
        }
        this.pathfinder.run();
    };
    Grid.prototype.setBuilder = function (builder) {
        if (this.builder != null) {
            this.unsetBuilderEvents();
        }
        this.builder = builder;
        this.builder.setGridModel(this.gridModel);
        this.setupBuilderEvents();
    };
    Grid.prototype.runBuilder = function () {
        if (this.builder == null)
            return;
        if (!this.builder.isUnactivated()) {
            this.builder.reset();
        }
        if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.pathfinder.reset();
        }
        this.gridModel.resetTiles();
        this.gridView.draw();
        this.builder.run();
    };
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.ontiletypeselect = function (x, y) {
            _this.handleOnTileTypeSelectEvent(x, y);
        };
        this.gridView.ontileclick = function (x, y) {
            _this.handleOnTileClickEvent(x, y);
        };
    };
    Grid.prototype.setupPathfinderEvents = function () {
        var _this = this;
        if (this.pathfinder == null)
            return;
        this.pathfinder.onstep = function (x, y, tileState, direction) {
            _this.handleOnPathfinderStep(x, y, tileState, direction);
        };
        this.pathfinder.onpathstep = function (x, y, tileState, direction) {
            _this.handleOnPathfinderPathStep(x, y, tileState, direction);
        };
    };
    Grid.prototype.unsetPathfinderEvents = function () {
        if (this.pathfinder == null)
            return;
        this.pathfinder.onstep = null;
        this.pathfinder.onpathstep = null;
    };
    Grid.prototype.setupBuilderEvents = function () {
        var _this = this;
        if (this.builder == null)
            return;
        this.builder.onstep = function (x, y, tileType) {
            _this.handleOnBuilderStep(x, y, tileType);
        };
    };
    Grid.prototype.unsetBuilderEvents = function () {
        if (this.builder == null)
            return;
        this.builder.onstep = null;
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
        if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (this.builder != null && !this.builder.isUnactivated()) {
            this.builder.reset();
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
        if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
            this.gridModel.resetStates();
            this.gridView.draw();
            this.pathfinder.reset();
        }
        if (this.builder != null && !this.builder.isUnactivated()) {
            this.builder.reset();
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
    Grid.prototype.handleOnBuilderStep = function (x, y, tileType) {
        if (tileType == TileType_1.TileType.Entry) {
            var oldExitTileX = this.gridModel.getEntryTileX();
            var oldExitTileY = this.gridModel.getEntryTileY();
            this.gridModel.setTypeAt(x, y, TileType_1.TileType.Entry);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);
        }
        else if (tileType == TileType_1.TileType.Exit) {
            var oldExitTileX = this.gridModel.getExitTileX();
            var oldExitTileY = this.gridModel.getExitTileY();
            this.gridModel.setTypeAt(x, y, TileType_1.TileType.Exit);
            this.gridView.drawTileAndNeighbours(x, y);
            this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);
        }
        else {
            this.gridModel.setTypeAt(x, y, tileType);
            this.gridView.drawTileAndNeighbours(x, y);
        }
    };
    return Grid;
}());
exports.Grid = Grid;

},{"../utils/Constants":14,"../utils/TileType":22,"./GridModel":7,"./GridView":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Direction_1 = require("../utils/Direction");
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
        for (var i = 0; i < height; i++) {
            this.tiles[i] = new Array(width);
            this.states[i] = new Array(width);
            this.directions[i] = new Array(width);
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

},{"../utils/Direction":15,"../utils/TileState":21,"../utils/TileType":22}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Pair_1 = require("../utils/Pair");
var Direction_1 = require("../utils/Direction");
var Constants_1 = require("../utils/Constants");
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
        this.offsetY = 0;
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
        for (var _i = 0, _a = Direction_1.getDirections(); _i < _a.length; _i++) {
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
            this.printStateDetail(x, y);
        }
        else if (tileType == TileType_1.TileType.Entry) {
            this.clearTile(x, y);
            this.printStateDetail(x, y);
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
            this.printStateDetail(x, y);
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
        this.canvas.fillStyle = '#ffffff';
        this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
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

},{"../utils/Constants":14,"../utils/Direction":15,"../utils/Pair":18,"../utils/TileState":21,"../utils/TileType":22}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./grid/Grid");
var ControlBar_1 = require("./controlbar/ControlBar");
var BFSPathfinder_1 = require("./pathfinder/BFSPathfinder");
var DFSPathfinder_1 = require("./pathfinder/DFSPathfinder");
var DFSMazeBuilder_1 = require("./builder/DFSMazeBuilder");
var BFSMazeBuilder_1 = require("./builder/BFSMazeBuilder");
var AStarPathfinder_1 = require("./pathfinder/AStarPathfinder");
var grid;
var controlBar;
var htmlGrid;
var header;
var builderSelect;
var generateButton;
var pathfinderSelect;
var findButton;
var resetButton;
var resizeMessage;
window.onload = function () {
    setupHtmlElements();
    createControlBar();
    setupControlBarEvents();
    setupTouchEvents();
    createGrid();
};
window.onresize = function () {
    openResizeMessage();
};
function createGrid() {
    if (htmlGrid instanceof HTMLCanvasElement && header != null) {
        var scale = 1;
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight - header.clientHeight;
        if (window.devicePixelRatio >= 2)
            scale = 2;
        grid = new Grid_1.Grid(htmlGrid, scale);
        if (controlBar != null) {
            var defaultPathfinder = controlBar.getDefaultPathfinder();
            var defaultBuilder = controlBar.getDefaultBuilder();
            if (defaultPathfinder != null)
                grid.setPathfinder(defaultPathfinder);
            if (defaultBuilder != null)
                grid.setBuilder(defaultBuilder);
        }
    }
    else {
        grid = null;
    }
}
function resetGrid() {
    if (htmlGrid instanceof HTMLCanvasElement && header != null) {
        var scale = 1;
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight - header.clientHeight;
        if ((window.innerWidth / window.devicePixelRatio) <= 600)
            scale = 2;
        if (grid != null)
            grid.reset(scale);
    }
}
function createControlBar() {
    controlBar = null;
    if (!(builderSelect instanceof HTMLSelectElement))
        return;
    if (!(generateButton instanceof HTMLAnchorElement))
        return;
    if (!(pathfinderSelect instanceof HTMLSelectElement))
        return;
    if (!(findButton instanceof HTMLAnchorElement))
        return;
    if (!(resetButton instanceof HTMLAnchorElement))
        return;
    controlBar = new ControlBar_1.ControlBar(builderSelect, generateButton, pathfinderSelect, findButton, resetButton);
    controlBar.addBuilder('DFS (Maze)', new DFSMazeBuilder_1.DFSMazeBuilder());
    controlBar.addBuilder('BFS (Maze)', new BFSMazeBuilder_1.BFSMazeBuilder());
    controlBar.addPathfinder('BFS', new BFSPathfinder_1.BFSPathfinder());
    controlBar.addPathfinder('DFS', new DFSPathfinder_1.DFSPathfinder());
    controlBar.addPathfinder('A*', new AStarPathfinder_1.AStarPathfinder());
}
function handleOnBuilderChangeEvent(builder) {
    if (grid != null)
        grid.setBuilder(builder);
}
function handleOnGenerateEvent() {
    if (grid != null)
        grid.runBuilder();
}
function handleOnPathfinderChangeEvent(pathfinder) {
    if (grid != null)
        grid.setPathfinder(pathfinder);
}
function handleOnFindEvent() {
    if (grid != null)
        grid.runPathfinder();
}
function handleOnResetEvent() {
    if (resizeMessage != null) {
        resizeMessage.style.display = 'none';
    }
    resetGrid();
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
    header = document.getElementById('header');
    builderSelect = document.getElementById('builder-select');
    generateButton = document.getElementById('generate-button');
    pathfinderSelect = document.getElementById('pathfinder-select');
    findButton = document.getElementById('find-button');
    resetButton = document.getElementById('reset-button');
    resizeMessage = document.getElementById('resize-message');
    var resizeMessageYes = document.getElementById('resize-message-yes');
    var resizeMessageNo = document.getElementById('resize-message-no');
    if (resizeMessageYes instanceof HTMLAnchorElement) {
        resizeMessageYes.onclick = function () { return closeResizeMessage(true); };
    }
    if (resizeMessageNo instanceof HTMLAnchorElement) {
        resizeMessageNo.onclick = function () { return closeResizeMessage(false); };
    }
}
function setupControlBarEvents() {
    if (controlBar == null)
        return;
    controlBar.onbuilderchange = function (builder) {
        handleOnBuilderChangeEvent(builder);
    };
    controlBar.ongenerate = function () {
        handleOnGenerateEvent();
    };
    controlBar.onpathfinderchange = function (pathfinder) {
        handleOnPathfinderChangeEvent(pathfinder);
    };
    controlBar.onfind = function () {
        handleOnFindEvent();
    };
    controlBar.onreset = function () {
        handleOnResetEvent();
    };
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

},{"./builder/BFSMazeBuilder":1,"./builder/DFSMazeBuilder":3,"./controlbar/ControlBar":5,"./grid/Grid":6,"./pathfinder/AStarPathfinder":10,"./pathfinder/BFSPathfinder":11,"./pathfinder/DFSPathfinder":12}],10:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Heap_1 = require("../utils/Heap");
var Pair_1 = require("../utils/Pair");
var Direction_1 = require("../utils/Direction");
var AStarPathfinder = /** @class */ (function (_super) {
    __extends(AStarPathfinder, _super);
    function AStarPathfinder() {
        var _this = _super.call(this) || this;
        _this.discoveredTiles = new Heap_1.Heap();
        return _this;
    }
    AStarPathfinder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.discoveredTiles.clear();
    };
    AStarPathfinder.prototype.initialization = function () {
        if (this.gridModel == null)
            return;
        var xEntry = this.gridModel.getEntryTileX();
        var yEntry = this.gridModel.getEntryTileY();
        var xExit = this.gridModel.getExitTileX();
        var yExit = this.gridModel.getExitTileY();
        var distance = this.calculateDistance(xEntry, yEntry, xExit, yExit);
        this.discoveredTiles.push(new AStarTile(xEntry, yEntry, 0, distance));
    };
    AStarPathfinder.prototype.step = function () {
        if (this.gridModel == null || this.discoveredTiles.isEmpty()) {
            this.running = false;
            return;
        }
        var current = this.discoveredTiles.pop();
        if (this.onstep != null)
            this.onstep(current.x, current.y, TileState_1.TileState.Visited, null);
        for (var _i = 0, _a = Direction_1.getDirections(); _i < _a.length; _i++) {
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
                }
                if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType_1.TileType.Floor) {
                    var invertedDirection = Direction_1.invertDirection(direction);
                    var xExit = this.gridModel.getExitTileX();
                    var yExit = this.gridModel.getExitTileY();
                    var distance = this.calculateDistance(current.x + d.x, current.y + d.y, xExit, yExit);
                    this.discoveredTiles.push(new AStarTile(current.x + d.x, current.y + d.y, current.gScore + 1, distance));
                    if (this.onstep != null) {
                        this.onstep(current.x + d.x, current.y + d.y, TileState_1.TileState.Discovered, invertedDirection);
                    }
                }
            }
        }
    };
    AStarPathfinder.prototype.calculateDistance = function (x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    };
    return AStarPathfinder;
}(Pathfinder_1.Pathfinder));
exports.AStarPathfinder = AStarPathfinder;
var AStarTile = /** @class */ (function (_super) {
    __extends(AStarTile, _super);
    function AStarTile(x, y, gScore, fScore) {
        var _this = _super.call(this, x, y) || this;
        _this.gScore = gScore;
        _this.fScore = fScore;
        return _this;
    }
    AStarTile.prototype.compare = function (other) {
        if ((this.gScore + this.fScore) != (other.gScore + other.fScore)) {
            return (this.gScore + this.fScore) - (other.gScore + other.fScore);
        }
        else {
            return this.fScore - other.fScore;
        }
    };
    return AStarTile;
}(Pair_1.Pair));

},{"../utils/Direction":15,"../utils/Heap":16,"../utils/Pair":18,"../utils/TileState":21,"../utils/TileType":22,"./Pathfinder":13}],11:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Queue_1 = require("../utils/Queue");
var Pair_1 = require("../utils/Pair");
var Direction_1 = require("../utils/Direction");
var BFSPathfinder = /** @class */ (function (_super) {
    __extends(BFSPathfinder, _super);
    function BFSPathfinder() {
        var _this = _super.call(this) || this;
        _this.discoveredTiles = new Queue_1.Queue();
        return _this;
    }
    BFSPathfinder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.discoveredTiles.clear();
    };
    BFSPathfinder.prototype.initialization = function () {
        if (this.gridModel == null)
            return;
        var x = this.gridModel.getEntryTileX();
        var y = this.gridModel.getEntryTileY();
        this.discoveredTiles.enqueue(new Pair_1.Pair(x, y));
        this.discoveredTiles.enqueue(null);
    };
    BFSPathfinder.prototype.step = function () {
        if (this.gridModel == null || this.discoveredTiles.size() <= 1) {
            this.running = false;
            return;
        }
        var current = this.discoveredTiles.dequeue();
        if (current == null) {
            this.discoveredTiles.shuffle();
            this.discoveredTiles.enqueue(null);
            current = this.discoveredTiles.dequeue();
        }
        if (this.onstep != null)
            this.onstep(current.x, current.y, TileState_1.TileState.Visited, null);
        for (var _i = 0, _a = Direction_1.getDirections(); _i < _a.length; _i++) {
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

},{"../utils/Direction":15,"../utils/Pair":18,"../utils/Queue":19,"../utils/TileState":21,"../utils/TileType":22,"./Pathfinder":13}],12:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Stack_1 = require("../utils/Stack");
var Pair_1 = require("../utils/Pair");
var Direction_1 = require("../utils/Direction");
var DFSPathfinder = /** @class */ (function (_super) {
    __extends(DFSPathfinder, _super);
    function DFSPathfinder() {
        var _this = _super.call(this) || this;
        _this.discoveredTiles = new Stack_1.Stack();
        _this.reset();
        return _this;
    }
    DFSPathfinder.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.discoveredTiles.clear();
    };
    DFSPathfinder.prototype.initialization = function () {
        if (this.gridModel == null)
            return;
        var x = this.gridModel.getEntryTileX();
        var y = this.gridModel.getEntryTileY();
        this.discoveredTiles.push(new Pair_1.Pair(x, y));
    };
    DFSPathfinder.prototype.step = function () {
        if (this.gridModel == null || this.discoveredTiles.isEmpty()) {
            this.running = false;
            return;
        }
        var current = this.discoveredTiles.pop();
        if (this.onstep != null)
            this.onstep(current.x, current.y, TileState_1.TileState.Visited, null);
        for (var _i = 0, _a = Direction_1.getRandomizedDirections(); _i < _a.length; _i++) {
            var direction = _a[_i];
            var d = Direction_1.getDirectionValue(direction);
            if (this.gridModel.getStateAt(current.x + d.x, current.y + d.y) == TileState_1.TileState.Undiscovered) {
                if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType_1.TileType.Exit) {
                    var invertedDirection = Direction_1.invertDirection(direction);
                    this.exitFound = true;
                    this.pathX = current.x + d.x;
                    this.pathY = current.y + d.y;
                    if (this.onstep != null) {
                        this.onstep(current.x + d.x, current.y + d.y, TileState_1.TileState.Visited, invertedDirection);
                    }
                }
                if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType_1.TileType.Floor) {
                    var invertedDirection = Direction_1.invertDirection(direction);
                    this.discoveredTiles.push(new Pair_1.Pair(current.x + d.x, current.y + d.y));
                    if (this.onstep != null) {
                        this.onstep(current.x + d.x, current.y + d.y, TileState_1.TileState.Discovered, invertedDirection);
                    }
                }
            }
        }
    };
    return DFSPathfinder;
}(Pathfinder_1.Pathfinder));
exports.DFSPathfinder = DFSPathfinder;

},{"../utils/Direction":15,"../utils/Pair":18,"../utils/Stack":20,"../utils/TileState":21,"../utils/TileType":22,"./Pathfinder":13}],13:[function(require,module,exports){
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
var TileType_1 = require("../utils/TileType");
var TileState_1 = require("../utils/TileState");
var Direction_1 = require("../utils/Direction");
var Pathfinder = /** @class */ (function () {
    function Pathfinder() {
        this.gridModel = null;
        this.running = false;
        this.exitFound = false;
        this.runningId = 0;
        this.stepDelay = 50;
        this.unactivated = true;
        this.onstep = null;
        this.onpathstep = null;
    }
    Pathfinder.prototype.setGridModel = function (gridModel) {
        this.gridModel = gridModel;
        this.reset();
    };
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
        if (this.gridModel == null) {
            this.running = false;
            return;
        }
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

},{"../utils/Direction":15,"../utils/TileState":21,"../utils/TileType":22}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants;
(function (Constants) {
    Constants[Constants["TileSize"] = 32] = "TileSize";
})(Constants = exports.Constants || (exports.Constants = {}));

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pair_1 = require("./Pair");
var Direction;
(function (Direction) {
    Direction[Direction["None"] = 0] = "None";
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["UpRight"] = 2] = "UpRight";
    Direction[Direction["Right"] = 3] = "Right";
    Direction[Direction["DownRight"] = 4] = "DownRight";
    Direction[Direction["Down"] = 5] = "Down";
    Direction[Direction["DownLeft"] = 6] = "DownLeft";
    Direction[Direction["Left"] = 7] = "Left";
    Direction[Direction["UpLeft"] = 8] = "UpLeft";
})(Direction = exports.Direction || (exports.Direction = {}));
function getDirections() {
    return [
        Direction.Right,
        Direction.Left,
        Direction.Up,
        Direction.Down
    ];
}
exports.getDirections = getDirections;
function getExtendedDirections() {
    return [
        Direction.Up,
        Direction.UpRight,
        Direction.Right,
        Direction.DownRight,
        Direction.Down,
        Direction.DownLeft,
        Direction.Left,
        Direction.UpLeft
    ];
}
exports.getExtendedDirections = getExtendedDirections;
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
    else if (direction == Direction.UpRight)
        return new Pair_1.Pair(1, -1);
    else if (direction == Direction.Right)
        return new Pair_1.Pair(1, 0);
    else if (direction == Direction.DownRight)
        return new Pair_1.Pair(1, 1);
    else if (direction == Direction.Down)
        return new Pair_1.Pair(0, 1);
    else if (direction == Direction.DownLeft)
        return new Pair_1.Pair(-1, 1);
    else if (direction == Direction.Left)
        return new Pair_1.Pair(-1, 0);
    else if (direction == Direction.UpLeft)
        return new Pair_1.Pair(-1, -1);
    else
        return new Pair_1.Pair(0, 0);
}
exports.getDirectionValue = getDirectionValue;
function invertDirection(direction) {
    if (direction == Direction.Up)
        return Direction.Down;
    else if (direction == Direction.UpRight)
        return Direction.DownLeft;
    else if (direction == Direction.Right)
        return Direction.Left;
    else if (direction == Direction.DownRight)
        return Direction.UpLeft;
    else if (direction == Direction.Down)
        return Direction.Up;
    else if (direction == Direction.DownLeft)
        return Direction.UpRight;
    else if (direction == Direction.Left)
        return Direction.Right;
    else if (direction == Direction.UpLeft)
        return Direction.DownRight;
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

},{"./Pair":18}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Heap = /** @class */ (function () {
    function Heap() {
        this.storage = [];
    }
    Heap.prototype.push = function (element) {
        this.storage.push(element);
        this.bubbleUp(this.storage.length - 1);
    };
    Heap.prototype.pop = function () {
        var result = this.storage[0];
        var end = this.storage.pop();
        if (end == undefined)
            return null;
        if (this.storage.length > 0) {
            this.storage[0] = end;
            this.sinkDown(0);
        }
        return result;
    };
    Heap.prototype.size = function () {
        return this.storage.length;
    };
    Heap.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    Heap.prototype.clear = function () {
        this.storage.length = 0;
    };
    Heap.prototype.bubbleUp = function (index) {
        var element = this.storage[index];
        while (index > 0) {
            var parentIndex = Math.floor((index + 1) / 2) - 1;
            var parent_1 = this.storage[parentIndex];
            if (element.compare(parent_1) >= 0)
                break;
            this.storage[parentIndex] = element;
            this.storage[index] = parent_1;
            index = parentIndex;
        }
    };
    Heap.prototype.sinkDown = function (index) {
        var length = this.storage.length;
        var element = this.storage[index];
        var swap = null;
        do {
            var child2Index = (index + 1) * 2;
            var child1Index = child2Index - 1;
            var child1 = null;
            swap = null;
            if (child1Index < length) {
                child1 = this.storage[child1Index];
                if (child1.compare(element) < 0)
                    swap = child1Index;
            }
            if (child2Index < length) {
                var child2 = this.storage[child2Index];
                if (child2.compare(child1 == null ? element : child1) < 0) {
                    swap = child2Index;
                }
            }
            if (swap != null) {
                this.storage[index] = this.storage[swap];
                this.storage[swap] = element;
                index = swap;
            }
        } while (swap != null);
    };
    return Heap;
}());
exports.Heap = Heap;
var HeapElement = /** @class */ (function () {
    function HeapElement() {
    }
    return HeapElement;
}());

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List = /** @class */ (function () {
    function List() {
        this.storage = new Array();
    }
    List.prototype.clear = function () {
        this.storage.length = 0;
    };
    List.prototype.add = function (value) {
        this.storage.push(value);
    };
    List.prototype.get = function (index) {
        if (index < 0 || index >= this.storage.length)
            return null;
        return this.storage[index];
    };
    List.prototype.size = function () {
        return this.storage.length;
    };
    List.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    return List;
}());
exports.List = List;

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = /** @class */ (function () {
    function Queue() {
        this.storage = new Array();
    }
    Queue.prototype.clear = function () {
        this.storage.length = 0;
    };
    Queue.prototype.enqueue = function (element) {
        this.storage.push(element);
    };
    Queue.prototype.dequeue = function () {
        var element = this.storage.shift();
        if (element == undefined)
            return null;
        return element;
    };
    Queue.prototype.size = function () {
        return this.storage.length;
    };
    Queue.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    Queue.prototype.shuffle = function () {
        var currentIndex = this.storage.length;
        while (0 != currentIndex) {
            var randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            var aux = this.storage[currentIndex];
            this.storage[currentIndex] = this.storage[randomIndex];
            this.storage[randomIndex] = aux;
        }
    };
    return Queue;
}());
exports.Queue = Queue;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stack = /** @class */ (function () {
    function Stack() {
        this.storage = new Array();
    }
    Stack.prototype.clear = function () {
        this.storage.length = 0;
    };
    Stack.prototype.push = function (element) {
        this.storage.push(element);
    };
    Stack.prototype.pop = function () {
        var element = this.storage.pop();
        if (element == undefined)
            return null;
        return element;
    };
    Stack.prototype.size = function () {
        return this.storage.length;
    };
    Stack.prototype.isEmpty = function () {
        return this.storage.length == 0;
    };
    return Stack;
}());
exports.Stack = Stack;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["Undiscovered"] = 0] = "Undiscovered";
    TileState[TileState["Discovered"] = 1] = "Discovered";
    TileState[TileState["Visited"] = 2] = "Visited";
    TileState[TileState["Path"] = 3] = "Path";
})(TileState = exports.TileState || (exports.TileState = {}));

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType;
(function (TileType) {
    TileType[TileType["Floor"] = 0] = "Floor";
    TileType[TileType["Wall"] = 1] = "Wall";
    TileType[TileType["Entry"] = 2] = "Entry";
    TileType[TileType["Exit"] = 3] = "Exit";
})(TileType = exports.TileType || (exports.TileType = {}));

},{}]},{},[9]);
