interface IMenuItem {
    state: string;
    name: string;
    order: number;
}

interface INavigationService {
    menuItems: IMenuItem[];
}

class NavigationService implements INavigationService {
    menuItems: IMenuItem[];

    constructor() {
        this.menuItems = [{ state: "home", name: "Home", order: 10 }, { state: "about", name: "About", order: 100  }];
    }
} 