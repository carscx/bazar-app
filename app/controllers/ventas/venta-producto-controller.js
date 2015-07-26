bazar.app.controller('venta-producto-controller', [
	'$scope', '$rootScope', '$window', '$modalInstance', '$route', '$timeout', 'item', 'productosSeleccionados', 'ServiceProductos', 'ServiceMediosCobro', 'ServiceVentas', 'ServiceStock',
	function ($scope, $rootScope, $window, $modalInstance, $route, $timeout, item, productosSeleccionados, ServiceProductos, ServiceMediosCobro, ServiceVentas, ServiceStock) {


	$scope.producto = angular.copy(item);
	$scope.productosSeleccionados = angular.copy(productosSeleccionados);

	$scope.mediosCobro = ServiceMediosCobro.query();

	$scope.medioCobro;
	$scope.cuotasTarjeta;


	$scope.cuotas = ['Cuotas', '1', '2','3','4','5','6','7','8','9','10','11','12'];

	$timeout(function() {
        $(".modal-dialog").addClass("modal-venta");
    }, 1);

	$scope.getTotal = function(dtoEnPesos,interesTarjeta){

		var valDtoEnPesos = dtoEnPesos === undefined || dtoEnPesos === "";
		var valInteresTarjeta = interesTarjeta === undefined || interesTarjeta === "";

		if(valDtoEnPesos && valInteresTarjeta){
			var total = 0;
    		for(var i = 0; i < $scope.productosSeleccionados.length; i++){
				var producto = $scope.productosSeleccionados[i];
				if(producto === undefined){
					producto = 0;
				}
				total += (producto.precio_producto * producto.cantidad_a_vender);
    		}
    		return total;
		}else if(!valDtoEnPesos && valInteresTarjeta){
			var total = 0;
    		for(var i = 0; i < $scope.productosSeleccionados.length; i++){
				var producto = $scope.productosSeleccionados[i];
				if(producto === undefined){
					producto = 0;
				}
				total += (producto.precio_producto * producto.cantidad_a_vender);
    		}
    		return parseFloat(total,"")-parseFloat(dtoEnPesos,"");
		}else if(valDtoEnPesos && !valInteresTarjeta){
			var total = 0;
    		for(var i = 0; i < $scope.productosSeleccionados.length; i++){
				var producto = $scope.productosSeleccionados[i];
				if(producto === undefined){
					producto = 0;
				}
				total += (producto.precio_producto * producto.cantidad_a_vender);
    		}

    		interesTarjeta = interesTarjeta/100*total;
    		return parseFloat(total,"")+parseFloat(interesTarjeta,"");
		}else if(!valDtoEnPesos && !valInteresTarjeta){
			var total = 0;
    		for(var i = 0; i < $scope.productosSeleccionados.length; i++){
				var producto = $scope.productosSeleccionados[i];
				if(producto === undefined){
					producto = 0;
				}
				total += (producto.precio_producto * producto.cantidad_a_vender);
    		}

    		var totalConDescuento = parseFloat(total,"")-parseFloat(dtoEnPesos,"");
    		interesTarjeta = interesTarjeta/100*totalConDescuento;
    		return totalConDescuento+parseFloat(interesTarjeta,"");
		}
	}

	$scope.getCuotas = function(cuotasTarjeta,dtoEnPesos,interesTarjeta,pmCobradoTarjeta){
		if(pmCobradoTarjeta === undefined){
			var totalCompra = $scope.getTotal(dtoEnPesos,interesTarjeta);
			valorCuotas = totalCompra/cuotasTarjeta;
			return valorCuotas;
		}else{
			var totalCompra = pmCobradoTarjeta;
			valorCuotas = totalCompra/cuotasTarjeta;
			return valorCuotas;
		}
	}



	$scope.cancel = function () {
		$modalInstance.dismiss('Close');
	};


	$scope.eliminaProdVenta = function(ps,index){
        console.log("Eliminar"+index);
        console.log($scope.productosSeleccionados);
        delete $scope.productosSeleccionados[index];
        $scope.productosSeleccionados = $scope.productosSeleccionados.filter(function(n){ return n != undefined });
        if($scope.productosSeleccionados.length === 0){
        	$scope.cancel();
        }
    };

	$scope.getTotal();



	$scope.guardarVenta = function(data){

		$scope.detalleVenta = [];

		if(data.medioCobro === undefined){
			data.medioCobro = "3";
		}

		switch (data.medioCobro) {
			case "1":
				data.pmCobradoEfectivo = 0;
				data.pmCobradoTarjeta = $scope.getTotal();
				break;
			case "2":
        		data.pmCobradoEfectivo = 0;
				data.pmCobradoTarjeta = $scope.getTotal();
				break;
			case "3":
        		data.pmCobradoEfectivo = $scope.getTotal();
				data.pmCobradoTarjeta = 0;
				break;
			case "4":
        		if(data.pmCobradoEfectivo === undefined){
        			data.pmCobradoEfectivo = $scope.getTotal(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoTarjeta;
        		}else if(data.pmCobradoTarjeta === undefined){
        			data.pmCobradoTarjeta = $scope.getTotal(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoEfectivo;
        		}
				break;
			case "5":
        		if(data.pmCobradoEfectivo === undefined){
        			data.pmCobradoEfectivo = $scope.getTotal(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoTarjeta;
        		}else if(data.pmCobradoTarjeta === undefined){
        			data.pmCobradoTarjeta = $scope.getTotal(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoEfectivo;
        		}
				break;
		}

		$scope.datosVenta = {
			"venta" : {
				"id_medio_cobro"		: (data.medioCobro === undefined) ? 3 : parseInt(data.medioCobro,""),
				"cobrado_efectivo"		: parseFloat(data.pmCobradoEfectivo,""),
				"cobrado_tarjeta"		: parseFloat(data.pmCobradoTarjeta,""),
				"cuotas_tarjeta"		: (data.cuotasTarjeta === "Cuotas") ? 0 : parseInt(data.cuotasTarjeta,""),
				"descuento_venta"		: (data.dtoEnPesos === undefined) ? 0 : parseFloat(data.dtoEnPesos,""),
				"interes_venta"			: (data.interesTarjeta === undefined) ? 0 : parseInt(data.interesTarjeta,"")
			}
		};

		$scope.datosVenta.items_venta = [];


		angular.forEach($scope.productosSeleccionados, function(value, key) {

			$scope.datosVenta.items_venta.push({

				"item_venta" : {
					"num_detalle"			: key,
					"id_producto"			: parseInt(value.id_producto,""),
					"precio_producto"		: parseFloat(value.precio_producto,""),
					"cantidad_vendida"		: parseInt(value.cantidad_a_vender,"")
					//"total_venta"			: parseFloat($scope.getTotal(data.dtoEnPesos,data.interesTarjeta),"")
				}
			});

			ServiceStock.update({ accion:'bajar', cantidad: parseInt(value.cantidad_a_vender,""), id_producto: parseInt(value.id_producto,"")  });

		});

		$scope.detalleVenta.push($scope.datosVenta);


		ServiceVentas.save($scope.detalleVenta, function success(data){
			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-success";
			$scope.icoMensaje = "fa-check";
			$scope.mensaje = $scope.respuesta.Mensaje;
			console.log($scope.respuesta.Mensaje);
			if($scope.mensaje === 1){
				$scope.mensaje = "Venta realizada";
			};
			$window.scrollTo(0,0);
			$route.reload("nueva-venta-controller");
			$timeout(function() {
				$scope.cancel();
				$scope.resultado = false;

			}, 1000);

		}, function err(data) {
			$scope.resultado = true;
			$scope.respuesta = data;
			$scope.claseMensaje = "alert-danger";
			$scope.icoMensaje = "fa-ban";
			$scope.mensaje = $scope.respuesta.data.Mensaje;
			var ventaAsoc = $scope.mensaje.indexOf("SQLSTATE[23000]") > -1;
			if($scope.respuesta.status === 503 && !ventaAsoc){
				$scope.mensaje = ":( Ha habido un error";
			}else if($scope.respuesta.status === 503 && ventaAsoc){
				$scope.mensaje = ":( Ha habido un error";
			};
			console.log($scope.respuesta.data.Mensaje);
			$window.scrollTo(0,0);
			$timeout(function() {
				$scope.resultado = false;
			}, 1000);
		});

	};

}]);