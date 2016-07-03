angular.module('Teamapp').controller('recursosCtrl', function ($scope, $http, $state, ToastService, RecursosService) {
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
		});
	};

    /*RecursosService.getRecursosRecibidos()
    .success(function (response){
    	$scope.recursos = response;
    	console.log($scope.recursos);
    });*/

});