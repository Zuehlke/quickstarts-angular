/// <reference path="../../vendor/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../vendor/DefinitelyTyped/angular-ui-router/angular-ui-router.d.ts" />

module App {
    'use strict';

    function routeConfigurator($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
        $stateProvider.state("home", {
            url: "/home",
            templateUrl: "home/home.tpl.html",
            controller: "HomeCtrl",
            controllerAs: "vm"
        });
    }

    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);
}