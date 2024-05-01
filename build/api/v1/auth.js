"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accountService = __importStar(require("../../services/account"));
const { JWT_SECRET } = process.env;
const authRouter = (0, express_1.Router)();
const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = 7 * ONE_DAY;
function getToken(account) {
    return jsonwebtoken_1.default.sign({ id: account.id, email: account.email }, JWT_SECRET, { expiresIn: ONE_WEEK });
}
function decodeToken(token) {
    let decodedPayload;
    try {
        decodedPayload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        decodedPayload = null;
    }
    return decodedPayload;
}
authRouter.post('/sign-in', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email === null || email === void 0 ? void 0 : email.length) || !email.includes('@')) {
        return res.status(400).send('Email address is invalid');
    }
    else if ((password === null || password === void 0 ? void 0 : password.length) < 6) {
        return res.status(400).send('Password is invalid');
    }
    const account = yield accountService.findByEmailAndPassword(email, password);
    if (account && account.email === email) {
        return res.json({ token: getToken(account) });
    }
    else {
        return res.status(400).send('Wrong email or password');
    }
}));
authRouter.post('/validate-token', (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).send('You must provide a JWT token');
    }
    const tokenPayload = decodeToken(token);
    if (tokenPayload) {
        return res.json({ success: true, payload: tokenPayload });
    }
    else {
        return res.status(400).send('Invalid token');
    }
});
exports.default = authRouter;
