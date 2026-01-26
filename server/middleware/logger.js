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
    const isProduction = process.env.NODE_ENV === "production";

    // Detailed logging for server-side monitoring
    console.error(`🚨 ERROR [${status}]: ${err.message}`);
    if (!isProduction) {
        console.error(err.stack);
    }

    // Mask sensitive details for production clients
    res.status(status).json({
        success: false,
        message: status === 500 && isProduction
            ? "An unexpected system error occurred. Our team has been notified."
            : err.message,
        // Only provide stack in development
        ...(!isProduction && { stack: err.stack })
    });
};

module.exports = { requestLogger, errorLogger };
