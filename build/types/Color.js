"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateColor = void 0;
var ColorIntensity;
(function (ColorIntensity) {
    ColorIntensity["LIGHT"] = "light";
    ColorIntensity["SEMI_DARK"] = "semi-dark";
    ColorIntensity["DARK"] = "dark";
})(ColorIntensity || (ColorIntensity = {}));
const COLOR_INTENSITIES = [
    ColorIntensity.LIGHT,
    ColorIntensity.SEMI_DARK,
    ColorIntensity.DARK,
];
function validateColor(color) {
    const { accountId, name, hex, red, green, blue, intensity, } = color;
    let error = '';
    if (!accountId || typeof accountId !== 'number') {
        error = '"accountId" is required';
    }
    if (!(name === null || name === void 0 ? void 0 : name.length)) {
        error = '"name" is empty';
    }
    if (!(hex === null || hex === void 0 ? void 0 : hex.length) || !hex.startsWith('#')) {
        error = '"hex" is invalid';
    }
    if (typeof red !== 'number' || red < 0 || red > 255) {
        error = '"red" is invalid';
    }
    if (typeof green !== 'number' || green < 0 || green > 255) {
        error = '"green" is invalid';
    }
    if (typeof blue !== 'number' || blue < 0 || blue > 255) {
        error = '"blue" is invalid';
    }
    if (!(intensity === null || intensity === void 0 ? void 0 : intensity.length) || !COLOR_INTENSITIES.includes(intensity)) {
        error = '"intensity" is invalid';
    }
    return {
        valid: !error,
        error,
    };
}
exports.validateColor = validateColor;
