"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const account_1 = __importDefault(require("./account"));
const category_1 = __importDefault(require("./category"));
const color_1 = __importDefault(require("./color"));
const expense_1 = __importDefault(require("./expense"));
const income_1 = __importDefault(require("./income"));
const saving_1 = __importDefault(require("./saving"));
const investment_1 = __importDefault(require("./investment"));
const authorization_1 = require("../middleware/authorization");
const v1Router = (0, express_1.Router)();
v1Router.get('/status', (req, res) => {
    res.send('Status: running');
});
v1Router.use('/auth', auth_1.default);
v1Router.use('/account', authorization_1.authorizationChain, account_1.default);
v1Router.use('/category', authorization_1.authorizationChain, category_1.default);
v1Router.use('/color', authorization_1.authorizationChain, color_1.default);
v1Router.use('/expense', authorization_1.authorizationChain, expense_1.default);
v1Router.use('/income', authorization_1.authorizationChain, income_1.default);
v1Router.use('/saving', authorization_1.authorizationChain, saving_1.default);
v1Router.use('/investment', authorization_1.authorizationChain, investment_1.default);
exports.default = v1Router;
