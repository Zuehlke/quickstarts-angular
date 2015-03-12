/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

class RadiatorModule {
    private static mod = new RadiatorModule(); 
    private module: ng.IModule;

    constructor() {
        this.module = angular.module("radiatorModule", ["app", "ui.router"]);
        this.registerControllers();
        this.registerFactories();
        this.registerDirectives();
        this.module.config([
            "$stateProvider", "$urlRouterProvider",
            ($stateProvider: ng.ui.IStateProvider) => {
                $stateProvider
                    .state("radiator", {
                    url: "/radiator",
                    templateUrl: "modules/radiator/radiator.html",
                    controller: "RadiatorController"
                    });
            }
        ]);

        this.module.run((navigationService: NavigationService) => {
            navigationService.menuItems.push({ state: "radiator", name: "Radiator", order: 20 });
        });

        (<any>this.module).unload = () => {
            console.log("Unload Radiaator Module");
        };

    }

    private registerDirectives() {
    }

    private registerControllers() {
        this.module.controller("RadiatorController", [
            "$scope", "moduleService", ($scope: IRadiatorControllerScope, moduleService: ModuleService) => new RadiatorController($scope, moduleService)]);
    }

    registerFactories() {
    }
}