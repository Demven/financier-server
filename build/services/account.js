"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = exports.findByEmailAndPassword = void 0;
const dal_1 = require("../dal");
function findByEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, dal_1.query)({
            name: 'account-get-one-by-email-and-password',
            text: 'SELECT * FROM account WHERE "email"=$1 AND "password"=$2;',
            values: [email, password],
        }, { doNotLogValues: true })
            .then(({ rows: [account] }) => account);
    });
}
exports.findByEmailAndPassword = findByEmailAndPassword;
function findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, dal_1.query)({
            name: 'account-get-one-by-email-and-password',
            text: 'SELECT * FROM account WHERE "email"=$1;',
            values: [email],
        })
            .then(({ rows: [account] }) => account);
    });
}
exports.findByEmail = findByEmail;
