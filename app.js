(function() {
    'use strict';

    angular.module('App', [
        // vendors
        'kinvey',

        // ours
        'App.env',
        'App.discount',

    ])

        .controller('Controller', ['$scope', function($scope) {


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
                .then(function (activeUser) {
                    console.debug('Kinvey init success');
                    angular.bootstrap(document.documentElement, ['App']);
                }, function (err) {
                    console.error('Kinvey init error');
                    console.error(err);
                });
        }]);

}());
