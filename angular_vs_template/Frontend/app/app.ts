/// <reference path="../../vendor/DefinitelyTyped/angularjs/angular.d.ts" />

module App {
    "use strict";

    export var app: ng.IModule = angular.module("app", [
        "ui.router",
        "templates-app",
        "common"
    ]);
}