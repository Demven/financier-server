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
const Income_1 = require("../../types/Income");
const incomeRouter = (0, express_1.Router)();
incomeRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomes = yield (0, dal_1.query)({
        name: 'income-get-all',
        text: 'SELECT * FROM income',
    })
        .then(({ rows }) => rows);
    res.json(incomes);
}));
incomeRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, name, dateString, year, month, week, amount, } = req.body;
    const { valid, error } = (0, Income_1.validateIncome)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const income = yield (0, dal_1.query)({
        name: 'income-put',
        text: `INSERT INTO "income" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
        values: [accountId, name, dateString, year, month, week, amount],
    })
        .then(({ rows: [income] }) => income)
        .catch(next);
    return res.json(income);
}));
incomeRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, accountId, name, dateString, year, month, week, amount, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Income_1.validateIncome)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const incomeUpdated = yield (0, dal_1.query)({
        name: 'income-post',
        text: `UPDATE "income"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "amount"=$8,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, accountId, name, dateString, year, month, week, amount],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: incomeUpdated === true,
    });
}));
incomeRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const incomeDeleted = yield (0, dal_1.query)({
        name: 'income-delete',
        text: `DELETE FROM "income"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: incomeDeleted === true,
    });
}));
exports.default = incomeRouter;
