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

        .controller('Controller', [
            '$scope', '$kinvey',
            function($scope, $kinvey) {
                var vm = this;
                vm.user = {};
                vm.applicationErrors = [];
                
                vm.submitPayment = function() {
                    var $form = jQuery('#application-form');
                    console.log($form);

                    Stripe.card.createToken($form, function(status, response) {
                        console.log(status, response);

                        // Per Stripe Docs:
                        //
                        // if (response.error) {
                        //     // Show the errors on the form
                        //     $form.find('.payment-errors').text(response.error.message);
                        //     $form.find('button').prop('disabled', false);
                        // } else {
                        //     // response contains id and card, which contains additional card details
                        //     var token = response.id;
                        //     // Insert the token into the form so it gets submitted to the server
                        //     $form.append($('<input type="hidden" name="stripeToken" />').val(token));
                        //     // and submit
                        //     $form.get(0).submit();
                        // }
                    });
                };

                vm.signup = function() {
                    $kinvey.User.signup({
                        firstName: vm.user.firstName,
                        lastName: vm.user.lastName,
                        email: vm.user.email,
                        username: vm.user.email,
                    })
                        .then(function(activeUser) {
                            console.debug(activeUser);
                            vm.applicationErrors = [];
                        }, function(error) {
                            if (error.name === 'UserAlreadyExists') {
                                vm.applicationErrors.push('That email is already registered.');
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
