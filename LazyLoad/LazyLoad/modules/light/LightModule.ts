/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

class LightModule {
    private static mod = new LightModule();  
    private module: ng.IModule;

    constructor() {
        this.module = angular.module("lightModule", ["app", "ui.router"]);
        this.registerControllers();
        this.registerFactories();
        this.registerDirectives();
        this.module.config([
            "$stateProvider", "$urlRouterProvider",
            ($stateProvider: ng.ui.IStateProvider) => {
                $stateProvider
                    .state("light", {
                    url: "/light",
                    templateUrl: "modules/light/light.html",
                    controller: "LightController"
                });
            }
        ]);

        this.module.run((navigationService: NavigationService) => {
            navigationService.menuItems.push({ state: "light", name: "Light", order: 50 });
        });

        (<any>this.module).unload = () => {
            console.log("Unload Light Module");
        };

    }

    private registerDirectives() {
    }

    private registerControllers() {
        this.module.controller("LightController", [
            "$scope", " moduleService", ($scope: ILightControllerScope, moduleService: ModuleService) => new LightController($scope, moduleService)]);
    }

    registerFactories() {
    }

}

