"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIncome = void 0;
function validateIncome(income) {
    const { accountId, name, dateString, year, month, week, amount, } = income;
    let error = '';
    if (!accountId || typeof accountId !== 'number') {
        error = '"accountId" is required';
    }
    if (!(name === null || name === void 0 ? void 0 : name.length)) {
        error = '"name" is empty';
    }
    if (!(dateString === null || dateString === void 0 ? void 0 : dateString.length) || dateString.split('-').length !== 3) {
        error = '"dateString" is invalid';
    }
    if (typeof year !== 'number' || String(year).length !== 4) {
        error = '"year" is invalid';
    }
    if (typeof month !== 'number' || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(month)) {
        error = '"month" is invalid';
    }
    if (typeof week !== 'number' || ![1, 2, 3, 4].includes(week)) {
        error = '"week" is invalid';
    }
    if (typeof amount !== 'number') {
        error = '"amount" is invalid';
    }
    return {
        valid: !error,
        error,
    };
}
exports.validateIncome = validateIncome;
