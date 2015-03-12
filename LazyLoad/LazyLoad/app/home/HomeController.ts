/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/oclazyload/oclazyload.d.ts"/>
/// <reference path="../NavigationService.ts"/>

interface IHomeControllerScope {
    onLoad: () => void
}

class HomeController {
    constructor(private $scope: IHomeControllerScope, private $ocLazyLoad: oc.ILazyLoad, private $state: ng.ui.IStateService, private navigationService: NavigationService) {
    }
} 