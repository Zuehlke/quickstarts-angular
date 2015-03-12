/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts"/>
/// <reference path="../scripts/typings/oclazyload/oclazyload.d.ts"/>
/// <reference path="../scripts/typings/angular-local-storage/angular-local-storage.d.ts"/>
/// <reference path="./layout/navigation.ts"/>
/// <reference path="./ModuleService.ts"/>
/// <reference path="./NavigationService.ts"/>
/// <reference path="./home/HomeController.ts"/>

class MyApp {
    private static myapp = new MyApp();
    private app: ng.IModule;

    constructor() {
        this.app = angular.module("app", ["ui.router", "ngAnimate", "ui.bootstrap", "ui.select", "ngSanitize", "oc.lazyLoad", "smart-table", "LocalStorageModule"]);
        this.registerFactories();
        this.registerDirectives();
        this.registerControllers();

        this.app.config([
            "$stateProvider", "$urlRouterProvider", "$ocLazyLoadProvider", "localStorageServiceProvider",
            ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $ocLazyLoadProvider: oc.ILazyLoadProvider, localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider) => {
                $urlRouterProvider.otherwise("/home");

                $stateProvider
                    .state("home", {
                    url: "/home",
                    templateUrl: "app/home/home.html",
                    controller: "HomeController"
                })

                    .state("shop", {
                    url: "/shop",
                    views: {
                        "": {
                            controller: "ShopController", // This view will use ShopController loaded below in the resolve
                            templateUrl: "app/shop/shop.html"
                        }
                    },
                    resolve: {
                        // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: [
                            "$ocLazyLoad", $ocLazyLoad => $ocLazyLoad.load({
                                name: "app",
                                cache: false,
                                files: ["app/shop/ShopController.js"]
                            }) // you can lazy load files for an existing module
                        ]
                    }
                })

                    .state("about", {
                    url: "/about",
                    templateUrl: "app/about/about.html"
                });

                localStorageServiceProvider.setPrefix('LazyLoad');
            }
        ]);

        this.app.run((moduleService: ModuleService) => {
            moduleService.init();
        });
    }

    registerFactories() {
        this.app.factory("navigationService", [() => new NavigationService()]);
        this.app.factory("moduleService", ["$ocLazyLoad", "localStorageService", "$window", ($ocLazyLoad, localStorageService, $window) => new ModuleService($ocLazyLoad, localStorageService, $window)]);
    }

    private registerDirectives() {
    }

    private registerControllers() {
        this.app.controller("Navigation", ["$scope", "$rootScope", "navigationService", ($scope, $rootScope, navigationService) => new Navigation($scope, $rootScope, navigationService)]);
        this.app.controller("HomeController", ["$scope", "$ocLazyLoad", "$state", "navigationService", ($scope, $ocLazyLoad, $state, navigationService) => new HomeController($scope, $ocLazyLoad, $state, navigationService)]);
    }
}