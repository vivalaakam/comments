var app = angular.module('app', ['ngRoute' , 'ngSanitize', 'templates-dist'])
        .config(['$routeProvider', '$locationProvider', '$httpProvider',
            function($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider
                        .when('/', {
                            controller: 'HomeCtrl',
                            templateUrl: 'views/home.html'
                        })
                        .otherwise({redirectTo: '/'});

            }]);
