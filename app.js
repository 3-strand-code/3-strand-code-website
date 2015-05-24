(function() {
  'use strict';

  angular.module('App', [
    // vendors
    'kinvey',

    // ours
    'App.env',
    'App.discount',
    'App.mentors',
    'App.navbar',
    'App.process',
    'App.faq',
  ])

    .run(function($rootScope, $kinvey, ENV) {
      $rootScope.$kinvey = $kinvey;

      Stripe.setPublishableKey(ENV.TSC_STRIPE_TEST_PUBLISHABLE_KEY);
    })

    .controller('Controller', ['$scope', '$kinvey', '$timeout', function($scope, $kinvey, $timeout) {
      $scope.user = {};
      $scope.applicationErrors = [];
      $scope.card = {
        number: '',
        expMonth: '',
        expYear: '',
        cvc: ''
      };

      $scope.$watch('card.number', function(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (
          newVal === undefined ||             // ignore undefined
          oldVal === undefined ||             // ignore undefined
          newVal.length === 0 ||              // ignore empty
          newVal.length < oldVal.length ||    // ignore backspace
          newVal[newVal.length - 1] === ' '   // ignore trailing space 
        ) {
          return;
        }

        var reDigits = new RegExp(/\d+/g);
        var reValidDigits = new RegExp(/^( *\d *){16}$/g);
        var digits = newVal.match(reDigits);
        var digitArray = digits ? digits.join('').split('') : null;
        var isValidDigits = digits ? newVal.match(reValidDigits) : false;

        $scope.applicationForm.number.$setValidity('digit-count', isValidDigits);

        // add a space every 4 digits
        if (digitArray.length < 16 && digitArray.length % 4 === 0) {
          $scope.card.number += ' ';
        }
      });

      $scope.submitPayment = function() {
        var $form = jQuery('#application-form');
        console.log($form);

        Stripe.card.createToken($form, function(status, response) {
          console.log(status, response);

          // Per Stripe Docs:

          if (response.error) {
            // Show the errors on the form
            $scope.applicationErrors.push(response.error.message);
          } else {
            // response contains id and card, which contains additional card details
            var token = response.id;
            // Insert the token into the form so it gets submitted to the server
            $form.append($('<input type="hidden" name="stripeToken" />').val(token));
            // and submit
            $form.get(0).submit();
          }
        });
      };

      $scope.signup = function() {
        $kinvey.User.signup({
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
          username: $scope.user.email,
        })
          .then(function(activeUser) {
            console.debug(activeUser);
            $scope.applicationErrors = [];
          }, function(error) {
            if (error.name === 'UserAlreadyExists') {
              $scope.applicationErrors.push('That email is already registered.');
            }
            console.error(error);
          });
      };
    }]);

  ////////////////////////////////////////////////////////
  // bootstrap angular AFTER initializing kinvey
  //
  var $injector = angular.injector([
    'ng',
    'kinvey',
    'App.env',
  ]);

  // We're outside of an angular module here, explicitly invoke ng-annotate
  // @ngInject

  $injector.invoke(['$kinvey', 'ENV', function initAndBootstrap($kinvey, ENV) {
    $kinvey.init({
      appKey: ENV.TSC_KINVEY_APP_KEY,
      appSecret: ENV.TSC_KINVEY_APP_SECRET
    })
      .then(function(activeUser) {
        console.debug('Kinvey init success. User:', activeUser);

        $kinvey.ping().then(function(response) {
          console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
        }, function(error) {
          console.log('Kinvey Ping Failed. Response: ' + error.description);
        });

        angular.bootstrap(document.documentElement, ['App']);

      }, function(err) {
        console.error('Kinvey init error', err);
      });
  }]);

}());
