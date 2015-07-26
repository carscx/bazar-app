bazar.app.factory('ServiceProductos', function($resource) {
  return $resource('/api/v1/productos/:id_producto',
  /*return $resource('/api/v1/index.php/productos/:id_producto',*/
    { id_producto:'@id_producto' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceMarcas', function($resource) {
  return $resource('/api/v1/marcas/:id_marca',
    { id_marca:'@id_marca' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceProveedores', function($resource) {
  return $resource('/api/v1/proveedores/:id_proveedor',
    { id_marca:'@id_proveedor' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceMediosCobro', function($resource) {
  return $resource('/api/v1/medios-cobro/:id_mcobro',
    { id_mcobro:'@id_mcobro' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceVentas', function($resource) {
  return $resource('/api/v1/ventas/:id_venta',
    { id_venta:'@id_venta' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceStock', function($resource) {
  return $resource('/api/v1/stock/:accion/:cantidad/:id_producto',
    { accion:'@accion', cantidad: '@cantidad', id_producto: '@id_producto' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceConsultaCodigo', function($resource) {
  return $resource('/api/v1/producto-por-codigo/:codigo_control/',
    { codigo_control: '@codigo_control' },
    { update: { method: 'PUT' }}
  );
});

bazar.app.factory('ServiceDevoluciones', function($resource) {
  return $resource('/api/v1/devoluciones/:id_devolucion/',
    { id_devolucion: '@id_devolucion' },
    { update: { method: 'PUT' }}
  );
});

