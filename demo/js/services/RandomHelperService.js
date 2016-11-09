(function() {
    'use strict';

    angular
        .module('eveApp')
        .service('RandomHelperService', [function() {
            var self = this;

            self.generate = function(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            };
        }]);
})();
