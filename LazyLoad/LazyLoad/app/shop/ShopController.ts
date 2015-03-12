/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/oclazyload/oclazyload.d.ts"/>
/// <reference path="../../scripts/typings/linq/linq.d.ts"/>
/// <reference path="../NavigationService.ts"/>
/// <reference path="../ModuleService.ts"/>


interface IShopControllerScope {
    $watch(rowcollection: string, p: (newVal: IModule[]) => void, ret: boolean): any;
    selected: IModule;
    onBuy: () => void;
    buyDisabled: boolean;
    rowCollection: IModule[];
    deleteDisabled: boolean;
    onDelete: () => void;
}

class ShopController {
    constructor(private $scope: IShopControllerScope, private moduleService: ModuleService) {

        $scope.rowCollection = moduleService.modules;

        $scope.$watch("rowCollection",(newVal: IModule[]) => {
            $scope.buyDisabled = true;
            $scope.deleteDisabled = true;
            $scope.selected = Enumerable.From(newVal).FirstOrDefault(null,(r: IModule) => r.isSelected);
            if ($scope.selected && !$scope.selected.isFixed) {
                $scope.buyDisabled = $scope.selected.isInstalled;
                $scope.deleteDisabled = !$scope.selected.isInstalled;
            }
        }, true);

        $scope.onBuy = () => {
            if ($scope.selected && $scope.selected.config) {
                moduleService.loadModule($scope.selected);
                moduleService.saveModules();
            }
        };

        $scope.onDelete = () => {
            if ($scope.selected && $scope.selected.config) {
                moduleService.unloadModule($scope.selected);
                moduleService.saveModules();
            }
        };
    }
}

angular.module('app').controller('ShopController', ["$scope", "moduleService", ($scope: IShopControllerScope, moduleService: ModuleService) => new ShopController($scope, moduleService)]);
