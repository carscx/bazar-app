bazar.app.controller('nuevo-proveedor-controller', [
	'$scope', '$window', '$timeout', '$route', 'ServiceProductos', 'ServiceMarcas', 'ServiceProveedores',
	function ($scope, $window, $timeout, $route, ServiceProductos, ServiceMarcas, ServiceProveedores) {
/*
	$scope.marcas = ServiceMarcas.query();
	$scope.correctlySelected = $scope.marcas[1];

	$scope.proveedores = ServiceProveedores.query();
	$scope.correctlySelected = $scope.proveedores[1];

	$scope.resultado = false;

	$scope.guardarProducto = function(nuevo_producto,accion){

		$scope.producto = nuevo_producto;
		//$scope.accion = accion;

		ServiceProductos.save($scope.producto, function success(data){
			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-success";
			$scope.icoMensaje = "fa-check";
			$scope.mensaje = $scope.respuesta.Mensaje;
			console.log($scope.respuesta.Mensaje);
			if($scope.mensaje === 1){
				$scope.mensaje = "Se ha guardado el producto correctamente";
			};
			$window.scrollTo(0,0);
			$timeout(function() {
				$scope.resultado = false;
			}, 2500);
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
			}, 2500);
		});
	};
*/
}]);