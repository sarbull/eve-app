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

      var apiAiTts;

      self.isListening = false;


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

        self.apiAi.sendJson(queryJson);
      };

      self.open = function () {
        console.log('open');
        self.apiAi.open();
      };

      self.close = function () {
        console.log('close');
        self.apiAi.close();
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

        self.apiAi = new ApiAi(config);

        self.apiAi.sessionId = '1234';

        self.apiAi.onInit = function () {
            console.log("> ON INIT use direct assignment property");
            self.apiAi.open();
        };

        self.apiAi.onStartListening = function () {
            console.log("> ON START LISTENING");
        };

        self.apiAi.onStopListening = function () {
            console.log("> ON STOP LISTENING");
        };

        self.apiAi.onOpen = function () {
            console.log("> ON OPEN SESSION");

            self.apiAi.sendJson({
                "v": "20150512",
                "query": "hello",
                "timezone": "GMT+6",
                "lang": "en",
                //"contexts" : ["weather", "local"],
                "sessionId": sessionId
            });

        };

        self.apiAi.onClose = function () {
            console.log("> ON CLOSE");
            self.apiAi.close();
        };

        self.apiAi.onResults = function (data) {
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

        self.apiAi.onError = function (code, data) {
          self.apiAi.close();
          console.log("> ON ERROR", code, data);
        };

        self.apiAi.onEvent = function (code, data) {
          console.log("> ON EVENT", code, data);
        };

        self.apiAi.init();

        //apiAiTts = new TTS(TTS_DOMAIN, ACCESS_TOKEN, undefined, 'en-US');
      };

      self._start = function() {
        console.log('start');

        self.isListening = true;
        self.apiAi.startListening();
      };

      self._stop = function() {
        console.log('stop');

        self.apiAi.stopListening();
        self.isListening = false;
      };

      self._init();
    }]);



})();
