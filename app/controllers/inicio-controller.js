bazar.app.controller('inicio-controller', ['$scope', '$rootScope', function ($scope, $rootScope) {

	$scope.bienvenido = "#Bienvenid@!";

	$scope.refranes = [
		{id_refran:1, texto_refran:"Quien bien te quiere te hará llorar"},
		{id_refran:2, texto_refran:"Mientras hay vida hay esperanza"},
		{id_refran:3, texto_refran:"Amor con amor se paga."},
		{id_refran:4, texto_refran:"La memoria es como el mal amigo: cuando más falta te hace, te falla."},
		{id_refran:5, texto_refran:"Cuando el hombre es celoso, molesta; cuando no lo es, irrita."},
		{id_refran:6, texto_refran:"Más vale feo y bueno que guapo y perverso."},
		{id_refran:7, texto_refran:"La probabilidad de hacer mal se encuentra cien veces al día; la de hacer bien una vez al año."},
		{id_refran:8, texto_refran:"Ama a quien no te ama, responde a quien no te llama, andarás carrera vana."},
		{id_refran:9, texto_refran:"Cuando fuiste martillo no tuviste clemencia, ahora que eres yunque, ten paciencia."},
		{id_refran:10, texto_refran:"Quien no buscó amigos en la alegría, en la desgracia no los pida."},
		{id_refran:11, texto_refran:"Nunca es tarde para bien hacer; haz hoy lo que no hiciste ayer."},
		{id_refran:12, texto_refran:"A quien Dios no le dio hijos, el diablo le dio sobrinos."},
		{id_refran:13, texto_refran:"Antes que te cases, mira lo que haces."},
		{id_refran:14, texto_refran:"Más rápido se atrapa al mentiroso que al cojo."},
		{id_refran:15, texto_refran:"Quien da pan a perro ajeno, pierde el pan y pierde el perro."},
		{id_refran:16, texto_refran:"La conciencia es, a la vez, testigo, fiscal y juez."},
		{id_refran:17, texto_refran:"Quien todo lo quiere, todo lo pierde."},
		{id_refran:18, texto_refran:"Quien adelante no mira, atrás se queda."},
		{id_refran:19, texto_refran:"El que la sigue la consigue."},
		{id_refran:20, texto_refran:"El infierno está lleno de buenas intenciones y el cielo de buenas obras."},
		{id_refran:21, texto_refran:"Más vale malo conocido que bueno por conocer."},
		{id_refran:22, texto_refran:"Dinero ahorrado, dos veces ganado."},
		{id_refran:23, texto_refran:"Dinero que prestaste, enemigo que te echaste."},
		{id_refran:24, texto_refran:"Dinero sin caridad, es pobreza de verdad."},
		{id_refran:25, texto_refran:"Dinero y salud, cuídalos con prontitud."},
		{id_refran:26, texto_refran:"Dineros de sacristán, cantando se vienen cantando se van."},
		{id_refran:27, texto_refran:"El dinero al ignorante, lo hace necio y petulante."},
		{id_refran:28, texto_refran:"El dinero como el chisme, se hicieron para contarlo."},
		{id_refran:29, texto_refran:"El dinero del mezquino anda dos veces el camino."},
		{id_refran:30, texto_refran:"El dinero del pobre dos veces se gasta."},
		{id_refran:31, texto_refran:"El dinero del tonto se escurre pronto."},
		{id_refran:32, texto_refran:"El dinero y los santos hacen milagros."}
	];

	$scope.refran_aleatorio = $scope.refranes[Math.floor(Math.random() * $scope.refranes.length)];


	$scope.fecha = 'dd-MM-yyyy';
	$scope.hora = 'HH:mm';
	$scope.segundos = ':ss';


}]);