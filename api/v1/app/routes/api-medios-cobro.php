<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

$app->get("/medios-cobro/", function() use($app){
	try{

		$sql = "SELECT mc.id_mcobro, mc.nombre_mcobro, mc.fecha_alta_cobro, mc.fecha_edit_cobro, mc.estado_cobro
				FROM medios_cobro mc
				WHERE mc.estado_cobro = 1";

		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$rows = $dbh->fetchAll();
		$connection = null;

		/*$mcobros = array(
			'id_mcobro'=>$rows[0]['id_mcobro'],
			'nombre_mcobro'=>$rows[0]['nombre_mcobro'],
			'fecha_alta_cobro'=>$rows[0]['fecha_edit_cobro'],
			'estado_cobro'=>$rows[0]['estado_cobro']
		);*/

		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($rows, JSON_PRETTY_PRINT));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});

