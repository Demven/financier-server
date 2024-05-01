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
const express_1 = require("express");
const dal_1 = require("../../dal");
const Account_1 = require("../../types/Account");
const accountRouter = (0, express_1.Router)();
accountRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accounts = yield (0, dal_1.query)({
        name: 'account-get-all',
        text: 'SELECT * FROM account',
    })
        .then(({ rows }) => rows)
        .then((accounts) => accounts.map(account => (Object.assign(Object.assign({}, account), { password: '***' }))));
    res.json(accounts);
}));
accountRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, language, currencyType, currencySymbol, } = req.body;
    if (!password) {
        return res.json({
            success: false,
            error: '"password" is required',
        });
    }
    const { valid, error } = (0, Account_1.validateAccount)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const account = yield (0, dal_1.query)({
        name: 'account-put',
        text: `INSERT INTO "account" ("firstName","lastName","email","password","language","currencyType","currencySymbol","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
        values: [firstName, lastName, email, password, language, currencyType, currencySymbol],
    }, { doNotLogValues: true })
        .then(({ rows: [account] }) => account)
        .catch(next);
    return res.json(account);
}));
accountRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, firstName, lastName, email, language, currencyType, currencySymbol, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Account_1.validateAccount)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const accountUpdated = yield (0, dal_1.query)({
        name: 'account-post',
        text: `UPDATE "account"
           SET "firstName"=$2,
               "lastName"=$3,
               "email"=$4,
               "language"=$5,
               "currencyType"=$6,
               "currencySymbol"=$7,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, firstName, lastName, email, language, currencyType, currencySymbol],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: accountUpdated === true,
    });
}));
accountRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const accountDeleted = yield (0, dal_1.query)({
        name: 'account-delete',
        text: `DELETE FROM "account"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: accountDeleted === true,
    });
}));
exports.default = accountRouter;
