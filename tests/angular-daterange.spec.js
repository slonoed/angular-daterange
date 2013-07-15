

describe('angular-daterange', function(){

    describe('dateProcessor', function(){
        var dateProcessor = null;
        beforeEach(function () {
            var $injector = angular.injector(['ng', 'MyApp.directives']);
            dateProcessor = $injector.get('dateProcessor')
        });


        it('must be defined', function() {
            expect(typeof dateProcessor).toBe('object');
        });

    });

});