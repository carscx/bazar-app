<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");


$app->get("/productos/", function() use($app){
	try{

/*		$sql = "SELECT p.id_producto,p.nombre_producto,p.pcosto_producto,p.precio_producto,p.id_marca,p.id_proveedor,p.cantidad_producto,p.observaciones_producto,p.fecha_alta_producto,p.fecha_edit_producto,p.estado_producto, p.codigo_control, m.id_marca,m.nombre_marca,prov.id_proveedor,prov.nombre_proveedor
				FROM productos p, marcas m, proveedores prov
				WHERE p.id_marca=m.id_marca AND p.id_proveedor=prov.id_proveedor AND p.estado_producto = 1 ORDER BY p.nombre_producto ASC";
*/
		$sql = "SELECT p.id_producto,p.nombre_producto,p.pcosto_producto,p.precio_producto,p.id_marca,p.id_proveedor,p.cantidad_producto,p.observaciones_producto,p.fecha_alta_producto,p.fecha_edit_producto,p.estado_producto, p.codigo_control, m.id_marca,m.nombre_marca,prov.id_proveedor,prov.nombre_proveedor
				FROM productos p
				INNER JOIN marcas m ON (p.id_marca = m.id_marca)
				INNER JOIN proveedores prov ON (p.id_proveedor = prov.id_proveedor)
				WHERE  p.estado_producto = 1 ORDER BY p.nombre_producto ASC";

		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->execute();
		$productos = $dbh->fetchAll();
		$connection = null;

		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($productos));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});

$app->get("/productos/:id_producto", function($id_producto) use($app){
	try{

		$sql = "SELECT p.id_producto,p.nombre_producto,p.pcosto_producto,p.precio_producto,p.id_marca,p.id_proveedor,p.cantidad_producto,p.observaciones_producto,p.fecha_alta_producto,p.fecha_edit_producto,p.estado_producto, p.codigo_control,m.id_marca,m.nombre_marca,prov.id_proveedor,prov.nombre_proveedor
				FROM productos p, marcas m, proveedores prov
				WHERE p.id_marca=m.id_marca AND p.id_proveedor=prov.id_proveedor AND p.id_producto = :id_producto AND p.estado_producto = 1";
		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->bindParam("id_producto", $id_producto);
		$dbh->execute();
		$producto = $dbh->fetchAll(PDO::FETCH_ASSOC);
		$connection = null;

		$app->response->headers->set("Content-type", "application/json");
		$app->response->status(200);
		$app->response->body(json_encode($producto));
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});


$app->get("/producto-por-codigo/:codigo_control", function($codigo_control) use($app){
	try{

		$sql = "SELECT p.id_producto,p.nombre_producto,p.pcosto_producto,p.precio_producto,p.id_marca,p.id_proveedor,p.cantidad_producto,p.observaciones_producto,p.fecha_alta_producto,p.fecha_edit_producto,p.estado_producto, p.codigo_control,m.id_marca,m.nombre_marca,prov.id_proveedor,prov.nombre_proveedor
				FROM productos p, marcas m, proveedores prov
				WHERE p.id_marca=m.id_marca AND p.id_proveedor=prov.id_proveedor AND p.codigo_control = '$codigo_control' AND p.estado_producto = 1";
		$connection = getConnection();
		$dbh = $connection->prepare($sql);
		$dbh->bindParam("codigo_control", $codigo_control);
		$dbh->execute();
		$producto = $dbh->fetchAll(PDO::FETCH_ASSOC);
		$connection = null;
		if(!empty($producto)){
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(200);
			$app->response->body(json_encode($producto));
		}else{
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "No hemos encontrado el producto")));
    		$app->stop();
		}

	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
});


$app->post("/productos/", function() use($app){

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


    	if(property_exists($datos, "nombre_producto")){
    		$nombre_producto = strtolower($datos->nombre_producto);
    		$nombre_producto = ucfirst($nombre_producto);
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    			$app->stop();
			});
    	}

    	if(property_exists($datos, "pcosto_producto")){
    		$pcosto_producto = $datos->pcosto_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El precio de costo es obligatorio")));
			$app->stop();
    	}

		if(property_exists($datos, "precio_producto")){
    		$precio_producto = $datos->precio_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El precio es obligatorio")));
			$app->stop();
    	}

		if(property_exists($datos, "id_marca")){
    		$id_marca = $datos->id_marca;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Tienes que elegir una marca")));
			$app->stop();
    	}

    	if(property_exists($datos, "id_proveedor")){
    		$id_proveedor = $datos->id_proveedor;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Tienes que elegir un proveedor")));
			$app->stop();
    	}

    	if(property_exists($datos, "cantidad_producto")){
    		$cantidad_producto = $datos->cantidad_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "La cantidad es obligatoria")));
			$app->stop();
    	}


    	if(property_exists($datos, "observaciones_producto")){
    		$observaciones_producto = strtolower($datos->observaciones_producto);
    		$observaciones_producto = ucfirst($observaciones_producto);
    	}else{
    		$observaciones_producto = null;
    	}

    	if($pcosto_producto >= $precio_producto){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El precio de costo es mayor ó igual al precio al publico")));
			$app->stop();
    	}

    	$codigo_control = generaCodigo();
    	//$codigo_control = "NK1646";

    	try{
			$connection = getConnection();
			$sql = "INSERT INTO productos (id_producto, nombre_producto, pcosto_producto, precio_producto, id_marca, id_proveedor, cantidad_producto, observaciones_producto, fecha_alta_producto, fecha_edit_producto, estado_producto, codigo_control)
					VALUES(null, '$nombre_producto', '$pcosto_producto', '$precio_producto', '$id_marca', '$id_proveedor', '$cantidad_producto', '$observaciones_producto', NOW(), NOW(), 1,'$codigo_control')";
			//$sql = $connection->prepare();
			$dbh = $connection->prepare($sql);
			$dbh->bindParam(1, $nombre_producto);
			$dbh->bindParam(2, $pcosto_producto);
			$dbh->bindParam(3, $precio_producto);
			$dbh->bindParam(4, $id_marca);
			$dbh->bindParam(5, $id_proveedor);
			$dbh->bindParam(6, $cantidad_producto);
			$dbh->bindParam(7, $observaciones_producto);
			$dbh->execute();
			$productoId = $connection->lastInsertId();
			$connection = null;
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(200);
			$app->response->body(json_encode(array("Mensaje" => 1,"Codigo" => $codigo_control)));
		}
		catch(PDOException $e){
			$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => $e->getMessage())));
			//echo "Error: " . $e->getMessage();
		}

	}

});

$app->put("/productos/:id_producto", function($id_producto) use($app){



		$body = $app->request->getBody();

		if($body == null){
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    		$app->stop();
    	}else{
    		$datos = json_decode($body);
    	}


    	if(property_exists($datos, "id_producto")){
    		$id_producto = $datos->id_producto;
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "No esta el ID del producto")));
    			$app->stop();
			});
    	}

    	if(property_exists($datos, "nombre_producto")){
    		$nombre_producto = strtolower($datos->nombre_producto);
    		$nombre_producto = ucfirst($nombre_producto);
    	}else{
    		$app->error(function (\Exception $e) use ($app) {
    			$app->response->headers->set("Content-type", "application/json");
				$app->response->status(503);
				$app->response->body(json_encode(array("Mensaje" => "El nombre es obligatorio")));
    			$app->stop();
			});
    	}

    	if(property_exists($datos, "pcosto_producto")){
    		$pcosto_producto = $datos->pcosto_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El precio de costo es obligatorio")));
			$app->stop();
    	}

		if(property_exists($datos, "precio_producto")){
    		$precio_producto = $datos->precio_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "El precio es obligatorio")));
			$app->stop();
    	}

		if(property_exists($datos, "id_marca")){
    		$id_marca = $datos->id_marca;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Tienes que elegir una marca")));
			$app->stop();
    	}

    	if(property_exists($datos, "id_proveedor")){
    		$id_proveedor = $datos->id_proveedor;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "Tienes que elegir un proveedor")));
			$app->stop();
    	}

    	if(property_exists($datos, "cantidad_producto")){
    		$cantidad_producto = $datos->cantidad_producto;
    	}else{
    		$app->response->headers->set("Content-type", "application/json");
			$app->response->status(503);
			$app->response->body(json_encode(array("Mensaje" => "La cantidad es obligatoria")));
			$app->stop();
    	}


    	if(property_exists($datos, "observaciones_producto")){
    		$observaciones_producto = strtolower($datos->observaciones_producto);
    		$observaciones_producto = ucfirst($observaciones_producto);
    	}else{
    		$observaciones_producto = null;
    	}

    	if(property_exists($datos, "fecha_alta_producto")){
    		$fecha_alta_producto = $datos->fecha_alta_producto;
    	}else{
    		$fecha_alta_producto = null;
    	}

	try{
		$connection = getConnection();
		$sql = "UPDATE productos SET nombre_producto = '$nombre_producto', pcosto_producto = '$pcosto_producto', precio_producto = '$precio_producto', id_marca = '$id_marca', id_proveedor = '$id_proveedor', cantidad_producto = '$cantidad_producto', observaciones_producto = '$observaciones_producto', fecha_alta_producto = '$fecha_alta_producto', fecha_edit_producto = NOW(), estado_producto = 1  WHERE id_producto = '$id_producto'";
		$dbh = $connection->prepare($sql);
		$dbh->bindParam(1, $nombre_producto);
		$dbh->bindParam(2, $pcosto_producto);
		$dbh->bindParam(3, $precio_producto);
		$dbh->bindParam(4, $id_marca);
		$dbh->bindParam(5, $id_proveedor);
		$dbh->bindParam(6, $cantidad_producto);
		$dbh->bindParam(7, $observaciones_producto);
		$dbh->bindParam(8, $fecha_alta_producto);
		$dbh->bindParam(9, $id_producto);
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


$app->delete("/productos/:id_producto", function($id_producto) use($app)
{
	try{
		$connection = getConnection();
		//$dbh = $connection->prepare("DELETE FROM productos WHERE id_producto = ?");
		$dbh = $connection->prepare("UPDATE productos SET fecha_edit_producto = NOW(), estado_producto = 0 WHERE id_producto = ?");
		$dbh->bindParam(1, $id_producto);
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


$app->delete("/productos/multiple", function() use($app)
{

	try{
		$connection = getConnection();
		$dbh = $connection->prepare("DELETE FROM productos WHERE id_producto = ?");
		$dbh->bindParam(1, $id_producto);
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