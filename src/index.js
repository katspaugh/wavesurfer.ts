"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.WaveSurfer = exports.PlayerType = void 0;
var fetcher_js_1 = require("./fetcher.js");
var decoder_js_1 = require("./decoder.js");
var renderer_js_1 = require("./renderer.js");
var player_js_1 = require("./player.js");
var player_webaudio_js_1 = require("./player-webaudio.js");
var event_emitter_js_1 = require("./event-emitter.js");
var timer_js_1 = require("./timer.js");
var PlayerType;
(function (PlayerType) {
    PlayerType["WebAudio"] = "WebAudio";
    PlayerType["MediaElement"] = "MediaElement";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var defaultOptions = {
    height: 128,
    waveColor: '#999',
    progressColor: '#555',
    minPxPerSec: 0,
    backend: 'MediaElement'
};
var WaveSurfer = /** @class */ (function (_super) {
    __extends(WaveSurfer, _super);
    /** Create a new WaveSurfer instance */
    function WaveSurfer(options) {
        var _this = _super.call(this) || this;
        _this.plugins = [];
        _this.subscriptions = [];
        _this.channelData = null;
        _this.duration = 0;
        _this.options = Object.assign({}, defaultOptions, options);
        _this.fetcher = new fetcher_js_1["default"]();
        _this.decoder = new decoder_js_1["default"]();
        _this.timer = new timer_js_1["default"]();
        _this.player = new (_this.options.backend === PlayerType.WebAudio ? player_webaudio_js_1["default"] : player_js_1["default"])({
            media: _this.options.media,
            mediaType: _this.options.mediaType
        });
        _this.renderer = new renderer_js_1["default"]({
            container: _this.options.container,
            height: _this.options.height,
            waveColor: _this.options.waveColor,
            progressColor: _this.options.progressColor,
            minPxPerSec: _this.options.minPxPerSec
        });
        _this.initPlayerEvents();
        _this.initRendererEvents();
        _this.initTimerEvents();
        if (_this.options.url != null) {
            _this.load(_this.options.url, _this.options.channelData, _this.options.duration);
        }
        return _this;
    }
    /** Create a new WaveSurfer instance */
    WaveSurfer.create = function (options) {
        return new WaveSurfer(options);
    };
    WaveSurfer.prototype.initPlayerEvents = function () {
        var _this = this;
        this.subscriptions.push(this.player.on('timeupdate', function () {
            var currentTime = _this.getCurrentTime();
            _this.renderer.renderProgress(currentTime / _this.duration, _this.isPlaying());
            _this.emit('audioprocess', { currentTime: currentTime });
        }), this.player.on('play', function () {
            _this.emit('play');
        }), this.player.on('pause', function () {
            _this.emit('pause');
        }), this.player.on('canplay', function () {
            _this.emit('canplay');
        }), this.player.on('seeking', function () {
            _this.emit('seek', { time: _this.getCurrentTime() });
        }));
    };
    WaveSurfer.prototype.initRendererEvents = function () {
        var _this = this;
        // Seek on click
        this.subscriptions.push(this.renderer.on('click', function (_a) {
            var relativeX = _a.relativeX;
            var time = _this.getDuration() * relativeX;
            _this.seekTo(time);
        }));
    };
    WaveSurfer.prototype.initTimerEvents = function () {
        var _this = this;
        // The timer fires every 16ms for a smooth progress animation
        this.subscriptions.push(this.timer.on('tick', function () {
            if (_this.isPlaying()) {
                var currentTime = _this.getCurrentTime();
                _this.renderer.renderProgress(currentTime / _this.duration, true);
                _this.emit('audioprocess', { currentTime: currentTime });
            }
        }));
    };
    /** Unmount wavesurfer */
    WaveSurfer.prototype.destroy = function () {
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.plugins.forEach(function (plugin) { return plugin.destroy(); });
        this.timer.destroy();
        this.player.destroy();
        this.decoder.destroy();
        this.renderer.destroy();
    };
    /** Load an audio file by URL */
    WaveSurfer.prototype.load = function (url, channelData, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var audio, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.player.loadUrl(url);
                        if (!(channelData == null || duration == null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetcher.load(url)];
                    case 1:
                        audio = _a.sent();
                        return [4 /*yield*/, this.decoder.decode(audio)];
                    case 2:
                        data = _a.sent();
                        channelData = data.channelData;
                        duration = data.duration;
                        _a.label = 3;
                    case 3:
                        this.channelData = channelData;
                        this.duration = duration;
                        this.renderer.render(this.channelData, this.duration);
                        this.emit('ready', { duration: this.duration });
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Zoom in or out */
    WaveSurfer.prototype.zoom = function (minPxPerSec) {
        if (this.channelData == null || this.duration == null) {
            throw new Error('No audio loaded');
        }
        this.renderer.render(this.channelData, this.duration, minPxPerSec);
    };
    /** Start playing the audio */
    WaveSurfer.prototype.play = function () {
        this.player.play();
    };
    /** Pause the audio */
    WaveSurfer.prototype.pause = function () {
        this.player.pause();
    };
    /** Skip to a time position in seconds */
    WaveSurfer.prototype.seekTo = function (time) {
        this.player.seekTo(time);
    };
    /** Check if the audio is playing */
    WaveSurfer.prototype.isPlaying = function () {
        return this.player.isPlaying();
    };
    /** Get the duration of the audio in seconds */
    WaveSurfer.prototype.getDuration = function () {
        return this.duration;
    };
    /** Get the current audio position in seconds */
    WaveSurfer.prototype.getCurrentTime = function () {
        return this.player.getCurrentTime();
    };
    /** Register and initialize a plugin */
    WaveSurfer.prototype.registerPlugin = function (CustomPlugin) {
        var plugin = new CustomPlugin({
            wavesurfer: this,
            renderer: this.renderer
        });
        this.plugins.push(plugin);
        return plugin;
    };
    return WaveSurfer;
}(event_emitter_js_1["default"]));
exports.WaveSurfer = WaveSurfer;
exports["default"] = WaveSurfer;
