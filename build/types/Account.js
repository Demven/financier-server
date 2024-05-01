"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccount = exports.CurrencySymbol = exports.CurrencyType = exports.Language = void 0;
var Language;
(function (Language) {
    Language["ENGLISH"] = "en";
})(Language || (exports.Language = Language = {}));
const LANGUAGES = [Language.ENGLISH];
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["US_DOLLAR"] = "USD";
    CurrencyType["EURO"] = "EUR";
    CurrencyType["JAPANESE_YEN"] = "JPU";
    CurrencyType["POUND_STERLING"] = "GPB";
    CurrencyType["AUSTRALIAN_DOLLAR"] = "AUD";
    CurrencyType["CANADIAN_DOLLAR"] = "CAD";
    CurrencyType["SWISS_FRANC"] = "CHF";
})(CurrencyType || (exports.CurrencyType = CurrencyType = {}));
const CURRENCY_TYPES = [
    CurrencyType.US_DOLLAR,
    CurrencyType.EURO,
    CurrencyType.JAPANESE_YEN,
    CurrencyType.POUND_STERLING,
    CurrencyType.AUSTRALIAN_DOLLAR,
    CurrencyType.CANADIAN_DOLLAR,
    CurrencyType.SWISS_FRANC,
];
var CurrencySymbol;
(function (CurrencySymbol) {
    CurrencySymbol["US_DOLLAR"] = "$";
    CurrencySymbol["EURO"] = "\u20AC";
    CurrencySymbol["JAPANESE_YEN"] = "\u00A5";
    CurrencySymbol["POUND_STERLING"] = "\u00A3";
    CurrencySymbol["AUSTRALIAN_DOLLAR"] = "$";
    CurrencySymbol["CANADIAN_DOLLAR"] = "$";
    CurrencySymbol["SWISS_FRANC"] = "";
})(CurrencySymbol || (exports.CurrencySymbol = CurrencySymbol = {}));
const CURRENCY_SYMBOLS = [
    CurrencySymbol.US_DOLLAR,
    CurrencySymbol.EURO,
    CurrencySymbol.JAPANESE_YEN,
    CurrencySymbol.POUND_STERLING,
    CurrencySymbol.AUSTRALIAN_DOLLAR,
    CurrencySymbol.CANADIAN_DOLLAR,
    CurrencySymbol.SWISS_FRANC,
];
function validateAccount(account) {
    const { firstName, lastName, email, language, currencyType, currencySymbol, } = account;
    let error = '';
    if (!(firstName === null || firstName === void 0 ? void 0 : firstName.length)) {
        error = '"firstName" is empty';
    }
    if (!(lastName === null || lastName === void 0 ? void 0 : lastName.length)) {
        error = '"lastName" is empty';
    }
    if (!(email === null || email === void 0 ? void 0 : email.length)) {
        error = '"email" is empty';
    }
    else if ((email === null || email === void 0 ? void 0 : email.length) < 6) {
        error = '"email" is too short';
    }
    else if (!email.includes('@')) {
        error = '"email" is invalid';
    }
    if (!(language === null || language === void 0 ? void 0 : language.length) || !LANGUAGES.includes(language)) {
        error = '"language" is invalid';
    }
    if (!(currencyType === null || currencyType === void 0 ? void 0 : currencyType.length) || !CURRENCY_TYPES.includes(currencyType)) {
        error = '"currencyType" is invalid';
    }
    if (!(currencySymbol === null || currencySymbol === void 0 ? void 0 : currencySymbol.length) || !CURRENCY_SYMBOLS.includes(currencySymbol)) {
        error = '"currencySymbol" is invalid';
    }
    return {
        valid: !error,
        error,
    };
}
exports.validateAccount = validateAccount;
