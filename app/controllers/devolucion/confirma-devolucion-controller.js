bazar.app.controller('confirma-devolucion-controller', [
	'$scope', '$rootScope', '$window', '$modalInstance', '$route', '$timeout', 'diferencia', 'devolucion', 'ServiceProductos', 'ServiceMediosCobro', 'ServiceVentas', 'ServiceStock', 'ServiceDevoluciones',
	function ($scope, $rootScope, $window, $modalInstance, $route, $timeout, diferencia, devolucion, ServiceProductos, ServiceMediosCobro, ServiceVentas, ServiceStock, ServiceDevoluciones) {


	$scope.diferencia = angular.copy(diferencia);
	$scope.devolucion = angular.copy(devolucion);



	if($scope.diferencia === 0){
		alert("Gracias por la devolucion");
		$modalInstance.dismiss('Close');
	}else{
		$scope.cancel = function () {
			$modalInstance.dismiss('Close');
		};

		$scope.mediosCobro = ServiceMediosCobro.query();
		$scope.medioCobro;
		$scope.cuotasTarjeta;

		$scope.cuotas = ['Cuotas', '1', '2','3','4','5','6','7','8','9','10','11','12'];


		$scope.devolucion;

		$scope.getTotalDevolucion = function(dtoEnPesos,interesTarjeta){

			var valDtoEnPesos = dtoEnPesos === undefined || dtoEnPesos === "";
			var valInteresTarjeta = interesTarjeta === undefined || interesTarjeta === "";

			if(valDtoEnPesos && valInteresTarjeta){
				var total = $scope.diferencia;
	    		return total;
			}else if(!valDtoEnPesos && valInteresTarjeta){
				var total = $scope.diferencia;
	    		return parseFloat(total,"")-parseFloat(dtoEnPesos,"");
			}else if(valDtoEnPesos && !valInteresTarjeta){
				var total = $scope.diferencia;
	    		interesTarjeta = interesTarjeta/100*total;
	    		return parseFloat(total,"")+parseFloat(interesTarjeta,"");
			}else if(!valDtoEnPesos && !valInteresTarjeta){
				var total = $scope.diferencia;
	    		var totalConDescuento = parseFloat(total,"")-parseFloat(dtoEnPesos,"");
	    		interesTarjeta = interesTarjeta/100*totalConDescuento;
	    		return totalConDescuento+parseFloat(interesTarjeta,"");
			}
		}

		$scope.getCuotasDevolucion = function(cuotasTarjeta,dtoEnPesos,interesTarjeta,pmCobradoTarjetaDev){
			if(pmCobradoTarjetaDev === undefined){
				var totalDevolucion = $scope.getTotalDevolucion(dtoEnPesos,interesTarjeta);
				valorCuotas = totalDevolucion/cuotasTarjeta;
				return valorCuotas;
			}else{
				var totalDevolucion = pmCobradoTarjetaDev;
				valorCuotas = totalDevolucion/cuotasTarjeta;
				return valorCuotas;
			}
		}

		$scope.guardarDevolucion = function(data){

			$scope.detalleDevolucion = [];

			if(data.medioCobro === undefined){
				data.medioCobro = "3";
			}

			switch (data.medioCobro) {
				case "1":
					data.pmCobradoEfectivoDev = 0;
					data.pmCobradoTarjetaDev = $scope.getTotalDevolucion();
					break;
				case "2":
	        		data.pmCobradoEfectivoDev = 0;
					data.pmCobradoTarjetaDev = $scope.getTotalDevolucion();
					break;
				case "3":
	        		data.pmCobradoEfectivoDev = $scope.getTotalDevolucion();
					data.pmCobradoTarjetaDev = 0;
					break;
				case "4":
	        		if(data.pmCobradoEfectivoDev === undefined){
	        			data.pmCobradoEfectivoDev = $scope.getTotalDevolucion(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoTarjetaDev;
	        		}else if(data.pmCobradoTarjetaDev === undefined){
	        			data.pmCobradoTarjetaDev = $scope.getTotalDevolucion(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoEfectivoDev;
	        		}
					break;
				case "5":
	        		if(data.pmCobradoEfectivoDev === undefined){
	        			data.pmCobradoEfectivoDev = $scope.getTotalDevolucion(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoTarjetaDev;
	        		}else if(data.pmCobradoTarjetaDev === undefined){
	        			data.pmCobradoTarjetaDev = $scope.getTotalDevolucion(data.dtoEnPesos,data.interesTarjeta)-data.pmCobradoEfectivoDev;
	        		}
					break;
			}

			$scope.datosDevolucion = {
				"devolucion" : {
					"id_medio_cobro"		: (data.medioCobro === undefined) ? 3 : parseInt(data.medioCobro,""),
					"cobrado_efectivo"		: parseFloat(data.pmCobradoEfectivoDev,""),
					"cobrado_tarjeta"		: parseFloat(data.pmCobradoTarjetaDev,""),
					"cuotas_tarjeta"		: (data.cuotasTarjeta === "Cuotas") ? 0 : parseInt(data.cuotasTarjeta,""),
					"descuento_devolucion"	: (data.dtoEnPesos === undefined) ? 0 : parseFloat(data.dtoEnPesos,""),
					"interes_devolucion"	: (data.interesTarjeta === undefined) ? 0 : parseInt(data.interesTarjeta,"")
				}
			};

			$scope.datosDevolucion.items_devolucion = [];




			angular.forEach($scope.devolucion.productosADevolver, function(value, key) {

				$scope.datosDevolucion.items_devolucion.push({

					"item_a_devolver" : {
						"num_detalle"			: key,
						"id_producto"			: parseInt(value.idProducto),
						"codigo_control"		: value.codigoProducto,
						"precio_producto"		: parseFloat(value.precioProducto,""),
						"cantidad_devuelta"		: parseInt(value.cantidadProducto,"")
						//"total_venta"			: parseFloat($scope.getTotal(data.dtoEnPesos,data.interesTarjeta),"")
					}
				});

				//ServiceStock.update({ accion:'subir', cantidad: parseInt(value.cantidadProducto,""), id_producto: parseInt(value.idProducto,"")  });

			});



			angular.forEach($scope.devolucion.productosQRetira, function(value, key) {

				$scope.datosDevolucion.items_devolucion.push({

					"item_q_retira" : {
						"num_detalle"			: key,
						"id_producto"			: parseInt(value.idProductoRetira,""),
						"codigo_control"		: value.codigoProductoRetira,
						"precio_producto"		: parseFloat(value.precioProductoRetira,""),
						"cantidad_retirada"		: parseInt(value.cantidadProductoRetira,"")
						//"total_venta"			: parseFloat($scope.getTotal(data.dtoEnPesos,data.interesTarjeta),"")
					}
				});

				//ServiceStock.update({ accion:'bajar', cantidad: parseInt(value.cantidadProducto,""), id_producto: parseInt(value.id_producto,"")  });

			});

			$scope.detalleDevolucion.push($scope.datosDevolucion);

			console.log($scope.detalleDevolucion);


			ServiceDevoluciones.save($scope.detalleDevolucion, function success(data){
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				console.log($scope.respuesta.Mensaje);
				if($scope.mensaje === 1){
					$scope.mensaje = "Devolucion realizada";
				};
				$window.scrollTo(0,0);
				$route.reload("devolucion-controller");
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
				var devolucionAsoc = $scope.mensaje.indexOf("SQLSTATE[23000]") > -1;
				if($scope.respuesta.status === 503 && !devolucionAsoc){
					$scope.mensaje = ":( Ha habido un error";
				}else if($scope.respuesta.status === 503 && devolucionAsoc){
					$scope.mensaje = ":( Ha habido un error";
				};
				console.log($scope.respuesta.data.Mensaje);
				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
				}, 1000);
			});

		};


	}



}]);