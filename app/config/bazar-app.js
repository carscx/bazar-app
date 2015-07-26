'use strict';
var bazar = bazar || {};

bazar.app = angular.module("bazar",["ngRoute", "ngResource", "ui.bootstrap", "ngAnimate"]);


bazar.app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {

	$routeProvider
	.when('/', {
		title: 'Inicio',
		templateUrl: 'html/inicio.html',
		controller: 'inicio-controller'
	})
	.when('/nueva-venta', {
		title: 'Nueva Venta',
		templateUrl: 'html/nueva-venta.html',
		controller: 'nueva-venta-controller'
	})
	.when('/productos', {
		title: 'Productos',
		templateUrl: 'html/productos.html',
		controller: 'productos-controller'
	})
	.when('/nuevo-producto', {
		title: 'Nuevo producto',
		templateUrl: 'html/nuevo-producto.html',
		controller: 'nuevo-producto-controller'
	})
	.when('/marcas', {
		title: 'Marcas',
		templateUrl: 'html/marcas.html',
		controller: 'marcas-controller'
	})
	.when('/proveedores', {
		title: 'Proveedores',
		templateUrl: 'html/proveedores.html',
		controller: 'proveedores-controller'
	})
	.when('/devolucion', {
		title: 'Devolución',
		templateUrl: 'html/devolucion.html',
		controller: 'devolucion-controller'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

bazar.app.run(['$location', '$rootScope', function ($location, $rootScope) {

	$rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
		$rootScope.title = currentRoute.title;
	});

}]);