"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationChain = exports.processAuthError = exports.authorization = void 0;
const express_jwt_1 = require("express-jwt");
const { JWT_SECRET } = process.env;
// the decoded token payload will be available as req.auth object
exports.authorization = (0, express_jwt_1.expressjwt)({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
});
const processAuthError = (error, req, res, next) => {
    if (error.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized access');
    }
    else {
        next();
    }
};
exports.processAuthError = processAuthError;
exports.authorizationChain = [
    exports.authorization,
    exports.processAuthError,
];
