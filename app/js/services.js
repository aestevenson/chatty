'use strict';

/* Services */
angular.module('chattyApp.services', []).
    value('version', '0.1').
    factory('socket', function ($rootScope) {
        var socket;
        // Connect to the socket server and listen for message, count, and history events.
        $rootScope.$on('socket:connect', function (event, payload) {
            var ip = 'http://' + payload.serverIp;
            socket = io.connect(ip);

            socket.on('message', function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    // broadcast the event to AngularJS scopes
                    $rootScope.$broadcast('socket:message', args[0]);
                });
            });

            socket.on('count', function(payload) {
                $rootScope.$broadcast('socket:count', payload.count);
            });

            socket.on('history', function(payload) {
               $rootScope.$broadcast('socket:history', payload);
            });
        });

        $rootScope.$on('socket:emit', function (event, payload) {
            socket.emit('message', payload);
        });
        return {}
    });
