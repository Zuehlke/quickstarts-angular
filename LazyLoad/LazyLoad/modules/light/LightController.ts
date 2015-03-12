/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

interface ILightControllerScope {
    unload: () => void
}

class LightController {
    constructor(private $scope: ILightControllerScope, private moduleService: ModuleService) {
        $scope.unload = () => this.moduleService.removeModule("Light Module");
    }
}  