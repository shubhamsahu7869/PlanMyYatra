"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    res.status(404).json({ success: false, message: "Route not found" });
}
function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.statusCode || 500;
    const message = err.safeMessage || "An unexpected server error occurred";
    res.status(status).json({ success: false, message });
}
