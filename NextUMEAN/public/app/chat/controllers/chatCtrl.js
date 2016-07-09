var app = angular.module('Teamapp');

app.controller('chatCtrl', function ($scope, $stateParams, $state, Socket, Session) {
    $scope.usuarios_conectados = [];
    $scope.chat = "general";
    $scope.messagesList = new Object();
    $scope.messagesList[$scope.chat] = [];

    if ($scope.usuarios_conectados.length <= 0) {
        Socket.emit('usuarios');
    }

    Socket.on('usuarios:lista', function (usuarios) {
        Session.getUsuario()
            .then(function (response) {
                var user = response.data.user.user;
                var conectados = _.reject(usuarios, { _id: user._id });
                angular.copy(conectados, $scope.usuarios_conectados);
            });
    });

    Socket.on('mensaje:general', function (mensaje) {
        if ($scope.messagesList && $scope.chat) {
            $scope.messagesList[$scope.chat].push(mensaje);
        }
    });
});