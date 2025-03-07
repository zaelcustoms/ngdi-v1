"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const pretty_json_1 = require("hono/pretty-json");
const secure_headers_1 = require("hono/secure-headers");
const error_handler_1 = require("../middleware/error-handler");
const rate_limit_1 = require("../middleware/rate-limit");
const config_1 = require("../config");
const index_1 = __importDefault(require("./auth/index"));
const user_routes_new_1 = require("./user.routes.new");
const swagger_1 = require("../config/swagger");
const zod_1 = require("zod");
// Global middlewares
swagger_1.app.use("*", (0, logger_1.logger)());
swagger_1.app.use("*", (0, pretty_json_1.prettyJSON)());
swagger_1.app.use("*", (0, secure_headers_1.secureHeaders)());
// Apply CORS
swagger_1.app.use("*", (0, cors_1.cors)({
    origin: config_1.config.corsOrigins,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
// Apply rate limiting
swagger_1.app.use("*", rate_limit_1.standardRateLimit);
swagger_1.app.use("/auth/*", rate_limit_1.authRateLimit);
// Set up error handling
swagger_1.app.onError((err, c) => {
    console.error("API Error:", err);
    if (err instanceof error_handler_1.ApiError) {
        return c.json({
            success: false,
            message: err.message,
            errors: err.errors,
        }, err.status);
    }
    // Handle other errors
    const status = err &&
        typeof err === "object" &&
        "status" in err &&
        typeof err.status === "number"
        ? err.status
        : 500;
    return c.json({
        success: false,
        message: err.message || "Internal Server Error",
    }, status);
});
// Register routes
swagger_1.app.route("/auth", index_1.default);
swagger_1.app.route("/users", user_routes_new_1.userRouter);
swagger_1.app.route("/admin/users", user_routes_new_1.adminRouter);
// Health check route
const healthCheckResponse = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
swagger_1.app.openapi({
    method: "get",
    path: "/",
    tags: ["System"],
    summary: "Health Check",
    description: "Check if the backend is running",
    responses: {
        200: {
            description: "Backend is running",
            content: {
                "application/json": {
                    schema: healthCheckResponse,
                },
            },
        },
    },
}, (c) => c.json({
    success: true,
    message: "Backend is running",
}));
exports.default = swagger_1.app;
