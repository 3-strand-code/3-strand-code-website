(function() {
    'use strict';

    angular.module('App')

        .directive('discountMeter', [
            '$interval', '$filter',
            function($interval, $filter) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/discount-meter/discount-meter.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope._fullDiscount = 50;

                        scope._startDate = new Date(2015, 2, 7);
                        scope._endDate = new Date(2015, 2, 31);
                        scope._discountPeriod = scope._endDate - scope._startDate;

                        $interval(function() {
                            scope._now = new Date();
                            scope._remainingPeriod = scope._endDate - scope._now;
                            scope._remainingRate = scope._remainingPeriod / scope._discountPeriod;

                            if (scope._remainingRate > 1) {
                                scope._remainingRate = 1;
                            }

                            scope._remainingDiscount = scope._fullDiscount * scope._remainingRate;

                            // separate whole numbers and decimal values
                            scope.discountWholeNumbers = Math.floor($filter('number')(scope._remainingDiscount, 2));
                            scope.discountDecimalNumbers = String(scope._remainingDiscount).split('.')[1].substr(0, 6);

                            scope._markerTop = 100 * (1 - scope._remainingRate) + '%';

                        }, 30);

                        scope.discount = new Date();
                    }
                };
            }]);

}());
