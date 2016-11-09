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

          // speech = (data.result.fulfillment) ? data.result.fulfillment.speech : data.result.speech;
          //self.apiAiTts.tts(speech, undefined, 'en-US');

          data.result.fulfillment.speech.split('|').map(function (s) {
            var fulfillment = angular.copy(data.result.fulfillment);
            fulfillment.speech = s;
            return {
              'data': fulfillment,
              'timestamp': data.timestamp,
              'botUser': true,
              'realUser': false,
                img: Math.floor((Math.random() * 8) + 1)
            }
          }).forEach(function (m) {
            $scope.messages.push(m);
          });

          $scope.input = '';

          $scope.$apply();
        };

      $scope.send = function(input) {
        console.log('send clicked');

        ApiAIService.sendJson(input);

        $scope.messages.push({
          data: {
            speech: input
          },
          timestamp: new Date(),
          botUser:false,
          realUser: true
        });
      };
    }])

    //
})();
