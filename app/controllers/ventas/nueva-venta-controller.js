bazar.app.controller('nueva-venta-controller', function ($scope, $rootScope, $location, $modal, $filter, ServiceProductos, filterFilter,$timeout) {

    $scope.cargarProductos = function(){
        $scope.productos = ServiceProductos.query();
        $scope.currentPage = 1;
        $scope.entryLimit = 10;

        $timeout(function() {
            $scope.filteredItems = $scope.productos;
            $scope.filteredItems = $scope.filteredItems.length;
            $scope.totalItems = $scope.productos.length;
            $scope.listo = false;
        }, 2000);
    };

    $scope.cargarProductos();

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
        var fullName = item.id_producto+item.nombre_producto+item.pcosto_producto+item.precio_producto+item.nombre_marca+item.nombre_proveedor+item.codigo_control;
        var text = removeAccents(fullName.toLowerCase());
        var search = removeAccents($scope.search.toLowerCase());
        return text.indexOf(search) > -1;
    };


    $scope.productosSeleccionados = [];

    $scope.open = function (p,origen) {

        $scope.origen = origen;

        if($scope.origen == "listado"){
            if(p.cantidad_producto < p.cantidad_a_vender || p.cantidad_a_vender === undefined){
                $timeout(function() {
                    window.alert("No puedes vender productos sin existencias");
                },1);
                return false;
            }

            $scope.productosSeleccionados.push({
                id_producto: p.id_producto,
                nombre_producto: p.nombre_producto,
                precio_producto: p.precio_producto,
                cantidad_a_vender: p.cantidad_a_vender
            });

            if($scope.productosSeleccionados.length > 1){
                var arr = {};
                for ( var i=0; i < $scope.productosSeleccionados.length; i++ ){
                    arr[$scope.productosSeleccionados[i]['id_producto']] = $scope.productosSeleccionados[i];
                }

                $scope.productosSeleccionados = new Array();

                for ( var key in arr ){
                    $scope.productosSeleccionados.push(arr[key]);
                }
            }

        }

        var modalInstance = $modal.open({
          templateUrl: 'html/vender-producto.html',
          controller: 'venta-producto-controller',
          size: "lg",
          resolve: {
            item: function () {
              return p;
            },
            productosSeleccionados: function () {
              return $scope.productosSeleccionados;
            }
          }
        });

    };

    $scope.eliminaTotalVenta = function(){
        $scope.productosSeleccionados = [];
    };

});
