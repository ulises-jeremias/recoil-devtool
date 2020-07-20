var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./core", "./util/helpers", "./defaults"], function (require, exports, core_1, helpers_1, defaults_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logger = exports.createLogger = exports.defaults = void 0;
    core_1 = __importDefault(core_1);
    defaults_1 = __importDefault(defaults_1);
    exports.defaults = defaults_1.default;
    /**
     * Creates logger with following options
     *
     * @namespace
     * @param {object} options - options for logger
     * @param {LogLevel} options.level - console[level]
     * @param {boolean} options.duration - print duration of each action?
     * @param {boolean} options.timestamp - print timestamp with each action?
     * @param {object} options.colors - custom colors
     * @param {object} options.logger - implementation of the `console` API
     * @param {Function} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
     * @param {Function} options.collapsed - is group collapsed?
     * @param {Function} options.predicate - condition which resolves logger behavior
     * @param {Function} options.stateTransformer - transform state before print
     * @param {Function} options.actionTransformer - transform action before print
     * @param {Function} options.errorTransformer - transform error before print
     *
     * @returns {Function} logger
     */
    var createLogger = function (options) {
        var loggerOptions = __assign(__assign({}, defaults_1.default), options);
        var logger = loggerOptions.logger, stateTransformer = loggerOptions.stateTransformer, errorTransformer = loggerOptions.errorTransformer, predicate = loggerOptions.predicate, logErrors = loggerOptions.logErrors, diffPredicate = loggerOptions.diffPredicate;
        // Return if 'console' object is not defined
        if (typeof logger === 'undefined') {
            return function (next) { return function () { return next(null); }; };
        }
        var logBuffer = [];
        return function (next) { return function (_a) {
            var prevState = _a.prevState, nextState = _a.nextState, action = _a.action;
            // Exit early if predicate function returns 'false'
            if (typeof predicate === 'function' && !predicate(prevState, action)) {
                return next(action);
            }
            var logEntry = {};
            logBuffer.push(logEntry);
            logEntry.started = helpers_1.timer.now();
            logEntry.startedTime = new Date();
            logEntry.prevState = stateTransformer(prevState);
            logEntry.action = action;
            var returnedValue;
            if (logErrors) {
                try {
                    returnedValue = next(action);
                }
                catch (e) {
                    logEntry.error = errorTransformer(e);
                }
            }
            else {
                returnedValue = next(action);
            }
            logEntry.took = helpers_1.timer.now() - logEntry.started;
            logEntry.nextState = stateTransformer(nextState);
            var diff = loggerOptions.diff && typeof diffPredicate === 'function'
                ? diffPredicate(nextState, action)
                : loggerOptions.diff;
            core_1.default(logBuffer, __assign(__assign({}, loggerOptions), { diff: diff }));
            logBuffer.length = 0;
            if (logEntry.error)
                throw logEntry.error;
            return returnedValue;
        }; };
    };
    exports.createLogger = createLogger;
    var defaultLogger = createLogger();
    exports.logger = defaultLogger;
    exports.default = defaultLogger;
});
