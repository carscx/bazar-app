bazar.app.controller('productos-controller', [
	'$scope', '$location', '$window', '$route', '$modal', '$filter', 'ServiceProductos', 'ServiceMarcas', 'ServiceProveedores', 'filterFilter', '$timeout',
	function ($scope, $location, $window, $route, $modal, $filter, ServiceProductos, ServiceMarcas, ServiceProveedores, filterFilter, $timeout) {


	//TRAE PRODUCTOS
	$scope.actualizar = function(){
		$scope.cargarProductos();
	};

	$scope.cargarProductos = function(){
		$scope.productos = ServiceProductos.query();
		$scope.currentPage = 1;
		$scope.entryLimit = 10;

		$timeout(function() {
			$scope.filteredItems = $scope.productos;
			$scope.filteredItems = $scope.filteredItems.length;
			$scope.totalItems = $scope.productos.length;
			$scope.listo = true;
		}, 1500);
	};

	$scope.cargarProductos();
	$scope.listo = false;
	//TRAE MARCAS Y PROVEEDORES

	$scope.marcas = ServiceMarcas.query();
	$scope.proveedores = ServiceProveedores.query();

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
		var fullName = item.id_producto+item.nombre_producto+item.precio_producto+item.nombre_marca+item.nombre_proveedor+item.codigo_control;
		var text = removeAccents(fullName.toLowerCase());
		var search = removeAccents($scope.search.toLowerCase());
		return text.indexOf(search) > -1;
	};

	//NOTIFICACIONES

	$scope.resultado = false;

	//BORRADO

	$scope.borrar = function(producto){
		if(confirm("Seguro quieres eliminar este producto?\n"+producto.nombre_producto)){
			$scope.id_producto = producto.id_producto;
			producto.$delete({id_producto: $scope.id_producto}, function success(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				if($scope.mensaje === 1){
					$scope.mensaje = "Se ha eliminado el producto correctamente";
				};
				console.log($scope.respuesta.Mensaje);
				$window.scrollTo(0,0);
				$scope.cargarProductos();
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

	$scope.open = function (p,size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'html/edita-producto.html',
			controller: 'edita-producto-controller',
			size: size,
			resolve: {
				marcas: function(){
					return $scope.marcas;
				},
				proveedores: function(){
					return $scope.proveedores;
				},
				item: function () {
					return p;
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