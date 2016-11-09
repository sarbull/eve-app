(function() {
  'use strict';

  angular
    .module('eveApp', [])
    .controller('WelcomeController', ['$scope', function($scope) {
      $scope.message = 'Welcome';
    }])
    .controller('ChatController', ['$scope', 'ApiAIService', function($scope, ApiAIService) {
      $scope.input = '';
      $scope.messages = [];

      ApiAIService.apiAi.onResults = function (data) {
          console.log("> ON RESULT", data);

          var status = data.status,
              code,
              speech;

          if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
              return;
          }

          data.botUser  = true;
          data.realUser = false;
          data.eve      = Math.floor((Math.random() * 8 + 1));

          $scope.messages.push(data);

          $scope.input = '';

          $scope.$apply();
        };

      $scope.send = function(input) {
        console.log('send clicked');

        ApiAIService.sendJson(input);

        $scope.messages.push({
          "timestamp": new Date(),
          "result": {
            "fulfillment": {
              "messages": [
                {
                  "type": 0,
                  "speech": input
                }
              ]
            }
          },
          "botUser": false,
          "realUser": true
        });
      };

    }])

    //
})();
