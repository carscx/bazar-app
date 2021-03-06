bazar.app.controller('proveedores-controller', [
	'$scope', '$location', '$window', '$route', '$modal', '$filter', 'ServiceProductos', 'ServiceMarcas', 'ServiceProveedores', 'filterFilter', '$timeout',
	function ($scope, $location, $window, $route, $modal, $filter, ServiceProductos, ServiceMarcas, ServiceProveedores, filterFilter, $timeout) {

	//TRAE PROVEEDORES

	$scope.cargarProveedores = function(){
		$scope.proveedores = ServiceProveedores.query();
		$scope.currentPage = 1;
		$scope.entryLimit = 10;

		$timeout(function() {
			$scope.filteredItems = $scope.proveedores;
			$scope.filteredItems = $scope.filteredItems.length;
			$scope.totalItems = $scope.proveedores.length;
			$scope.listo = false;
		}, 1500);
	};

	$scope.cargarProveedores();

	//BUSQUEDA

	var removeAccents = function (value) {
		return value
			.replace(/á/g, 'a')
			.replace(/é/g, 'e')
			.replace(/í/g, 'i')
			.replace(/ó/g, 'o')
			.replace(/ú/g, 'u')
			.replace(/ñ/g, 'n');

	};

	$scope.setPage = function(pageNo) {
		$scope.currentPage = pageNo;
	};

   	$scope.filter = function() {
		$timeout(function() {
			$scope.filteredItems = $scope.filtered.length;
		}, 1);
	};

	$scope.sort_by = function(predicate) {
		$scope.predicate = predicate;
		$scope.reverse = !$scope.reverse;
	};

	$scope.ignoreAccents = function(item) {
		if (!$scope.search){
			return true;
		}
		var fullName = item.id_proveedor+item.nombre_proveedor+item.direccion_proveedor+item.tel_proveedor+item.mail_proveedor+item.web_proveedor+item.observaciones_proveedor;
		var text = removeAccents(fullName.toLowerCase());
		var search = removeAccents($scope.search.toLowerCase());
		return text.indexOf(search) > -1;
	};

	//NOTIFICACIONES

	$scope.resultado = false;

	//BORRADO

	$scope.borrar = function(proveedor){
		if(confirm("Seguro quieres eliminar este proveedor?\n"+proveedor.nombre_proveedor)){
			$scope.id_proveedor = proveedor.id_proveedor;
			proveedor.$delete({id_proveedor: $scope.id_proveedor}, function success(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				if($scope.mensaje === 1){
					$scope.mensaje = "Se ha eliminado el proveedor correctamente";
				};
				console.log($scope.respuesta.Mensaje);
				$window.scrollTo(0,0);
				$scope.cargarProveedores();
				$timeout(function() {
					$scope.resultado = false;
				}, 2500);
			}, function err(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-danger";
				$scope.icoMensaje = "fa-ban";
				$scope.mensaje = $scope.respuesta.data.Mensaje;
				if($scope.respuesta.status === 503){
					$scope.mensaje = ":( Ha habido un error, no se ha eliminado";
				};
				console.log($scope.respuesta.data.Mensaje);
				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
				}, 2500);
			});
		}
	};

	//EDITAR 1RA PARTE
	$scope.animationsEnabled = true;

	$scope.open = function (prov,size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'html/edita-proveedor.html',
			controller: 'edita-proveedor-controller',
			size: size,
			resolve: {
				item: function () {
					return prov;
				}
			}
		});

	};

	//BORRADO MULTIPLE
/*
	$scope.idProductoSeleccionado = null;

	$scope.productosSeleccionados = [];

	$scope.borraMultiProd = function(p,$event){

		$scope.idProductoSeleccionado = p.id_producto;

		var scope = angular.element($event.target).scope();

		var addToArray=true;
		for(var i=0;i<$scope.productosSeleccionados.length;i++){

			if($scope.productosSeleccionados[i].id_producto===$scope.idProductoSeleccionado){
				addToArray=false;
				scope.p.active = false;
			}
		}

		if(addToArray){
			$scope.productosSeleccionados.push({
            	id_producto: $scope.idProductoSeleccionado
        	});
        	scope.p.active = true;
		}
        console.log($scope.productosSeleccionados);

	};
*/

}]);