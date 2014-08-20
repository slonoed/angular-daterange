'use strict';
angular.module('slonoed.daterange', [])
    .service('slDateProcessor', function() {
        this.isSame = function(f, s) {

            f = new Date(f._d || f);
            f.setSeconds(0);
            f.setMilliseconds(0);
            f.setMinutes(0);
            f.setHours(0);
            s = new Date(s._d || s);
            s.setSeconds(0);
            s.setMilliseconds(0);
            s.setMinutes(0);
            s.setHours(0);
            return f.getTime() == s.getTime();
        };

        this.isBefore = function(f, s) {
            f = new Date(f._d || f);
            f.setSeconds(0);
            f.setMilliseconds(0);
            f.setMinutes(0);
            f.setHours(0);
            s = new Date(s._d || s);
            s.setSeconds(0);
            s.setMilliseconds(0);
            s.setMinutes(0);
            s.setHours(0);
            return f.getTime() < s.getTime();
        };

        this.isAfter = function(f, s) {

            f = new Date(f._d || f);
            f.setSeconds(0);
            f.setMilliseconds(0);
            f.setMinutes(0);
            s = new Date(s._d || s);
            s.setSeconds(0);
            s.setMilliseconds(0);
            s.setMinutes(0);
            return f.getTime() > s.getTime();
        };

        this.one = 1;
    })
    .directive('slDaterange', ['$document', function($document) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'startDateRaw': '=start',
                'endDateRaw': '=finish'
            },
            transclude: true,
            templateUrl: 'daterange.html',
            link: function(scope, element, attrs) {
                scope.active = false;


                scope.apply = function() {
                    scope.startDateRaw = scope.startDate.toDate();
                    scope.endDateRaw = scope.endDate.toDate();
                    scope.active = false;
                };

                scope.clearRange = function() {
                    scope.startDate = moment(scope.startDateRaw).startOf('day');
                    scope.endDate = moment(scope.endDateRaw);

                    // if end date not start of day - get next day start timestamp
                    if (!scope.endDate.isSame(scope.endDate.startOf('day'))) {
                        scope.endDate = scope.endDate.add(1, 'day').startOf('day');
                    }
                };

                scope.cancel = function() {
                    scope.clearRange();
                    scope.active = false;
                };

                scope.toggle = function() {
                    scope.active = !scope.active;
                    // update date after open
                    if (scope.active) {
                        scope.clearRange();
                    }
                };

                scope.clearRange();
            }
        };
    }])
    .directive('slCalendar', ['slDateProcessor', function(dateProcessor) {
        var locale = {
            applyLabel: 'Apply',
            clearLabel: "Clear",
            fromLabel: 'From',
            toLabel: 'To',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: moment().localeData()._weekdaysMin, 
            monthNames: moment().localeData()._monthsShort,
            firstDay: 0
        };

        var calendars = {};

        function buildCalendar(month, year, side) {
            var cacheKey = month + ' + ' + year;
            if (calendars[cacheKey]) {
                return calendars[cacheKey];
            }

            var firstDay = moment([year, month, 1]);
            var lastMonth = moment(firstDay).subtract('month', 1).month();
            var lastYear = moment(firstDay).subtract('month', 1).year();

            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + locale.firstDay + 1;
            if (startDay > daysInLastMonth) {
                startDay -= 7;
            }

            if (dayOfWeek == locale.firstDay) {
                startDay = daysInLastMonth - 6;
            }

            var curDate;
            if (side == 'right') {
                curDate = moment([lastYear, lastMonth, startDay]).endOf('day');
            } else {
                curDate = moment([lastYear, lastMonth, startDay]).startOf('day');
            }
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('day', 1)) {
                if (i > 0 && col % 7 == 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate;
            }

            calendars[cacheKey] = calendar;
            return calendar;

        }



        return {
            restrict: 'E',
            replace: true,
            scope: {
                startDate: '=sdate',
                endDate: '=edate'
            },
            templateUrl: 'calendar.html',
            link: function(scope, element, attrs) {
                scope.left = attrs.left === '';


                scope.inRange = function(date) {
                    return (dateProcessor.isAfter(date, scope.startDate) && dateProcessor.isBefore(date, scope.endDate)) ||
                        dateProcessor.isSame(date, scope.startDate) || dateProcessor.isSame(date, scope.endDate);
                };

                scope.getDayNumber = function(day) {
                    return day.date();
                };

                scope.isOff = function(day) {
                    var anotherMonth = day.month() != scope.current.month();
                    var beforeStartInRight = !scope.left && dateProcessor.isBefore(day, scope.startDate);
                    return anotherMonth || beforeStartInRight;
                };

                scope.updateCalendar = function() {
                    var calendar = buildCalendar(scope.current.month(), scope.current.years(), 1);
                    scope.calendar = calendar;
                    scope.monthName = locale.monthNames[scope.current.month()] + scope.current.format(" YYYY");
                };


                scope.isActive = function(day) {
                    // on left calendar check with startDate, on right - with endDate
                    if (scope.left) {
                        return dateProcessor.isSame(day, scope.startDate)
                    }
                    else {
                        return dateProcessor.isSame(day, scope.endDate)
                    }
                };


                scope.locale = locale;
                scope.daysOfWeek = moment().localeData()._weekdaysMin;


                scope.current = moment([scope.startDate.year(), scope.startDate.month(), 1]);

                scope.updateCalendar();

                scope.pickDate = function(date) {
                    if (!scope.left && date.isBefore(scope.startDate)) {
                        return;
                    }
                    if (scope.left && dateProcessor.isAfter(date, scope.endDate)) {
                        scope.startDate = date;
                        scope.endDate = scope.startDate.clone().add(1, 'day');
                    }
                    scope[scope.left ? 'startDate' : 'endDate'] = date;
                };

                scope.setPrevMonth = function() {
                    scope.current.subtract('month', 1);
                    scope.updateCalendar();
                };
                scope.setNextMonth = function() {
                    scope.current.add('month', 1);
                    scope.updateCalendar();
                };

            }
        };
    }])
