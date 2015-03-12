(function() {
    'use strict';

    angular.module('App.discount', [])

        .directive('discountMeter', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/discount-meter/discount-meter.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope.initialized = false;

                        scope._meterTop = '100%';

                        scope.discounts = {
                            total: 1,
                            remaining: 0,
                        };

                        scope.updateMeter = function() {
                            $http.get('/kinvey/discounts/')
                                .success(function(data, status, headers, config) {
                                    scope.initialized = true;
                                    scope.discounts = data.discounts;
                                    scope._meterTop = (1 - scope.discounts.remaining / scope.discounts.total) * 100 + '%';
                                })
                                .error(function(data, status, headers, config) {
                                    console.error(data);
                                });
                        };

                        scope.updateMeter();
                        
                        $interval(function() {
                            scope.updateMeter();
                        }, 5000);
                        
                        // Time based discount, deprecated

                        //scope._fullDiscount = 50;
                        //
                        //scope._startDate = new Date(2015, 2, 7);
                        //scope._endDate = new Date(2015, 2, 31);
                        //scope._discountPeriod = scope._endDate - scope._startDate;
                        //
                        //$interval(function() {
                        //    scope._now = new Date();
                        //    scope._remainingPeriod = scope._endDate - scope._now;
                        //    scope._remainingRate = scope._remainingPeriod / scope._discountPeriod;
                        //
                        //    if (scope._remainingRate > 1) {
                        //        scope._remainingRate = 1;
                        //    }
                        //
                        //    scope._remainingDiscount = scope._fullDiscount * scope._remainingRate;
                        //
                        //    // separate whole numbers and decimal values
                        //    // todo: whole number is busted, 46.000 never rolled to 45.999 but stayed at 46.999
                        //    scope.discountWholeNumbers = Math.floor($filter('number')(scope._remainingDiscount, 2));
                        //    scope.discountDecimalNumbers = String(scope._remainingDiscount).split('.')[1].substr(0, 6);
                        //
                        //    scope._markerTop = 100 * (1 - scope._remainingRate) + '%';
                        //
                        //}, 30);
                        //
                        //scope.discount = new Date();
                    }
                };
            }]);

}());
