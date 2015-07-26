bazar.app.controller('marcas-controller', [
	'$scope', '$location', '$window', '$route', '$modal', '$filter', 'ServiceProductos', 'ServiceMarcas', 'ServiceProveedores', 'filterFilter', '$timeout',
	function ($scope, $location, $window, $route, $modal, $filter, ServiceProductos, ServiceMarcas, ServiceProveedores, filterFilter, $timeout) {

	//TRAE MARCAS

	$scope.cargarMarcas = function(){
		$scope.marcas = ServiceMarcas.query();
		$scope.currentPage = 1;
		$scope.entryLimit = 10;

		$timeout(function() {
			$scope.filteredItems = $scope.marcas;
			$scope.filteredItems = $scope.filteredItems.length;
			$scope.totalItems = $scope.marcas.length;
			$scope.listo = false;
		}, 1500);
	};

	$scope.cargarMarcas();

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
		var fullName = item.id_marca+item.nombre_marca;
		var text = removeAccents(fullName.toLowerCase());
		var search = removeAccents($scope.search.toLowerCase());
		return text.indexOf(search) > -1;
	};

	//NOTIFICACIONES

	$scope.resultado = false;

	//BORRADO

	$scope.borrar = function(marca){
		if(confirm("Seguro quieres eliminar esta marca?\n"+marca.nombre_marca)){
			$scope.id_marca = marca.id_marca;
			marca.$delete({id_marca: $scope.id_marca}, function success(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-success";
				$scope.icoMensaje = "fa-check";
				$scope.mensaje = $scope.respuesta.Mensaje;
				if($scope.mensaje === 1){
					$scope.mensaje = "Se ha eliminado la marca correctamente";
				};
				$window.scrollTo(0,0);
				$scope.cargarMarcas();
				$timeout(function() {
					$scope.resultado = false;
				}, 2500);
			}, function err(data) {
				$scope.resultado = true;
				$scope.respuesta = data;
				$scope.claseMensaje = "alert-danger";
				$scope.icoMensaje = "fa-ban";
				$scope.mensaje = $scope.respuesta.data.Mensaje;

				var prodAsoc = $scope.mensaje.indexOf("1451") > -1;
				if($scope.respuesta.status === 503 && !prodAsoc){
					$scope.mensaje = ":( Ha habido un error, no se ha eliminado";
				}else if($scope.respuesta.status === 503 && prodAsoc){
					$scope.mensaje = ":( Esta marca, esta asociada a otros productos y no se puede eliminar";
				};

				$window.scrollTo(0,0);
				$timeout(function() {
					$scope.resultado = false;
				}, 2500);
			});
		}
	};

	//EDITAR 1RA PARTE


	$scope.animationsEnabled = true;

	$scope.open = function (m,size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'html/edita-marca.html',
			controller: 'edita-marca-controller',
			size: size,
			resolve: {
				item: function () {
					return m;
				}
			}
		});
	};

	//AÑADIR 1RA PARTE

	$scope.openNuevaMarca = function () {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'html/nueva-marca.html',
			controller: 'nueva-marca-controller'
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
