bazar.app.controller('nueva-marca-controller', [
	'$scope', '$window', '$modalInstance', '$modal', '$timeout', '$route', 'ServiceMarcas',
	function ($scope, $window, $modalInstance, $modal, $timeout, $route, ServiceMarcas) {

	$scope.cancel = function () {
		$modalInstance.dismiss('Close');
	};

	$scope.resultado = false;

	$scope.guardarMarca = function(nueva_marca){

		$scope.marca = nueva_marca;

		ServiceMarcas.save($scope.marca, function success(data){
			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-success";
			$scope.icoMensaje = "fa-check";
			$scope.mensaje = $scope.respuesta.Mensaje;
			if($scope.mensaje === 1){
				$scope.mensaje = "Se ha guardado la marca correctamente";
			};
			$window.scrollTo(0,0);
			$timeout(function() {
				$scope.resultado = false;
				$modalInstance.dismiss('Close');
				$route.reload("marcas-controller");
			}, 2500);

		}, function err(data) {
			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-danger";
			$scope.icoMensaje = "fa-ban";
			$scope.mensaje = $scope.respuesta.data.Mensaje;
			var marcaAsoc = $scope.mensaje.indexOf("SQLSTATE[23000]") > -1;
			if($scope.respuesta.status === 503 && !marcaAsoc){
				$scope.mensaje = ":( Ha habido un error, no se ha eliminado";
			}else if($scope.respuesta.status === 503 && marcaAsoc){
				$scope.mensaje = ":( Esta marca, ya existe";
			};
			$window.scrollTo(0,0);
			$timeout(function() {
				$scope.resultado = false;
			}, 2500);
		});
	};
}]);