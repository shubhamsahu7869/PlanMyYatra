"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const db_1 = require("./config/db");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const configuredOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];
const isAllowedOrigin = (origin) => {
    if (!origin)
        return true;
    if (configuredOrigins.includes(origin))
        return true;
    return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
};
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/trips", tripRoutes_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);
(0, db_1.connectDatabase)();
exports.default = app;
