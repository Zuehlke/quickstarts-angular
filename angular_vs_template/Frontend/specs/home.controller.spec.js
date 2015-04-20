describe('HomeCtrl', function () {
    var controller;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller) {
        controller = $controller('HomeCtrl');
    }));

    it('should have title property defined', function () {
        expect(controller.title).toBeDefined();
    });
});
