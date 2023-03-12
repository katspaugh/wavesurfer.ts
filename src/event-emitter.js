"use strict";
exports.__esModule = true;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.eventTarget = new EventTarget();
    }
    EventEmitter.prototype.emit = function (eventType, detail) {
        var e = new CustomEvent(String(eventType), { detail: detail });
        this.eventTarget.dispatchEvent(e);
    };
    /** Subscribe to an event and return a function to unsubscribe */
    EventEmitter.prototype.on = function (eventType, callback) {
        var _this = this;
        var handler = function (e) {
            if (e instanceof CustomEvent) {
                callback(e.detail);
            }
        };
        var eventName = String(eventType);
        this.eventTarget.addEventListener(eventName, handler);
        return function () { return _this.eventTarget.removeEventListener(eventName, handler); };
    };
    return EventEmitter;
}());
exports["default"] = EventEmitter;
