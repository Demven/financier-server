"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategory = void 0;
function validateCategory(category) {
    const { accountId, name, colorId, } = category;
    let error = '';
    if (!accountId || typeof accountId !== 'number') {
        error = '"accountId" is required';
    }
    if (!(name === null || name === void 0 ? void 0 : name.length)) {
        error = '"name" is empty';
    }
    if (!colorId) {
        error = '"colorId" is required';
    }
    return {
        valid: !error,
        error,
    };
}
exports.validateCategory = validateCategory;
