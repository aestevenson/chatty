/*global io */
'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('chattyApp', ['chattyApp.services', 'chattyApp.directives', 'LocalStorageModule']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {controller: MainCtrl});
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);


app.run(["$rootScope", "localStorageService",
    function ($rootScope, localStorageService) {
        localStorageService.get('server');
           console.log('rootscope',$rootScope);
           console.log('localStorageService',localStorageService);
    }] );

