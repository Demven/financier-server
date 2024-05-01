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
exports.query = exports.disconnect = exports.connectToDatabase = void 0;
const pg_1 = require("pg");
const { NODE_ENV, POSTGRES_HOST, POSTGRES_USER, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, } = process.env;
let pool;
const connectionConfig = NODE_ENV === 'development'
    ? {
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE,
        password: POSTGRES_PASSWORD,
        port: POSTGRES_PORT,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
    : {
        connectionString: process.env.POSTGRES_URL
    };
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(`Connect to the database: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}...`);
        pool = new pg_1.Pool(connectionConfig);
        yield pool.connect();
        console.info('Connected.');
    });
}
exports.connectToDatabase = connectToDatabase;
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pool.end();
    });
}
exports.disconnect = disconnect;
function query(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, text, values = [] }, { doNotLogValues } = { doNotLogValues: false }) {
        console.info('Query', `"${name}"`, text, doNotLogValues ? '' : values);
        const client = yield pool.connect();
        const result = yield client.query({
            name,
            text,
            values,
        });
        client.release();
        return result;
    });
}
exports.query = query;
