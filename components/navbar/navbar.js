(function() {
    'use strict';

    angular.module('App.navbar', [])

        .directive('navbar', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/navbar/navbar.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope.doc = angular.element(document);
                        scope.navbar = angular.element('.tsc-navbar');
                        scope.triggerEle = angular.element('.jumbotron h1');
                        scope.breakPoint = scope.triggerEle.offset().top - scope.navbar.outerHeight();

                        scope.updateOpaque = function() {
                            scope.isOpaque = scope.doc.scrollTop() < scope.breakPoint;
                            scope.navbar.toggleClass('tsc-navbar-transparent', scope.isOpaque);
                        };

                        scope.brandClicked = function() {
                            var navItems = angular.element('.tsc-navbar li');
                            
                            navItems.removeClass('active');
                        };
                        
                        scope.navClicked = function(event) {
                            var clickedElement = angular.element(event.target).parent();
                            var activeElement = angular.element('.active');

                            activeElement.removeClass('active');
                            clickedElement.addClass('active');
                        };

                        angular.element(document).on('scroll', function() {
                            scope.updateOpaque();
                        });
                    }
                };
            }]);

}());
