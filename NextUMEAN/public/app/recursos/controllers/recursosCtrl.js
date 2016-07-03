var app = angular.module('Teamapp');

app.controller('recursosCtrl', function ($scope, $http, $state, ToastService, RecursosService) {
	$scope.filesChanged = function (elm) {
		$scope.files = elm.files;
		$scope.$apply();
	};
	
	$scope.uploadFile = function () {
		var fd = new FormData();
		angular.forEach($scope.files, function (file) {
			fd.append('file', file);
		});
		fd.append('destinatarios', $scope.destinatarios);
		fd.append('asunto', $scope.asunto);
		
		$http.post('/recurso', fd, 
        {
			transformRequest: angular.identity,
			headers : { 'Content-Type' : undefined }
		})
        .success(function (d) {
			console.log(d);
			ToastService.success('Enviado correctamente!');
			$state.transitionTo('app.recursos');
		})
		.error(function (err) {
			alert(err);
		});
	};
});


app.controller('enviadosCtrl', function ($scope, RecursosService) {
	RecursosService.getRecursosEnviados()
    .success(function (response) {
		console.log(response);
		$scope.enviados = response;
	});
});

app.controller('recibidosCtrl', function ($scope, RecursosService) {
	RecursosService.getRecursosRecibidos()
    .success(function (response) {
		$scope.recibidos = response;
	});
});

app.controller('detalleCtrl', function ($scope, $stateParams, RecursosService) {
	if ($stateParams.hasOwnProperty('id_recurso')) {
		var id_recurso = $stateParams.id_recurso;
		RecursosService.getDetalle({ id : id_recurso })
        .success(function (response) {
			$scope.recurso = response;
		});
	}
});