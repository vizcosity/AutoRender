var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _DEFAULT_OUTPUT_TEMPLATE = {
    "module": "@nexrender/action-encode",
    "output": "foobar.mp4",
    "preset": "mp4",
    "params": { "-vcodec": "libx264", "-r": 25 }
};
var createAction = function (_a) {
    var outputName = _a.outputName, _b = _a.preset, preset = _b === void 0 ? "mp4" : _b, _c = _a.framerate, framerate = _c === void 0 ? 29.97 : _c, params = _a.params;
    return __assign(__assign({}, _DEFAULT_OUTPUT_TEMPLATE), { output: outputName, preset: preset, params: __assign(__assign(__assign({}, _DEFAULT_OUTPUT_TEMPLATE.params), { "-r": framerate }), params) });
};
module.exports = {
    createAction: createAction
};
//# sourceMappingURL=action-encode.js.map