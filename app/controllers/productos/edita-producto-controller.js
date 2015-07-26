bazar.app.controller('edita-producto-controller', [
	'$scope', '$rootScope', '$modalInstance', '$route', '$window', '$timeout', 'item', 'marcas', 'proveedores', 'ServiceProductos',
	function ($scope, $rootScope, $modalInstance, $route, $window, $timeout, item, marcas, proveedores, ServiceProductos) {

  	$scope.producto = angular.copy(item);
  	$scope.cancel = function () {
		$modalInstance.dismiss('Close');
	};

	$scope.marcas = angular.copy(marcas);
	$scope.proveedores = angular.copy(proveedores);

	$scope.resultado = false;

	$scope.editarProducto = function(producto_editado){

		$scope.producto_editado = producto_editado;

		var idProducto = $scope.producto_editado.id_producto.$$rawModelValue;

	  		$scope.producto.$update({ id_producto: idProducto }, function success(data){

				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				console.log($scope.respuesta.Mensaje);
				if($scope.mensaje === 1){
					$scope.mensaje = "Se ha guardado el producto correctamente";
				};
				console.log("asd");
				//$scope.cargarProductos();
				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
					$modalInstance.dismiss('Close');
				}, 500);

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
				}, 500);
			});
	};

}]);