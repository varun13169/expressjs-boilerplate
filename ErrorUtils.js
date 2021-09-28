const util = require('util');
const uuid = require('uuid');

const ErrorUtils = function(status, errorType, message, stackTrace) {
    this.status = status;
    this.errorType = errorType;
    this.message = message;
    this.stackTrace = stackTrace;
    this.additionalInfo = '';
    this.debudId = null;
}
util.inherits(ErrorUtils, Error);

ErrorUtils.prototype.setDebugId = function(id) {
    thid.debudId = id
}

ErrorUtils.prototype.sendErr = function (res) {
    // @todo: nullify stackTrace 
    res.status(this.status);
    res.json({
        status: this.status,
        errorType: this.errorType,
        message: this.message,
        stackTrace: this.stackTrace,
        additionalInfo: this.additionalInfo,
    });
};

ErrorUtils.errorHandler = function(err, req, res, next) {
    let debudId = uuid.v1();
    // check if response is already sent
    if(res.headersSent) {
        res.end();
    }
    else {
        if(err instanceof ErrorUtils) {
            err.setDebugId(debudId);
            err.sendErr(res);
        }
        else {
            // @todo: beautify stackTrace
            // @todo: make sensible SOME_ERROR_TYPE and status
            new ErrorUtils(200, 'SOME_ERROR_TYPE', err.message, err.stackTrace)
            .setDebugId(debudId)
            .sendErr(res);
        }
    }
    next();
}

module.exports = ErrorUtils;