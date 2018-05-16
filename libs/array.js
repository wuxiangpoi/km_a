function find(that, match) {
    for (var i = 0, l = that.length; i < l; i++) {
        if (match(that[i])) {
            return that[i];
        }
    }
    return null;
}

function remove(that, item) {
    for (var i = that.length - 1; i >= 0; i--) {
        if (that[i] === item) {
            that.splice(i, 1);
        }
    }
}

function clear(that) {
    that.splice(0, that.length);
}

function defaultConverter(item) {
    return item;
}

function max(that, converter) {
    var len = that.length;
    if (len === 0) {
        return null;
    }
    converter = converter || defaultConverter;
    var pointer = that[0];
    var max = converter(pointer);
    for (var i = 1; i < len; i++) {
        var thisPointer = that[i];
        var cur = converter(thisPointer);
        if (max < cur) {
            pointer = thisPointer;
            max = cur;
        }
    }
    return pointer;
}

function min(that, converter) {
    var len = that.length;
    if (len === 0) {
        return null;
    }
    converter = converter || defaultConverter;
    var pointer = that[0];
    var min = converter(pointer);
    for (var i = 1; i < len; i++) {
        var thisPointer = that[i];
        var cur = converter(thisPointer);
        if (min > cur) {
            pointer = thisPointer;
            min = cur;
        }
    }
    return pointer;
}

//数组去重复
function unique(that, converter) {
    converter = converter || defaultConverter;
    var arr = [];
    for (var i = 0, len = that.length; i < len; i++) {
        var cur = that[i];
        var cur_convert = converter(cur);
        if (arr.every(function (item) {
                return converter(item) !== cur_convert;
            })) {
            arr.push(cur);
        }
    }
    return arr;
}

module.exports = {
    find: find,
    remove: remove,
    clear: clear,
    max: max,
    min: min,
    unique: unique
};