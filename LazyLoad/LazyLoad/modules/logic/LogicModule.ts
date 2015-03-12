/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

class LogicModule {
    private static mod = new LogicModule();
    private module: ng.IModule;

    constructor() {
        this.module = angular.module("logicModule", ["app", "ui.router"]);
        this.registerControllers();
        this.registerFactories();
        this.registerDirectives();
        this.module.config([
            "$stateProvider", "$urlRouterProvider",
            ($stateProvider: ng.ui.IStateProvider) => {
                $stateProvider
                    .state("logic", {
                    url: "/logic",
                    templateUrl: "modules/logic/logic.html",
                    controller: "LogicController"
                });
            }
        ]);

        this.module.run((navigationService: NavigationService) => {
            navigationService.menuItems.push({ state: "logic", name: "Logic", order: 30 });
        });

        (<any>this.module).unload = () => {
            console.log("Unload Logic Module");
        };

    }

    private registerDirectives() {
    }

    private registerControllers() {
        this.module.controller("LogicController", [
            "$scope", "moduleService", ($scope: ILogicControllerScope, moduleService: ModuleService) => new LogicController($scope, moduleService)]);
    }

    registerFactories() {
    }
}