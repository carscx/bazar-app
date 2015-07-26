<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");


$app->get("/devoluciones/", function() use($app){
	try{

		$sql = "SELECT d.id_devolucion, d.id_medio_cobro, d.cobrado_efectivo, d.cobrado_tarjeta, d.cuotas_tarjeta, d.descuento_devolucion, d.interes_devolucion, d.estado_devolucion, d.fecha_alta_devolucion, d.fecha_edit_devolucion,
						mc.id_mcobro, mc.nombre_mcobro
				FROM devoluciones d, medios_cobro mc
				WHERE mc.id_mcobro = d.id_medio_cobro";


		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$rows = $dbh->fetchAll(PDO::FETCH_ASSOC);
		$connection = null;
		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($rows));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});


$app->get("/detalle-devolucion/:id_devolucion", function($id_devolucion) use($app){
	try{

		$sql = "SELECT p.id_producto, p.nombre_producto, p.codigo_control,
						dd.id_devolucion, dd.num_detalle, dd.id_producto, dd.precio_producto, dd.cantidad_devuelta
				FROM productos p, detalle_devolucion dd
				WHERE dd.id_devolucion = $id_devolucion AND p.id_producto = dd.id_producto";

		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$rows = $dbh->fetchAll(PDO::FETCH_ASSOC);
		$connection = null;
		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($rows));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});


$app->get("/detalle-retirada/:id_devolucion", function($id_devolucion) use($app){
	try{

		$sql = "SELECT p.id_producto, p.nombre_producto, p.codigo_control,
						dr.id_devolucion, dr.num_detalle, dr.id_producto, dr.precio_producto, dr.cantidad_retirada
				FROM productos p, detalle_retirada dr
				WHERE dr.id_devolucion = $id_devolucion AND p.id_producto = dr.id_producto";

		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$rows = $dbh->fetchAll(PDO::FETCH_ASSOC);
		$connection = null;
		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($rows));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});

$app->post("/devoluciones/", function() use($app){

	if($app->request->isPost()){

	    $body = $app->request->getBody();

    	if($body == null){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Hay un error en la devolucion")));
    		$app->stop();
    	}else{
    		$datos = json_decode($body);
    	}
    		//var_dump($datos);
    	foreach ($datos as $dato) {
			$id_medio_cobro = $dato->devolucion->id_medio_cobro;
			$cobrado_efectivo = $dato->devolucion->cobrado_efectivo;
			$cobrado_tarjeta = $dato->devolucion->cobrado_tarjeta;
			$cuotas_tarjeta = $dato->devolucion->cuotas_tarjeta;
			$descuento_devolucion = $dato->devolucion->descuento_devolucion;
			$interes_devolucion = $dato->devolucion->interes_devolucion;
    	}

		try{
			$connection = getConnection();
			$sql = "INSERT INTO devoluciones (id_devolucion, id_medio_cobro, cobrado_efectivo, cobrado_tarjeta, cuotas_tarjeta, descuento_devolucion, interes_devolucion, estado_devolucion, fecha_alta_devolucion, fecha_edit_devolucion)
					VALUES(null, '$id_medio_cobro', '$cobrado_efectivo', '$cobrado_tarjeta', '$cuotas_tarjeta', '$descuento_devolucion', '$interes_devolucion', 1, NOW(), NOW())";
			$dbh = $connection->prepare($sql);
			$dbh->execute();
			$devolucionId = $connection->lastInsertId();
			$connection = null;
			foreach ($datos as $dato) {
				var_dump($dato->items_devolucion);
				foreach ($dato->items_devolucion as $datoItemDevolucion) {
					foreach ($datoItemDevolucion as $datoItemADevolver) {
						$num_detalle = $datoItemADevolver->num_detalle;
						$id_producto = $datoItemADevolver->id_producto;
						$precio_producto = $datoItemADevolver->precio_producto;
						$cantidad_devuelta = $datoItemADevolver->cantidad_devuelta;
						$connection = getConnection();
						$sql = "INSERT INTO detalle_devolucion (id_devolucion, num_detalle, id_producto, precio_producto, cantidad_devuelta)
								VALUES('$devolucionId', '$num_detalle', '$id_producto', '$precio_producto','$cantidad_devuelta')";
						$dbh = $connection->prepare($sql);
						$dbh->execute();
						$connection = null;
					}
				}
			}
			foreach ($datos as $dato) {
				foreach ($dato->items_devolucion as $datoItemRetira) {
					foreach ($datoItemRetira as $datoItemARetirar) {
						$num_detalle = $datoItemARetirar->num_detalle;
						$id_producto = $datoItemARetirar->id_producto;
						$precio_producto = $datoItemARetirar->precio_producto;
						$cantidad_retirada = $datoItemARetirar->cantidad_retirada;
						$connection = getConnection();
						$sql = "INSERT INTO detalle_devolucion (id_devolucion, num_detalle, id_producto, precio_producto, cantidad_retirada)
								VALUES('$devolucionId', '$num_detalle', '$id_producto', '$precio_producto','$cantidad_retirada')";
						$dbh = $connection->prepare($sql);
						$dbh->execute();
						$connection = null;
					}
				}
			}

			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(200);
			$app->response->body(json_encode(array("Mensaje" => 1)));
		}
		catch(PDOException $e){
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => $e->getMessage())));
			//echo "Error: " . $e->getMessage();
		}

	}

});
