/// <reference path="../../../vendor/DefinitelyTyped/angularjs/angular.d.ts" />

module App.Home.Controllers {
    "use strict";

    export interface IHomeCtrl {
        title: string;
    }

    export class HomeCtrl implements IHomeCtrl {
        private $http: ng.IHttpService;
        title: string = "";

        constructor($http: ng.IHttpService, logger: Common.Services.ILogger) {
            this.$http = $http;
            this.$http.get('api/default/greeting')
                .success((data: string) => this.title = data)
                .error((error: any) => logger.logError("Error retrieving data!", error, ""));
        }
    }

    // register with angular
    app.controller("HomeCtrl", ['$http', 'logger', HomeCtrl]);
}