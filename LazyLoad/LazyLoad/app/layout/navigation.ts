/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../NavigationService.ts"/>

interface INavigationScope extends ng.IScope {
    menuItems: IMenuItem[]
}

class Navigation {
    constructor(private $scope: INavigationScope, private $rootScope: any, private navigationService : NavigationService)
    {
        $scope.menuItems = navigationService.menuItems;
    }
}