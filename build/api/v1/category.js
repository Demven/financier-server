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
const Category_1 = require("../../types/Category");
const categoryRouter = (0, express_1.Router)();
categoryRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, dal_1.query)({
        name: 'category-get-all',
        text: 'SELECT * FROM category',
    })
        .then(({ rows }) => rows);
    res.json(categories);
}));
categoryRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, name, description, colorId, } = req.body;
    const { valid, error } = (0, Category_1.validateCategory)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const category = yield (0, dal_1.query)({
        name: 'category-put',
        text: `INSERT INTO "category" ("accountId","name","description","colorId","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,now(),now())
           RETURNING *;`,
        values: [accountId, name, description, colorId],
    })
        .then(({ rows: [category] }) => category)
        .catch(next);
    return res.json(category);
}));
categoryRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, accountId, name, description, colorId, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Category_1.validateCategory)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const categoryUpdated = yield (0, dal_1.query)({
        name: 'category-post',
        text: `UPDATE "category"
           SET "accountId"=$2,
               "name"=$3,
               "description"=$4,
               "colorId"=$5,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, accountId, name, description, colorId],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: categoryUpdated === true,
    });
}));
categoryRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const categoryDeleted = yield (0, dal_1.query)({
        name: 'category-delete',
        text: `DELETE FROM "category"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: categoryDeleted === true,
    });
}));
exports.default = categoryRouter;
