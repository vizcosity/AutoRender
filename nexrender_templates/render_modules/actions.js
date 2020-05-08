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
var uuid = require('uuid-random');
var path = require('path');
var _DEFAULT_ACTION_ENCODE_TEMPLATE = {
    "module": "@nexrender/action-encode",
    "output": "foobar.mp4",
    "preset": "mp4",
    "params": { "-vcodec": "libx264", "-r": 25 }
};
var _DEFAULT_ACTION_COPY_TEMPLATE = {
    "module": "@nexrender/action-copy",
    "output": "foo.bar"
};
var createCopyAction = function (_a) {
    var _b = _a.outputName, outputName = _b === void 0 ? "untitled_output_" + uuid().split('-')[0] + ".mp4" : _b;
    return __assign(__assign({}, _DEFAULT_ACTION_COPY_TEMPLATE), { output: outputName });
};
var createEncodeAction = function (_a) {
    var _b = _a.outputName, outputName = _b === void 0 ? "untitled_output_" + uuid().split('-')[0] + ".mp4" : _b, _c = _a.preset, preset = _c === void 0 ? "mp4" : _c, _d = _a.framerate, framerate = _d === void 0 ? 29.97 : _d, params = _a.params;
    return __assign(__assign({}, _DEFAULT_ACTION_ENCODE_TEMPLATE), { output: outputName + ".mp4", preset: preset, params: __assign(__assign(__assign({}, _DEFAULT_ACTION_ENCODE_TEMPLATE.params), { "-r": framerate }), params) });
};
module.exports = {
    createCopyAction: createCopyAction,
    createEncodeAction: createEncodeAction
};
//# sourceMappingURL=actions.js.map