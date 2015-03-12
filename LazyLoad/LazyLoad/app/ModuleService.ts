/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../scripts/typings/oclazyload/oclazyload.d.ts"/>
/// <reference path="../scripts/typings/angular-local-storage/angular-local-storage.d.ts"/>

interface IModuleInfo {
    name: string;
}

interface IModule extends IModuleInfo {
    isInstalled?: boolean;
    installed?: string;
    isSelected?: boolean;
    isFixed?: boolean;
    config?: oc.ILazyLoadModuleConfig;
}

class ModuleService {
    modules: IModule[];
    enumMods: linq.Enumerable<IModule>;

    constructor(private $ocLazyLoad: oc.ILazyLoad, private localStorageService: ng.local.storage.ILocalStorageService<IModuleInfo[]>, private $window: ng.IWindowService) {
        this.modules = [
            {
                name: "Light Module",
                isInstalled: false,
                config: {
                    name: "lightModule",
                    files: ["modules/light/LightModuleBundle.js"]
                }
            },
            {
                name: "Radiator Module",
                isInstalled: false,
                config: {
                    name: "radiatorModule",
                    files: ["modules/radiator/RadiatorModuleBundle.js"]
                }
            },
            {
                name: "Logic Module",
                isInstalled: false,
                config: {
                    name: "logicModule",
                    files: ["modules/logic/LogicModuleBundle.js"]
                }
            }
        ];

        this.enumMods = Enumerable.From(this.modules);
    }

    public init() {
        var x = this.localStorageService.get("InstalledModules");
        if (x) {
            for (var i = 0; i < x.length; i++) {
                var modInfo = x[i];
                var mod = this.enumMods.FirstOrDefault(null, item => item.name == modInfo.name);
                this.loadModule(mod);
            }
        }

        this.saveModules();
    }

    public saveModules() {
        var list = this.enumMods.Where((x: IModule) => x.isInstalled).Select((y: IModuleInfo) => y).ToArray();
        this.localStorageService.set("InstalledModules", list);
    }

    public loadModule(mod: IModule) {
        if (mod) {
            if (mod.config) {
                this.$ocLazyLoad.load(mod.config);
            }
            mod.isInstalled = true;
            mod.installed = mod.isFixed ? " (installed fixed)" : " (installed)";
        }
    }

    public removeModule(name: string) {
        var mod = this.enumMods.FirstOrDefault(null, item => item.name == name);
        if (mod != null) {
            this.unloadModule(mod);
        }
    }

    public unloadModule(selected: IModule) {
        if (selected) {
            selected.isInstalled = false;
            selected.installed = "";
            var mod = angular.module(selected.config.name);
            if (mod) {
                (<any>mod).unload();
            }
            this.saveModules();

            //this.$window.location.href = "/index.html";
            this.$window.location.reload();
        }
    }
} 