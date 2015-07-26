bazar.app.controller('edita-marca-controller', ['$scope', '$rootScope', '$modalInstance', '$route', '$window', '$timeout', 'item', 'ServiceProductos', function ($scope, $rootScope, $modalInstance, $route, $window, $timeout, item, ServiceProductos) {

  	$scope.marca = angular.copy(item);
  	$scope.cancel = function () {
		$modalInstance.dismiss('Close');
	};

	$scope.resultado = false;

	$scope.editarMarca = function(marca_editado){

		$scope.marca_editado = marca_editado;

		var idMarca = $scope.marca_editado.id_marca.$$rawModelValue;

	  		$scope.marca.$update({ id_marca: idMarca }, function success(data){

				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				console.log($scope.respuesta.Mensaje);
				if($scope.mensaje === 1){
					$scope.mensaje = "Se ha guardado la marca correctamente";
				};
				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
					$modalInstance.dismiss('Close');
					$route.reload("marcas-controller");
				}, 100);


			}, function err(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-danger";
				$scope.icoMensaje = "fa-ban";
				$scope.mensaje = $scope.respuesta.data.Mensaje;
				console.log($scope.respuesta.data.Mensaje);
				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
					$modalInstance.dismiss('Close');
					$route.reload("marcas-controller");
				}, 500);
			});

	};


}]);