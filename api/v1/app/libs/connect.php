<?php if(!defined("SPECIALCONSTANT")) die("Acceso denegado");

function getConnection()
{
	try{
		$db_username = "nbazardb";
		$db_password = "rojas2015";
		$connection = new PDO("mysql:host=localhost;dbname=nbazardb", $db_username, $db_password);
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	return $connection;
}