"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const dal_1 = require("./dal");
const v1_1 = __importDefault(require("./api/v1"));
const { NODE_ENV, PORT = '3000', } = process.env;
(0, dal_1.connectToDatabase)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// if (NODE_ENV === 'development') {
//   app.use(cors());
// } else {
//   app.use(cors({ origin: /\.thefinancier\.app$/ }));
// }
if (NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.secure) {
            next();
        }
        else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}
app.get('/', (request, response) => {
    response.send('Status: running');
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use('/v1', v1_1.default);
// Optional fallthrough error handler
app.use((error, req, res, next) => {
    if (error.message) {
        console.error('Caught error: ', error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
    else {
        next();
    }
});
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
exports.default = app;
