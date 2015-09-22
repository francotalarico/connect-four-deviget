var app = angular.module('connect-four-deviget', ['LocalStorageModule','game-service']);

app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('c4');
});