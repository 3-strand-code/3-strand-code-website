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

    .config(function($locationProvider) {
      $locationProvider.hashPrefix('#').html5Mode(true);
    })

    .run(function($rootScope, $kinvey, ENV) {
      $rootScope.$kinvey = $kinvey;
      Stripe.setPublishableKey(ENV.STRIPE_PUBLISHABLE_KEY);
    })

    .controller('Controller', ['$scope', '$kinvey', '$http', '$interval', '$q',
      function($scope, $kinvey, $http, $interval, $q) {
        $scope.init = function() {
          $scope.user = $kinvey.getActiveUser();
          $scope.applicationErrors = [];
          $scope.isProcessingPayment = false;
          $scope.card = {
             //number: '4242 4242 4242 4242',
             //expMonth: '12',
             //expYear: 2015,
             //cvc: '232'
          };

          $scope.getPricing();

          $interval(function() {
            $scope.getPricing();
          }, 5000);
        };

        $scope.getPricing = function() {
          $http.get('/kinvey/pricing/')
            .success(function(data, status, headers, config) {
              $scope.pricing = data;
            })
            .error(function(data, status, headers, config) {
              console.error(data);
            });
        };

        $scope.$watch('card.number', function(newVal, oldVal) {
          if (newVal === undefined || oldVal === undefined) {
            return;
          }

          var reValidDigits = new RegExp(/^( *\d *){16}$/g);
          var isValidDigits = newVal.match(reValidDigits) || false;

          $scope.applicationForm.number.$setValidity('digit-count', isValidDigits);

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
          var digits = newVal.match(reDigits);
          var digitArray = digits ? digits.join('').split('') : null;

          // add a space every 4 digits
          if (digitArray.length < 16 && digitArray.length % 4 === 0) {
            $scope.card.number += ' ';
          }
        });

        $scope.submitPayment = function() {
          var user = $kinvey.getActiveUser();
          $scope.isProcessingPayment = true;
          $scope.applicationErrors = [];

          // return promise with activeUser or signup
          (function() {
            var deferred = $q.defer();
            deferred.resolve(user);

            return user ? deferred.promise : $scope.signup();
          }())

            // charge
            .then(function(activeUser) {
              var $form = jQuery('#application-form');
              var user = $kinvey.getActiveUser();
              console.log($form);

              Stripe.card.createToken($form, function(status, response) {
                console.log(status, response);

                if (response.error) {
                  $scope.applicationErrors.push(response.error.message);
                  user.paymentErrors.push({date: new Date().toUTCString(), message: response.error.message});
                  $scope.isProcessingPayment = false;
                  $kinvey.User.update(user);
                } else {
                  $http.post('/charge/', {
                    stripeToken: response.id, // response contains id and card, which contains additional card details
                    expMonth: $scope.applicationForm.expMonth,
                    expYear: $scope.applicationForm.expYear,
                    cvc: $scope.applicationForm.cvc,
                    amount: $scope.pricing.priceInCents.current,
                    description: user.first_name + ' ' + user.last_name + ' - ' + user.email
                  })
                    .success(function(charge) {
                      user.payments.push({date: new Date().toUTCString(), payment: charge});
                      $scope.isProcessingPayment = false;
                      $kinvey.User.update(user);
                    })
                    .error(function(err) {
                      user.paymentErrors.push({date: new Date().toUTCString(), message: err});
                      $kinvey.User.update(user);
                      $scope.isProcessingPayment = false;
                      $scope.applicationErrors.push(err);
                    });
                }
              });
            }, function(error) {
              if (error.name === 'UserAlreadyExists') {
                $scope.applicationErrors.push('That email is already registered.');
                $scope.isProcessingPayment = false;
              }
              return error;
            })

            .catch(function(err) {
              console.error(err);
            })
        };

        $scope.signup = function() {
          return $kinvey.User.signup({
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            email: $scope.user.email,
            username: $scope.user.email,
            payments: [],
            paymentErrors: []
          });
        };

        $scope.logout = function() {
          $kinvey.User.logout()
            .finally(function() {
              window.location.reload();
            });
        };

        $scope.init();
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
      appKey: ENV.KINVEY_APP_KEY,
      appSecret: ENV.KINVEY_APP_SECRET
    })
      .then(function(activeUser) {
        console.debug('Kinvey init success. User:', activeUser);

        $kinvey.ping().then(function(response) {
          console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
        }, function(error) {
          console.log('Kinvey Ping Failed. Response: ' + error.description);
        });

        angular.element(document).ready(function() {
          angular.bootstrap(document, ['App']);
        });

      }, function(err) {
        console.error('Kinvey init error', err);
      });
  }]);

}());
