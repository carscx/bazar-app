<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

$app->get("/marcas/", function() use($app)
{
	try{
		$sql = "SELECT m.id_marca,m.nombre_marca, m.fecha_alta_marca, m.fecha_edit_marca, m.estado_marca
				FROM marcas m
				WHERE estado_marca = 1
				ORDER BY m.nombre_marca";
		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$marcas = $dbh->fetchAll();
		$connection = null;

		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($marcas));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});

$app->post("/marcas/", function() use($app){

	if($app->request->isPost()){

	    $body = $app->request->getBody();

    	if($body == null){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    		$app->stop();
    	}else{
    		$datos = json_decode($body);
    	}


    	if(property_exists($datos, "nombre_marca")){
    		$nombre_marca = strtolower($datos->nombre_marca);
    		$nombre_marca = ucfirst($nombre_marca);
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    			$app->stop();
			});
    	}

    	try{
			$connection = getConnection();
			$sql = "INSERT INTO marcas (id_marca, nombre_marca, fecha_alta_marca, fecha_edit_marca, estado_marca)
					VALUES(null, '$nombre_marca', NOW(), NOW(), 1)";
			$dbh = $connection->prepare($sql);
			$dbh->bindParam(1, $nombre_marca);
			$dbh->execute();
			$marcaId = $connection->lastInsertId();
			$connection = null;
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

$app->put("/marcas/:id_marca", function($id_marca) use($app){

		$body = $app->request->getBody();

		if($body == null){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    		$app->stop();
    	}else{
    		$datos = json_decode($body);
    	}


    	if(property_exists($datos, "id_marca")){
    		$id_marca = $datos->id_marca;
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "No esta el ID de la marca")));
    			$app->stop();
			});
    	}

    	if(property_exists($datos, "nombre_marca")){
    		$nombre_marca = $datos->nombre_marca;
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    			$app->stop();
			});
    	}

    	if(property_exists($datos, "fecha_alta_marca")){
    		$fecha_alta_marca = $datos->fecha_alta_marca;
    	}else{
    		$fecha_alta_marca = null;
    	}

	try{
		$connection = getConnection();
		$sql = "UPDATE marcas SET nombre_marca = '$nombre_marca', fecha_alta_marca = '$fecha_alta_marca', fecha_edit_marca = NOW(), estado_marca = 1 WHERE id_marca = '$id_marca'";
		$dbh = $connection->prepare($sql);
		$dbh->bindParam(1, $nombre_marca);
		$dbh->bindParam(2, $fecha_alta_marca);
		$dbh->bindParam(3, $id_marca);
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
});


$app->delete("/marcas/:id_marca", function($id_marca) use($app)
{
	try{
		$connection = getConnection();
		$dbh = $connection->prepare("UPDATE marcas SET estado_marca = 0 WHERE id_marca = ?");
		$dbh->bindParam(1, $id_marca);
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

