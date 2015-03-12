/// <reference path="../../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../scripts/typings/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../app/NavigationService.ts" />

interface IRadiatorControllerScope {
    unload: () => void
}

class RadiatorController {
    constructor(private $scope: IRadiatorControllerScope, private moduleService: ModuleService) {
        $scope.unload = () => this.moduleService.removeModule("Radiator Module");
   }
 }