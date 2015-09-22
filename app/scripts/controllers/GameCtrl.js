app.controller('GameCtrl', function($scope, $timeout, $http, localStorageService, Game) {

    $scope.matrix = {
        col0: [],
        col1: [],
        col2: [],
        col3: [],
        col4: [],
        col5: [],
        col6: []
    };
    $scope.game = true;

    $scope.turn = 0;

    $scope.player = 1;

    $scope.modal = false;
    $scope.whichModal = null;

    $scope.beginGame = function() {
        $scope.game = true;
        $scope.turn = 0;
        $scope.player = 1;
        $scope.gameid++;
        $scope.lastCol = null;

        resetMatrix();
    };

    $scope.makeMove = function(col) {
    	if (!$scope.game) return;
    	var success = Game.MakeMove($scope, col);
    	if (success) $scope.lastCol = col;
    };

    $scope.crapBrowserCheck = function() {
        return (!localStorageService.isSupported) ? true : false;
    };

    $scope.finishGame = function(result) {
        $scope.game = false;

        switch (result) {
            case 'draw':
                registerResult('draw');
            case 'win':
                registerResult('win');
        }
    };

    $scope.toggleModal = function() {
        $scope.whichModal = null;
        $scope.modal = !$scope.modal;
    };

    $scope.currentModal = function(block) {
        return block === $scope.whichModal;
    };

    $scope.restart = function() {
        $scope.beginGame();
        $scope.toggleModal();
    };

    var resetMatrix = function() {
        _.forEach($scope.matrix, function(col, n) {
            $scope.matrix[n] = [];
        });
    };

    var registerResult = function(result) {
        $scope.whichModal = result;
        $scope.modal = true;
    };

    var initialize = function() {
        $scope.modal = true;
        $scope.whichModal = 'begin';
    };

    initialize();

});
