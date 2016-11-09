(function() {
    'use strict';

    angular
        .module('eveApp')
        .service('ApiAIService', ['RandomHelperService', function(RandomHelperService) {
            var app, text, dialogue, response, start, stop;
            var SERVER_PROTO, SERVER_DOMAIN, SERVER_PORT, ACCESS_TOKEN, SERVER_VERSION, TTS_DOMAIN;

            SERVER_PROTO   = 'wss';
            SERVER_DOMAIN  = 'api-ws.api.ai';
            SERVER_PORT    = '4435';
            ACCESS_TOKEN   = 'f1bf0afa8ea045f6aff49b237f66c737';
            SERVER_VERSION = '20150910';

            var self = this;

            self.isListening = false;

            self.sessionId = RandomHelperService.generate(32);

            self.start = function () {
                self.apiAi._start();
                console.log('apiAi started');
            };

            self.stop = function () {
                self.apiAi._stop();
                console.log('apiAi stopped');
            };

            self.sendJson = function (input) {
                var query = input,
                    queryJson = {
                        "v": SERVER_VERSION,
                        "query": query,
                        "timezone": "GMT+6",
                        "lang": "en",
                        //"contexts" : ["weather", "local"],
                        "sessionId": self.sessionId
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
                    sessionId: self.sessionId,
                    lang: 'en',
                    onInit: function () {
                        console.log("> ON INIT use config");
                    }
                };

                self.apiAi = new ApiAi(config);

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
                        "sessionId": self.sessionId
                    });

                };

                self.apiAi.onClose = function () {
                    console.log("> ON CLOSE");
                    self.apiAi.close();
                };

                self.apiAi.onError = function (code, data) {
                    self.apiAi.close();
                    console.log("> ON ERROR", code, data);
                };

                self.apiAi.onEvent = function (code, data) {
                    console.log("> ON EVENT", code, data);
                };

                self.apiAi.init();
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
