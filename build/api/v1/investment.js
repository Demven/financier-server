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
const Investment_1 = require("../../types/Investment");
const investmentRouter = (0, express_1.Router)();
investmentRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const investments = yield (0, dal_1.query)({
        name: 'investment-get-all',
        text: 'SELECT * FROM investment',
    })
        .then(({ rows }) => rows);
    res.json(investments);
}));
investmentRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, name, dateString, year, month, week, ticker, shares, pricePerShare, } = req.body;
    const { valid, error } = (0, Investment_1.validateInvestment)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const investment = yield (0, dal_1.query)({
        name: 'investment-put',
        text: `INSERT INTO "investment" ("accountId","name","dateString","year","month","week","ticker","shares","pricePerShare","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())
           RETURNING *;`,
        values: [accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
    })
        .then(({ rows: [investment] }) => investment)
        .catch(next);
    return res.json(investment);
}));
investmentRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, accountId, name, dateString, year, month, week, ticker, shares, pricePerShare, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Investment_1.validateInvestment)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const investmentUpdated = yield (0, dal_1.query)({
        name: 'investment-post',
        text: `UPDATE "investment"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "ticker"=$8,
               "shares"=$9,
               "pricePerShare"=$10,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: investmentUpdated === true,
    });
}));
investmentRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const investmentDeleted = yield (0, dal_1.query)({
        name: 'investment-delete',
        text: `DELETE FROM "investment"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: investmentDeleted === true,
    });
}));
exports.default = investmentRouter;
