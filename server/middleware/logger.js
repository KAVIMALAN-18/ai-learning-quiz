const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'ai-learning-platform' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// If we're not in production then log to the `console` with colors
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

/**
 * Winston Request Logger Middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip
        });
    });
    next();
};

/**
 * Global Error Handler Middleware
 */
const errorLogger = (err, req, res, next) => {
    const status = err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    logger.error(`${err.message}`, {
        status,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
    });

    res.status(status).json({
        success: false,
        message: status === 500 && isProduction
            ? 'An unexpected system error occurred.'
            : err.message,
        ...(!isProduction && { stack: err.stack })
    });
};

module.exports = { requestLogger, errorLogger, logger };
