(function() {
    'use strict';

    angular.module('App.mentors', [])

        .directive('mentors', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/mentors/mentors.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope.mentorList = angular.element('.mentors .mentor');

                        scope.setHeights = function() {
                            // only resize if mentor widths have changed
                            if (scope.mentorWidth === scope.mentorList.first().width()) {
                                return;
                            }

                            scope.mentorWidth = scope.mentorList.first().width();
                            
                            angular.forEach(scope.mentorList, function(item) {
                                var picture = angular.element(item);

                                picture.height(scope.mentorWidth);
                            });
                        };

                        angular.element(window).on('resize', function() {
                            scope.setHeights();
                        });

                        scope.setHeights();
                    }
                };
            }]);

}());
