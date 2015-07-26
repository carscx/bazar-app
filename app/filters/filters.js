bazar.app.filter('startFrom', function() {
	return function(input, start) {
		if(input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

bazar.app.filter('badDateToISO', function() {
	return function(badTime) {
		if(badTime !== undefined){
				var t = badTime.split(/[- :]/);
				return goodTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
		}else{
				return false;
		}
	};
});

bazar.app.filter('miBusqueda', function() {
	 return function( items, input) {
		var filtered = [];

		if(input === undefined || input === ''){
			 console.log( items);
			return items;
		}

		angular.forEach(items, function(item) {

			if(item.nombre_producto.indexOf(input) == 0){
				filtered.push(item);
			}
		});

		return filtered;
	};
});