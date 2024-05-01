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
const Expense_1 = require("../../types/Expense");
const expenseRouter = (0, express_1.Router)();
expenseRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield (0, dal_1.query)({
        name: 'expense-get-all',
        text: 'SELECT * FROM expense',
    })
        .then(({ rows }) => rows);
    res.json(expenses);
}));
expenseRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, name, categoryId, dateString, year, month, week, amount, } = req.body;
    const { valid, error } = (0, Expense_1.validateExpense)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const expense = yield (0, dal_1.query)({
        name: 'expense-put',
        text: `INSERT INTO "expense" ("accountId","name","categoryId","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
        values: [accountId, name, categoryId, dateString, year, month, week, amount],
    })
        .then(({ rows: [expense] }) => expense)
        .catch(next);
    return res.json(expense);
}));
expenseRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, accountId, name, categoryId, dateString, year, month, week, amount, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Expense_1.validateExpense)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const expenseUpdated = yield (0, dal_1.query)({
        name: 'expense-post',
        text: `UPDATE "expense"
           SET "accountId"=$2,
               "name"=$3,
               "categoryId"=$4,
               "dateString"=$5,
               "year"=$6,
               "month"=$7,
               "week"=$8,
               "amount"=$9,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, accountId, name, categoryId, dateString, year, month, week, amount],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: expenseUpdated === true,
    });
}));
expenseRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const expenseDeleted = yield (0, dal_1.query)({
        name: 'expense-delete',
        text: `DELETE FROM "expense"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: expenseDeleted === true,
    });
}));
exports.default = expenseRouter;
