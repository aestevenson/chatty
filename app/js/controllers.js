function MainCtrl($scope, socket, localStorageService) {

    $scope.messages = [];
    $scope.connectionCount = 0;
    $scope.status = {message: "", type: ''};
    $scope.historySet = false;
    $scope.defaultServer = localStorageService.get('server');


    $scope.$on('socket:message', function (event, payload) {

        var urlPattern = /(http|ftp|https):\/\/[\w\-]+(\.[\w\-]+)+([\w.,@?\^=%&amp;:\/~+#\-]*[\w@?\^=%&amp;\/~+#\-])?/,
            match = urlPattern.exec(payload.text);
        if (match !== null) {
            //TODO: HTML shouldn't be here. Make into a filter
            payload.text = payload.text.replace(match[0], "<a href='" + match[0] + "' target='_blank'>" + match[0] + "</a>");
        }
        $scope.messages.push(payload);
    });

    $scope.$on('socket:history', function (event, payload) {
        var i;
        if (!$scope.historySet) {
            $scope.historySet = true;
            for (i = 0; i < payload.length; i++) {
                $scope.messages.push(payload[i]);
            }
        }
    });

    $scope.$on('socket:count', function (event, payload) {
        $scope.connectionCount = payload.count;
    });

    $scope.connect = function (serverIp) {
        $scope.$emit('socket:connect', {serverIp:serverIp});
        $scope.status = {message: 'Connected to: ' + serverIp + '!', type: 'info'};
    }

    $scope.emit = function(message) {


        $scope.$emit('socket:emit', message);
    }
}
