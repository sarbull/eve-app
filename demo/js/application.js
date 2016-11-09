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

      $scope.send = function() {
        console.log('send clicked');

        ApiAIService.sendJson($scope.input);
        $scope.messages.push($scope.input);
        $scope.input = '';
      };
    }])
    .service('ApiAIService', [function() {
      var app, text, dialogue, response, start, stop;
      var SERVER_PROTO, SERVER_DOMAIN, SERVER_PORT, ACCESS_TOKEN, SERVER_VERSION, TTS_DOMAIN;

      SERVER_PROTO   = 'wss';
      SERVER_DOMAIN  = 'api-ws.api.ai';
      TTS_DOMAIN     = 'api.api.ai';
      SERVER_PORT    = '4435';
      ACCESS_TOKEN   = 'f1bf0afa8ea045f6aff49b237f66c737';
      SERVER_VERSION = '20150910';

      var self = this;

      var apiAi, apiAiTts;
      var isListening = false;


      self._generateId = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };

      var sessionId = self._generateId(32);

      self.start = function () {
        start.className += ' hidden';
        stop.className = stop.className.replace('hidden', '');

        self._start();
      };

      self.stop = function () {
          self._stop();

          stop.className += ' hidden';
          start.className = start.className.replace('hidden', '');
      };

      self.sendJson = function (input) {
        var query = input,
            queryJson = {
                "v": SERVER_VERSION,
                "query": query,
                "timezone": "GMT+6",
                "lang": "en",
                //"contexts" : ["weather", "local"],
                "sessionId": sessionId
            };

        console.log('sendJson', queryJson);

        apiAi.sendJson(queryJson);
      };

      self.open = function () {
        console.log('open');
        apiAi.open();
      };

      self.close = function () {
        console.log('close');
        apiAi.close();
      };

      self.clean = function () {
        dialogue.innerHTML = '';
      };

      self._init = function() {
        console.log('init');

        var config = {
            server: SERVER_PROTO + '://' + SERVER_DOMAIN + ':' + SERVER_PORT + '/api/ws/query',
            serverVersion: SERVER_VERSION,
            token: ACCESS_TOKEN,
            sessionId: sessionId,
            lang: 'en',
            onInit: function () {
                console.log("> ON INIT use config");
            }
        };

        apiAi = new ApiAi(config);

        apiAi.sessionId = '1234';

        apiAi.onInit = function () {
            console.log("> ON INIT use direct assignment property");
            apiAi.open();
        };

        apiAi.onStartListening = function () {
            console.log("> ON START LISTENING");
        };

        apiAi.onStopListening = function () {
            console.log("> ON STOP LISTENING");
        };

        apiAi.onOpen = function () {
            console.log("> ON OPEN SESSION");

            apiAi.sendJson({
                "v": "20150512",
                "query": "hello",
                "timezone": "GMT+6",
                "lang": "en",
                //"contexts" : ["weather", "local"],
                "sessionId": sessionId
            });

        };

        apiAi.onClose = function () {
            console.log("> ON CLOSE");
            apiAi.close();
        };

        apiAi.onResults = function (data) {
            console.log("> ON RESULT", data);

            var status = data.status,
                code,
                speech;

            if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
                return;
            }

            speech = (data.result.fulfillment) ? data.result.fulfillment.speech : data.result.speech;
            //apiAiTts.tts(speech, undefined, 'en-US');

            dialogue.innerHTML += ('user : ' + data.result.resolvedQuery + '\napi  : ' + speech + '\n\n');
            response.innerHTML = JSON.stringify(data, null, 2);
            text.innerHTML = '';
        };

        apiAi.onError = function (code, data) {
          apiAi.close();
          console.log("> ON ERROR", code, data);
        };

        apiAi.onEvent = function (code, data) {
          console.log("> ON EVENT", code, data);
        };

        apiAi.init();

        //apiAiTts = new TTS(TTS_DOMAIN, ACCESS_TOKEN, undefined, 'en-US');
      };

      self._start = function() {
        console.log('start');

        isListening = true;
        apiAi.startListening();
      };

      self._stop = function() {
        console.log('stop');

        apiAi.stopListening();
        isListening = false;
      };

      self._init();
    }]);



})();
