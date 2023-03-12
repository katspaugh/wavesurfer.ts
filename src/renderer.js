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
exports.__esModule = true;
var event_emitter_js_1 = require("./event-emitter.js");
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        var container = null;
        if (typeof _this.options.container === 'string') {
            container = document.querySelector(_this.options.container);
        }
        else if (_this.options.container instanceof HTMLElement) {
            container = _this.options.container;
        }
        if (!container) {
            throw new Error('Container not found');
        }
        var div = document.createElement('div');
        var shadow = div.attachShadow({ mode: 'open' });
        shadow.innerHTML = "\n      <style>\n        :host .scroll {\n          overflow-x: auto;\n          overflow-y: visible;\n          user-select: none;\n          width: 100%;\n          height: ".concat(_this.options.height, "px;\n          position: relative;\n        }\n        :host .wrapper {\n          position: relative;\n          width: fit-content;\n          min-width: 100%;\n          height: 100%;\n          z-index: 2;\n        }\n        :host canvas {\n          display: block;\n          height: 100%;\n          min-width: 100%;\n          image-rendering: pixelated;\n        }\n        :host .progress {\n          position: absolute;\n          z-index: 2;\n          top: 0;\n          left: 0;\n          height: 100%;\n          pointer-events: none;\n          clip-path: inset(100%);\n        }\n        :host .cursor {\n          position: absolute;\n          z-index: 3;\n          top: 0;\n          left: 0;\n          height: 100%;\n          border-right: 1px solid ").concat(_this.options.progressColor, ";\n        }\n      </style>\n\n      <div class=\"scroll\">\n        <div class=\"wrapper\">\n          <canvas></canvas>\n          <canvas class=\"progress\"></canvas>\n          <div class=\"cursor\"></div>\n        </div>\n      </div>\n    ");
        _this.container = div;
        _this.shadowRoot = shadow;
        _this.mainCanvas = shadow.querySelector('canvas');
        _this.progressCanvas = shadow.querySelector('.progress');
        _this.cursor = shadow.querySelector('.cursor');
        container.appendChild(div);
        _this.mainCanvas.addEventListener('click', function (e) {
            var rect = _this.mainCanvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var relativeX = x / rect.width;
            _this.emit('click', { relativeX: relativeX });
        });
        return _this;
    }
    Renderer.prototype.destroy = function () {
        this.container.remove();
    };
    Renderer.prototype.render = function (channels, duration, minPxPerSec) {
        if (minPxPerSec === void 0) { minPxPerSec = this.options.minPxPerSec; }
        var ctx = this.mainCanvas.getContext('2d', { desynchronized: true });
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        var devicePixelRatio = window.devicePixelRatio;
        var width = Math.max(this.container.clientWidth * devicePixelRatio, duration * minPxPerSec);
        var height = this.options.height;
        this.mainCanvas.width = width;
        this.mainCanvas.height = height;
        this.mainCanvas.style.width = Math.round(width / devicePixelRatio) + 'px';
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        // Draw left channel in the top half of the canvas
        var leftChannel = channels[0];
        var prevX = -1;
        var prevY = 0;
        for (var i = 0; i < leftChannel.length; i++) {
            var x = Math.round((i / leftChannel.length) * width);
            var y = Math.round(((1 - leftChannel[i]) * height) / 2);
            if (x !== prevX || y > prevY) {
                ctx.lineTo(x, y);
                prevX = x;
                prevY = y;
            }
        }
        // Draw right channel in the bottom half of the canvas
        var isMono = channels.length === 1;
        var rightChannel = isMono ? leftChannel : channels[1];
        prevX = -1;
        prevY = 0;
        for (var i = rightChannel.length - 1; i >= 0; i--) {
            var x = Math.round((i / rightChannel.length) * width);
            var y = Math.round(((1 + rightChannel[i]) * height) / 2);
            if (x !== prevX || (isMono ? y < -prevY : y > prevY)) {
                ctx.lineTo(x, y);
                prevX = x;
                prevY = y;
            }
        }
        ctx.strokeStyle = ctx.fillStyle = this.options.waveColor;
        ctx.stroke();
        ctx.fill();
        var progressCtx = this.progressCanvas.getContext('2d', { desynchronized: true });
        if (!progressCtx) {
            throw new Error('Failed to get canvas context');
        }
        this.progressCanvas.width = this.mainCanvas.width;
        this.progressCanvas.height = this.mainCanvas.height;
        this.progressCanvas.style.width = this.mainCanvas.style.width;
        this.progressCanvas.style.height = this.mainCanvas.style.height;
        progressCtx.drawImage(this.mainCanvas, 0, 0);
        progressCtx.globalCompositeOperation = 'source-in';
        progressCtx.fillStyle = this.options.progressColor;
        progressCtx.fillRect(0, 0, this.progressCanvas.width, this.progressCanvas.height);
    };
    Renderer.prototype.renderProgress = function (progress, autoCenter) {
        if (autoCenter === void 0) { autoCenter = false; }
        this.progressCanvas.style.clipPath = "inset(0 ".concat(100 - progress * 100, "% 0 0)");
        this.cursor.style.left = "".concat(progress * 100, "%");
        if (autoCenter) {
            var center = this.container.clientWidth / 2;
            var fullWidth = this.mainCanvas.clientWidth;
            if (fullWidth * progress >= center) {
                this.container.scrollLeft = fullWidth * progress - center;
            }
        }
    };
    Renderer.prototype.getContainer = function () {
        return this.shadowRoot.querySelector('.scroll');
    };
    return Renderer;
}(event_emitter_js_1["default"]));
exports["default"] = Renderer;
