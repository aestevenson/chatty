'use strict';

/* jasmine specs for controllers go here */
describe('ChattyChatChat Controllers', function () {

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });


    beforeEach(module('chattyApp'));


    describe('MainCtrl Test', function () {
        var $scope = null;
        var controller = null;
        var mockSocketService = {
            connect : function(ip) {
                // doing nothing!
            }
        }
        var mockLocalStorageService = {

            get : function(whatToGet) {
                return whatToGet + ' is gotten.';
            }

        }

        /* IMPORTANT!
         * this is where we're setting up the $scope and
         * calling the controller function on it, injecting
         * all the important bits, like our mock services*/
        beforeEach(inject(function($rootScope, $controller) {
            //create a scope object for us to use.
            $scope = $rootScope.$new();

            //now run that scope through the controller function,
            //injecting any services or other injectables we need.
            controller = $controller('MainCtrl', {
                $scope: $scope,
                socket: mockSocketService,
                localStorageService: mockLocalStorageService
            });
        }));



        it('test description', function () {
            expect(1).toEqual(1);
            expect($scope).toEqualData({});
        });

    });

});
