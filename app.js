(function() {
    'use strict';

    angular.module('App', [
        // vendors
        'kinvey',

        // ours
        'App.env',
        'App.discount',

    ])
        
        .run(function($rootScope, $kinvey) {
            $rootScope.$kinvey = $kinvey;
        })

        .controller('Controller', [
            '$scope', '$kinvey',
            function($scope, $kinvey) {
                var vm = this;
                vm.user = {};
                vm.registrationErrors = [];

                vm.fillUser = function() {
                    vm.user.firstName = 'Levi';
                    vm.user.lastName = 'Thomason';
                    vm.user.email = 'me@levithomason.com';
                    vm.signup();
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
                                vm.registrationErrors = [];
                        }, function(error) {
                            if (error.name === 'UserAlreadyExists') {
                                vm.registrationErrors.push('That email is already registered.');
                            }
                            console.error(error);
                        });
                };

            }]);

    ////////////////////////////////////////////////////////
    //
    // bootstrap angular AFTER initializing kinvey
    //
    var $injector = angular.injector([
        'ng',
        'kinvey',
        'App.env',
        //'App.auth',
    ]);

    // We're outside of an angular module here, explicitly invoke ng-annotate
    // @ngInject

    $injector.invoke(['$kinvey', 'ENV', function initAndBootstrap($kinvey, ENV) {
        $kinvey.init({
            appKey: ENV.TSC_KINVEY_APP_KEY,
            appSecret: ENV.TSC_KINVEY_APP_SECRET
        })
            .then(function(activeUser) {
                console.debug('Kinvey init success');
                angular.bootstrap(document.documentElement, ['App']);
            }, function(err) {
                console.error('Kinvey init error');
                console.error(err);
            });
    }]);

}());
