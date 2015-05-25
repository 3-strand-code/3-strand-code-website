(function() {
  'use strict';

  angular.module('App.faq', [])

    .directive('faq', [
      '$interval', '$filter', '$kinvey', '$http',
      function($interval, $filter, $kinvey, $http) {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'components/faq/faq.html',
          scope: {},
          link: function(scope, elem, attrs) {
            scope.levisNumber = '(208) 699-4042';
            scope.isSending = false;
            scope.emailError = false;
            scope.emailResponse = '';
            scope.email = {
              body: '',
              from: '',
            };

            scope.sendEmail = function() {
              scope.isSending = true;
              $http.post('/kinvey/contact/', {
                text_body: scope.email.body,
                from: scope.email.from
              })
                .success(function(data, status, headers, config) {
                  scope.isSending = false;
                  scope.emailResponse = data;
                })
                .error(function(data, status, headers, config) {
                  scope.isSending = false;
                  scope.emailError = true;
                  console.error(data);
                });
            }
          }
        };
      }]);

}());
