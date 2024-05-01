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
const Color_1 = require("../../types/Color");
const colorRouter = (0, express_1.Router)();
colorRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const colors = yield (0, dal_1.query)({
        name: 'color-get-all',
        text: 'SELECT * FROM color',
    })
        .then(({ rows }) => rows);
    res.json(colors);
}));
colorRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, name, hex, red, green, blue, intensity, } = req.body;
    const { valid, error } = (0, Color_1.validateColor)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const color = yield (0, dal_1.query)({
        name: 'color-put',
        text: `INSERT INTO "color" ("accountId","name","hex","red","green","blue","intensity","custom","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
        values: [accountId, name, hex, red, green, blue, intensity, true], // all new colors are "custom" by default
    })
        .then(({ rows: [color] }) => color)
        .catch(next);
    return res.json(color);
}));
colorRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, accountId, name, hex, red, green, blue, intensity, } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const { valid, error } = (0, Color_1.validateColor)(req.body);
    if (!valid) {
        return res.json({
            success: false,
            error,
        });
    }
    const colorUpdated = yield (0, dal_1.query)({
        name: 'color-post',
        text: `UPDATE "color"
           SET "accountId"=$2,
               "name"=$3,
               "hex"=$4,
               "red"=$5,
               "green"=$6,
               "blue"=$7,
               "intensity"=$8,
               "updatedAt"=now()
           WHERE id=$1;`,
        values: [id, accountId, name, hex, red, green, blue, intensity],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: colorUpdated === true,
    });
}));
colorRouter.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({
            success: false,
            error: `"id" is required`,
        });
    }
    const colorDeleted = yield (0, dal_1.query)({
        name: 'color-delete',
        text: `DELETE FROM "color"
           WHERE id=$1;`,
        values: [id],
    })
        .then(({ rowCount }) => rowCount === 1)
        .catch(next);
    return res.json({
        success: colorDeleted === true,
    });
}));
exports.default = colorRouter;
