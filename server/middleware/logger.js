/**
 * Simple Request Logger Middleware
 * Logs method, path, and response time to the console
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method;
        const url = req.originalUrl;

        // Choose icon based on status
        const icon = status >= 400 ? "❌" : status >= 300 ? "🟡" : "✅";

        console.log(`${icon} ${method} ${status} ${url} - ${duration}ms`);
    });
    next();
};

/**
 * Global Error Handler Middleware
 * Centralizes error logging and ensures consistent client responses
 */
const errorLogger = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // Log the error detail for developers (safe from client view)
    console.error(`🚨 ERROR [${status}]: ${message}`);
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    res.status(status).json({
        success: false,
        message: status === 500 && process.env.NODE_ENV === "production"
            ? "An unexpected error occurred. Please try again later."
            : message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

module.exports = { requestLogger, errorLogger };
