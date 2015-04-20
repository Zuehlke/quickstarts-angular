/// <reference path="../../vendor/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../common/logger.service.ts" />

module App {
    'use strict';

    import ILogger = Common.Services.ILogger;

    function extendExceptionHandler($delegate: ng.IExceptionHandlerService, logger: ILogger) {
        return (exception, cause) => {
            $delegate(exception, cause);
            var errorData = { exception: exception, cause: cause };

            var msg = 'Unhandled Exception occured: ' + exception.message;
            logger.logError(msg, errorData, "Global Exception handler");
        };
    }

    app.config([
        '$provide', ($provide) => {
            $provide.decorator('$exceptionHandler', ['$delegate', 'logger', extendExceptionHandler]);
        }
    ]);
}