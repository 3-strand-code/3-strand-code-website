(function() {
    'use strict';
    
    angular.module('App', [])

        .controller('Controller', ['$scope', function ($scope) {
        
            $scope.foo = 'bar';
        
        }]);
    
}());
