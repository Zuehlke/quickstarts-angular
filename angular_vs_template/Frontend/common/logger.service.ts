/// <reference path="../../vendor/DefinitelyTyped/angularjs/angular.d.ts" />

module Common.Services {
    'use strict';

    export interface ILogger {
        logInfo(message: string, data: any, source: string)
        logError(message: string, data: any, source: string)
        logWarning(message: string, data: any, source: string)
    }

    enum LogLevel {
        ERROR,
        WARNING,
        INFO
    }

    //Wrapper arounf Angular $log service.
    //If we want to log to a file or a database we can change the destination here.
    //we could show a toast notification in browser as well
    class Logger implements ILogger {
        private $log: ng.ILogService;

        constructor($log) {
            this.$log = $log;
        }

        logInfo(message: string, data: any, source: string) {
            this.logIt(message, data, source, LogLevel.INFO);
        }

        logWarning(message: string, data: any, source: string) {
            this.logIt(message, data, source, LogLevel.WARNING);
        }

        logError(message: string, data: any, source: string) {
            this.logIt(message, data, source, LogLevel.ERROR);
        }

        private logIt(message: string, data: any, source: string, logLevel: LogLevel) {
            source = source ? '[' + source + '] ' : '';

            if (logLevel === LogLevel.ERROR) {
                this.$log.error(source, message, data);
            } else if (logLevel === LogLevel.WARNING) {
                this.$log.warn(source, message, data);
            } else {
                this.$log.info(source, message, data);
            }
        }
    }

    common.factory('logger', ['$log', ($log) => new Logger($log)]);
} 