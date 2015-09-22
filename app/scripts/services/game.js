(function() {

    'use strict';

    angular.module('game-service', ['LocalStorageModule']).factory('Game', function(localStorageService) {

        var _findDelta = function(x, y, direction) {
            var originX = x;
            var originY = y;

            if (direction === 'right') {
                while (originX > 0 && originY > 0) {
                    originX--;
                    originY--;
                }
            } else {
                while (originX < 6 && originY > 0) {
                    originX++;
                    originY--;
                }
            }

            return [originX, originY];
        };

        var _switchPlayer = function(config) {
            config.player = (config.player === 1) ? 2 : 1;
        };

        var _checkVector = function(config, x, y, direction) {
            var origin = _findDelta(x, y, direction);
            var count = 0;
            var win = false;
            var vertical = origin[1];

            if (direction === 'right') {
                for (var i = origin[0]; i <= 6; i++) {
                    if (typeof config.matrix['col' + i][vertical] !== 'undefined' && config.matrix['col' + i][vertical] === config.player) {
                        count++;
                        if (count >= 4) win = true;
                    } else {
                        count = 0;
                    }

                    vertical++;
                }
            } else {
                for (var i = origin[0]; i >= 0; i--) {
                    if (typeof config.matrix['col' + i][vertical] !== 'undefined' && config.matrix['col' + i][vertical] === config.player) {
                        count++;
                        if (count >= 4) win = true;
                    } else {
                        count = 0;
                    }

                    vertical++;
                }
            }

            return win;
        };

        var _calculatePotentialDraw = function(config) {
            return (config.turn >= 41) ? true : false;
        };

        var _checkColumn = function(config, lastCol) {
            var column = config.matrix[lastCol];
            var count = 0;
            var win = false;

            _.forEach(column, function(puck) {
                if (puck === config.player) {
                    count++;
                    if (count >= 4) win = true;
                } else {
                    count = 0;
                }
            });

            return win;
        };

        var _checkRows = function(config, lastCol) {
            var row = config.matrix[lastCol].length - 1;
            var count = 0;
            var win = false;

            _.forEach(config.matrix, function(col, n) {
                if (typeof col[row] !== 'undefined' && col[row] === config.player) {
                    count++;
                    if (count >= 4) win = true;
                } else {
                    count = 0;
                }
            });

            return win;
        };

        var _checkDiagonals = function(config, lastCol) {
            var row = config.matrix[lastCol].length - 1;
            var column = parseInt(lastCol.slice(-1));

            var leftVector = _checkVector(config, column, row, 'right');
            var rightVector = _checkVector(config, column, row, 'left');

            return (leftVector || rightVector) ? true : false;
        };


        var _calculatePotentialWin = function(config, col) {
            var victory = false;

            if (_checkColumn(config, col)) victory = true;

            if (_checkRows(config, col)) victory = true;

            if (_checkDiagonals(config, col)) victory = true;

            if (victory) {
                config.turn++;
                config.finishGame('win');
            } else {
                config.lastCol = col;

                if (!_calculatePotentialDraw(config)) {
                    config.turn++;
                    _switchPlayer(config);
                } else {
                    config.finishGame('draw');
                }
            }
        };

        var _saveMove = function(config, col) {
            if (!localStorageService.isSupported) return;
            var key = config.gameid + '.' + config.turn;
            localStorageService.set(key, config.player + '.' + col);
        };

        var _makeMove = function(config, col) {
            if (typeof config.matrix[col] !== 'object') return false;
            if (config.matrix[col].length >= 6) return false;

            if (config.game) _saveMove(config, col);

            config.matrix[col].push(config.player);
            _calculatePotentialWin(config, col);
            return true;
        };

        return {
            MakeMove: function(config, col) {
                return _makeMove(config, col);
            }
        };
    });
})();
