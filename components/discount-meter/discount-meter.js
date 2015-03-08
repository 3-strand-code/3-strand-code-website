(function() {
    'use strict';

    angular.module('App')

        .directive('discountMeter', [
            '$interval',
            function($interval) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/discount-meter/discount-meter.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope._fullDiscount = 0.5;

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


                            scope.remainingDiscount = scope._fullDiscount * scope._remainingRate;

                            scope._markerBottom = scope._remainingRate * 100 + '%';

                        }, 30);

                        scope.discount = new Date();
                    }
                }
            }]);

}());
