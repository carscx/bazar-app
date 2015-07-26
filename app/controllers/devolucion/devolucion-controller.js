bazar.app.controller('devolucion-controller', [
	'$scope', '$window', '$timeout', '$modal', 'ServiceConsultaCodigo',
	function ($scope, $window, $timeout, $modal, ServiceConsultaCodigo) {

	$scope.devolucion = {
		productosADevolver: [],
		productosQRetira: []
	};


	$scope.consultaCodigo = function(codigo){

		$scope.codigo = {"codigo_control" : codigo};

		$scope.producto = ServiceConsultaCodigo.query($scope.codigo, function success(data){

			$scope.producto = data;

			$scope.devolucion.productosADevolver.push({
				idProducto			: $scope.producto[0].id_producto,
				codigoProducto 		: $scope.producto[0].codigo_control,
				nombreProducto 		: $scope.producto[0].nombre_producto,
				cantidadProducto 	: 1,
				precioProducto 		: $scope.producto[0].precio_producto
			});
			$scope.resultado = false;
		}, function err(data) {

			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-danger";
			$scope.icoMensaje = "fa-ban";
			$scope.mensaje = $scope.respuesta.data.Mensaje;
			var ventaAsoc = $scope.mensaje.indexOf("SQLSTATE[23000]") > -1;
			if($scope.respuesta.status === 503 && !ventaAsoc){
				$scope.mensaje = $scope.respuesta.data.Mensaje;
			}else if($scope.respuesta.status === 503 && ventaAsoc){
				$scope.mensaje = $scope.respuesta.data.Mensaje;
			};

			$window.scrollTo(0,0);
		});
	};

	$scope.consultaCodigoRetira = function(codigo){

		$scope.codigoRetira = {"codigo_control" : codigo};

		$scope.productoRetira = ServiceConsultaCodigo.query($scope.codigoRetira, function success(data){

			$scope.productoRetira = data;

			$scope.devolucion.productosQRetira.push({
				idProductoRetira 		: $scope.productoRetira[0].id_producto,
				codigoProductoRetira 	: $scope.productoRetira[0].codigo_control,
				nombreProductoRetira 	: $scope.productoRetira[0].nombre_producto,
				cantidadProductoRetira 	: 1,
				precioProductoRetira 	: $scope.productoRetira[0].precio_producto
			});
			$scope.resultado = false;
		}, function err(data) {

			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-danger";
			$scope.icoMensaje = "fa-ban";
			$scope.mensaje = $scope.respuesta.data.Mensaje;
			var ventaAsoc = $scope.mensaje.indexOf("SQLSTATE[23000]") > -1;
			if($scope.respuesta.status === 503 && !ventaAsoc){
				$scope.mensaje = $scope.respuesta.data.Mensaje;
			}else if($scope.respuesta.status === 503 && ventaAsoc){
				$scope.mensaje = $scope.respuesta.data.Mensaje;
			};

			$window.scrollTo(0,0);
		});
	};

	$scope.eliminaProducto = function(index,obj) {
        obj.splice(index, 1);
    };

    $scope.getTotalDev = function(){
    	var total = 0;
		for(var i = 0; i < $scope.devolucion.productosADevolver.length; i++){
			var producto = $scope.devolucion.productosADevolver[i];
			if(producto === undefined){
				producto = 0;
			}
			total += (producto.precioProducto * producto.cantidadProducto);
		}
		return total;
    };

    $scope.getTotalRetira = function(){
    	var total = 0;
		for(var i = 0; i < $scope.devolucion.productosQRetira.length; i++){
			var producto = $scope.devolucion.productosQRetira[i];
			if(producto === undefined){
				producto = 0;
			}
			total += (producto.precioProductoRetira * producto.cantidadProductoRetira);
		}
		return total;
    };

    $scope.confirmarDevolucion = function(totalDiferencia){
    	$scope.totalDiferencia = parseFloat($scope.getTotalRetira()-$scope.getTotalDev());
    	console.log($scope.totalDiferencia);
    	var modalInstance = $modal.open({
          templateUrl: 'html/confirma-devolucion.html',
          controller: 'confirma-devolucion-controller',
          size: "lg",
          resolve: {
            diferencia: function () {
              return $scope.totalDiferencia;
            },
            devolucion: function () {
              return $scope.devolucion;
            }
          }
        });
    }

}]);