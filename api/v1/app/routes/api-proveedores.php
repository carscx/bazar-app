<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

$app->get("/proveedores/", function() use($app)
{
	try{
		$sql = "SELECT prov.id_proveedor,prov.nombre_proveedor,prov.direccion_proveedor,prov.tel_proveedor,prov.mail_proveedor,prov.web_proveedor,prov.observaciones_proveedor, prov.estado_proveedor
				FROM proveedores prov
				WHERE prov.estado_proveedor = 1
				ORDER BY prov.nombre_proveedor";
		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$proveedores = $dbh->fetchAll();
		$connection = null;

		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($proveedores));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});


$app->delete("/proveedores/:id_proveedor", function($id_proveedor) use($app)
{
	try{
		$connection = getConnection();
		$dbh = $connection->prepare("UPDATE proveedores SET estado_proveedor = 0 WHERE id_proveedor = ?");
		$dbh->bindParam(1, $id_proveedor);
		$dbh->execute();
		$connection = null;
		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode(array("Mensaje" => 1)));
	}
	catch(PDOException $e)
	{
		//echo "Error: " . $e->getMessage();
		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(503);
		$app->response->body(json_encode(array("Mensaje" => $e->getMessage())));
	}
});

