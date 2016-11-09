(function() {
  'use strict';

  angular
    .module('eveApp', [])
    .controller('WelcomeController', ['$scope', function($scope) {
      $scope.message = 'Welcome';
    }])
    .controller('ChatController', ['$scope', 'ApiAIService', 'DrawService', '$timeout', function($scope, ApiAIService, DrawService, $timeout) {
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

          speech = (data.result.fulfillment) ? data.result.fulfillment.speech : data.result.speech;
          //self.apiAiTts.tts(speech, undefined, 'en-US');

          if(data.result.fulfillment.messages[0].payload != undefined) {
            angular.element('.messages').append('<li><div id="canvasDiv"></div></li>');
            DrawService.prepareCanvas();
          } else {
            $scope.messages.push({
              'data': data.result.fulfillment,
              'timestamp': data.timestamp,
              'botUser': true,
              'realUser': false
            });
          }



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
