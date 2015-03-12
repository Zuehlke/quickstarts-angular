/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

interface ILogicControllerScope {
    unload: () => void
}

class LogicController {
    constructor(private $scope: ILogicControllerScope, private moduleService: ModuleService) {
        $scope.unload = () => this.moduleService.removeModule("Logic Module");
    }
} 