

describe('angular-daterange', function(){

    describe('dateProcessor', function(){
        var dateProcessor = null;
        var first;
        var second;
        beforeEach(function () {
            var $injector = angular.injector(['ng', 'MyApp.directives']);
            dateProcessor = $injector.get('dateProcessor')
        });


        it('must be defined', function() {
            expect(typeof dateProcessor).toBe('object');
        });

        describe('isSame', function() {
            it('must return true when date is same', function() {
                var first = new Date(2013, 4, 5, 5);
                var second = new Date(2013, 4, 5, 9);
                expect(dateProcessor.isSame(first, second)).toBe(true);

                first = new Date(2013, 4, 5, 23, 45);
                second = new Date(2013, 4, 5, 9, 6, 6);
                expect(dateProcessor.isSame(first, second)).toBe(true);
            });

            it('must return false when date is not same', function() {
                first = new Date(2013, 4, 4, 5);
                second = new Date(2013, 4, 5, 5);
                expect(dateProcessor.isSame(first, second)).toBe(false);

                first = new Date(2013, 4, 5, 23, 45);
                second = new Date(2011, 4, 5, 23, 45);
                expect(dateProcessor.isSame(first, second)).toBe(false);
            });
        });

        describe('isBefore', function() {
            it('must return true when first date before second', function() {
                first = new Date(2013, 4, 5, 5);
                second = new Date(2013, 4, 6, 9);
                expect(dateProcessor.isBefore(first, second)).toBe(true);
            });

            it('must return false if date same', function() {
                first = new Date(2013, 4, 5, 5);
                second = new Date(2013, 4, 5, 9, 4, 5);
                expect(dateProcessor.isBefore(first, second)).toBe(false);
            });

            it('must return false if date after', function() {
                first = new Date(2013, 4, 6, 5);
                second = new Date(2013, 4, 5, 9, 4, 5);
                expect(dateProcessor.isBefore(first, second)).toBe(false);
            });
        });

        describe('isAfter', function() {
            it('must return false when first date before second', function() {
                first = new Date(2013, 4, 5, 5);
                second = new Date(2013, 4, 6, 9);
                expect(dateProcessor.isAfter(first, second)).toBe(false);
            });

            it('must return false if date same', function() {
                first = new Date(2013, 4, 5, 5);
                second = new Date(2013, 4, 5, 9, 4, 5);
                expect(dateProcessor.isAfter(first, second)).toBe(false);
            });

            it('must return true if date after', function() {
                first = new Date(2013, 4, 6, 5);
                second = new Date(2013, 4, 5, 9, 4, 5);
                expect(dateProcessor.isAfter(first, second)).toBe(true);
            });
        });

    });

});