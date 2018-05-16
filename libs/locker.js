function execHandlers(handlers) {
    for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i].call(this);
    }
}

function Locker() {
    this._isLocked = false;
    this._lockHandlers = [];
    this._releaseHandlers = [];
}

Locker.prototype = {
    execOnce: function (handler) {//锁定执行(可携带任意多个参数)
        if (!this._isLocked) {
            this._isLocked = true;
            execHandlers.call(this, this._lockHandlers);

            var args = [];
            for (var i = 1, len = arguments.length; i < len; i++) {
                args.push(arguments[i]);
            }
            handler.apply(this, args);
        }
    },
    release: function () {
        if (this._isLocked) {
            this._isLocked = false;
            execHandlers.call(this, this._releaseHandlers);
        }
    },
    onLocked: function (fn) {
        this._lockHandlers.push(fn);
        return this;
    },
    onReleased: function (fn) {
        this._releaseHandlers.push(fn);
        return this;
    }
};

Locker.prototype.constructor = Locker;


module.exports = Locker;
