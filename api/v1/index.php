<?php
require '../Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

define("SPECIALCONSTANT", true);
require 'app/libs/connect.php';

	function generaCodigo() {
		$num=range(1,9999);
		shuffle($num);
		for ($i=1; $i<9999; $i++) {
			$seed = str_split('BCDFGHJKLMNPQRSTVWXYZ');
			shuffle($seed);
			$rand = '';
			foreach (array_rand($seed, 2) as $k) $rand .= $seed[$k];

			$result = $rand.str_pad($num[$i], 4, '0', STR_PAD_LEFT);
			return $result;
		}
	}

	function compruebaCodigo($codigoDeControl,$mysqli){
   		$sql = "SELECT id_producto, codigo_control FROM productos WHERE codigo_control = '$codigoDeControl'";
		$res = $mysqli->query($sql);

		if ($res->num_rows == 1){
			return true;
  		}else{
			return false;
		}
	}

require 'app/routes/api-productos.php';
require 'app/routes/api-marcas.php';
require 'app/routes/api-proveedores.php';
require 'app/routes/api-ventas.php';
require 'app/routes/api-devoluciones.php';
require 'app/routes/api-medios-cobro.php';
require 'app/routes/api-stock.php';

$app->run();