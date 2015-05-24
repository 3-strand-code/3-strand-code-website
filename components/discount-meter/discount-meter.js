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
                    }
                };
            }]);

}());
