<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

$app->get("/genera-codigo", function() use($app){

	$codigo_control = generaCodigo();

	$app->response->headers->set("Content-type", "application/json");
	$app->response->status(200);
	$app->response->body(json_encode(array('Codigo' => $codigo_control)));

});


$app->get("/ventas/", function() use($app){
	try{

		$sql = "SELECT v.id_venta, v.id_medio_cobro, v.cobrado_efectivo,v.cobrado_tarjeta,v.cuotas_tarjeta,v.descuento_venta, v.interes_venta, v.estado_venta, v.fecha_alta_venta, v.fecha_edit_venta,
						mc.id_mcobro, mc.nombre_mcobro
				FROM ventas v, medios_cobro mc
				WHERE mc.id_mcobro = v.id_medio_cobro  LIMIT 10";


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


$app->get("/detalle-venta/:id_venta", function($id_venta) use($app){
	try{

		$sql = "SELECT p.id_producto, p.nombre_producto, p.codigo_control,
						dv.id_venta, dv.num_detalle, dv.id_producto, dv.precio_producto, dv.cantidad_vendida
				FROM productos p, detalle_ventas dv
				WHERE dv.id_venta = $id_venta AND p.id_producto = dv.id_producto LIMIT 10";

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

$app->post("/ventas/", function() use($app){

	if($app->request->isPost()){

	    $body = $app->request->getBody();

    	if($body == null){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Hay un error en la venta")));
    		$app->stop();
    	}else{
    		$datos = json_decode($body);
    	}

    	foreach ($datos as $dato) {
			$id_medio_cobro = $dato->venta->id_medio_cobro;
			$cobrado_efectivo = $dato->venta->cobrado_efectivo;
			$cobrado_tarjeta = $dato->venta->cobrado_tarjeta;
			$cuotas_tarjeta = $dato->venta->cuotas_tarjeta;
			$descuento_venta = $dato->venta->descuento_venta;
			$interes_venta = $dato->venta->interes_venta;
    	}

		try{
			$connection = getConnection();
			$sql = "INSERT INTO ventas (id_venta, id_medio_cobro, cobrado_efectivo, cobrado_tarjeta, cuotas_tarjeta, descuento_venta, interes_venta, estado_venta, fecha_alta_venta, fecha_edit_venta)
					VALUES(null, '$id_medio_cobro', '$cobrado_efectivo', '$cobrado_tarjeta', '$cuotas_tarjeta', '$descuento_venta', '$interes_venta', 1, NOW(), NOW())";
			$dbh = $connection->prepare($sql);
			$dbh->execute();
			$ventaId = $connection->lastInsertId();
			$connection = null;
			foreach ($datos as $dato) {
				foreach ($dato->items_venta as $datoItemVenta) {
					$num_detalle = $datoItemVenta->item_venta->num_detalle;
					$id_producto = $datoItemVenta->item_venta->id_producto;
					$precio_producto = $datoItemVenta->item_venta->precio_producto;
					$cantidad_vendida = $datoItemVenta->item_venta->cantidad_vendida;
					$connection = getConnection();
					$sql = "INSERT INTO detalle_ventas (id_venta, num_detalle, id_producto, precio_producto, cantidad_vendida)
							VALUES('$ventaId', '$num_detalle', '$id_producto', '$precio_producto','$cantidad_vendida')";
					$dbh = $connection->prepare($sql);
					$dbh->execute();
					$connection = null;
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
