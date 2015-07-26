<?php

if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

$app->put("/stock/:accion/:cantidad/:id_producto", function($accion,$cantidad,$id_producto) use($app){

	if($app->request->isPut()){

		switch ($accion) {
			case 'subir':
				$sql = "UPDATE productos SET cantidad_producto = cantidad_producto+'$cantidad' WHERE id_producto = '$id_producto'";
				break;
			case 'bajar':
				$sql = "UPDATE productos SET cantidad_producto = cantidad_producto-'$cantidad' WHERE id_producto = '$id_producto'";
				break;

			default:
				$sql = "";
				break;
		}

    	try{
			$connection = getConnection();
			//$sql = "UPDATE productos SET cantidad_producto = cantidad_producto+'$cantidad' WHERE id_producto = '$id_producto'";
			$dbh = $connection->prepare($sql);
			$dbh->execute();
			$connection = null;
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(200);
			$app->response->body(json_encode(array("Mensaje" => 1)));
		}
		catch(PDOException $e)
		{
			echo "Error: " . $e->getMessage();
		}

	}

});
