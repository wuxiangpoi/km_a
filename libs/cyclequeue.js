//循环队列
function CycleQueue(arr, isClone) {
    if (isClone === true) {
        this._arr = arr.map(function (item) {
            return item;
        });
    } else {
        this._arr = arr;
    }
    this._index = arr.length - 1;
}

CycleQueue.prototype = {
    current: function () {//取当前位置，指针不变
        return this._arr[this._index];
    },
    getPrev: function (step) {//获取前一个，指针不变
        step = step || -1;
        return this.get(step);
    },
    getNext: function (step) {//获取后一个，指针不变
        step = step || 1;
        return this.get(step);
    },
    get: function (step) {//获取指定个数的值，负数则向前，指针不变
        var arr = this._arr;
        var len = arr.length;
        var index = ((this._index + step) % len + len) % len;
        return arr[index];
    },
    skipPrev: function (step) {//取前一个，并将指针前移
        step = step || -1;
        return this.skipTo(step);
    },
    skipNext: function (step) {//取后一个，并将指针后移
        step = step || 1;
        return this.skipTo(step);
    },
    skipTo: function (step) {
        var arr = this._arr;
        var len = arr.length;
        var index = ((this._index + step) % len + len) % len;
        this._index = index;
        return arr[index];
    }
};

CycleQueue.prototype.constructor = CycleQueue;

module.exports = CycleQueue;