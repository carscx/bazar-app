
bazar.app.directive('formElement', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label : "@",
            model : "="
        },
        link: function(scope, element, attrs) {
            scope.disabled = attrs.hasOwnProperty('disabled');
            scope.required = attrs.hasOwnProperty('required');
            scope.pattern = attrs.pattern || '.*';
        },
        template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" >'+
        '{{label}}</label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
      };

});

bazar.app.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,116,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) === -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});

bazar.app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    };
});
bazar.app.directive('animateOnChange', function($animate) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!==ov) {
              var c = 'change-up';
              $animate.addClass(elem,c, function() {
              $animate.removeClass(elem,c);
          });
        }
      });
  };
});


bazar.app.directive("horaActual", function(dateFilter){
    return function(scope, element, attrs){
        var format;

        scope.$watch(attrs.horaActual, function(value) {
            format = value;
            updateTime();
        });

        function updateTime(){
            var dt = dateFilter(new Date(), format);
            element.text(dt);
        }

        function updateLater() {
            setTimeout(function() {
              updateTime(); // update DOM
              updateLater(); // schedule another update
            }, 1000);
        }

        updateLater();
    }
});

bazar.app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

bazar.app.directive('pagoMixto', function() {
  return {
    restric: 'E',
    template: "<div class='col-xs-6'>"+
            "<input type='text' name='pmCobradoTarjeta' id='pmCobradoTarjeta' class='form-horizontal input-lg' ng-model='nvform.data.pmCobradoTarjeta' value='' placeholder='Tarjeta' only-numbers>"+
            "</div>"+
            "<div class='col-xs-6'>"+
            "<input type='text' name='pmCobradoEfectivo' id='pmCobradoEfectivo' class='form-horizontal input-lg' ng-model='nvform.data.pmCobradoEfectivo' value='' placeholder='Efectivo' only-numbers>"+
            "</div>",
    link: function(scope, element, attrs) {
        $(document).on('keyup', '#pmCobradoEfectivo', function(event) {
            var totalVenta = $("h2.total-venta").attr("data-total-venta");
            var valorEnEfectivo = $(this).val();
            $("#pmCobradoTarjeta").val(parseFloat(totalVenta-valorEnEfectivo),"");
        });
        $(document).on('keyup', '#pmCobradoTarjeta', function(event) {
            var totalVenta = $("h2.total-venta").attr("data-total-venta");
            var valorEnTarjeta = $(this).val();
            $("#pmCobradoEfectivo").val(parseFloat(totalVenta-valorEnTarjeta),"");
        });
        $(document).on('keyup', '#dtoEnPesos, #interesTarjeta', function(event) {
            $("#pmCobradoTarjeta, #pmCobradoEfectivo").val("");
        });

    }
  }
});

bazar.app.directive('pagoMixtoDevolucion', function() {
  return {
    restric: 'E',
    template: "<div class='col-xs-6'>"+
            "<input type='text' name='pmCobradoTarjetaDev' id='pmCobradoTarjetaDev' class='form-horizontal input-lg' ng-model='devform.data.pmCobradoTarjetaDev' value='' placeholder='Tarjeta' only-numbers>"+
            "</div>"+
            "<div class='col-xs-6'>"+
            "<input type='text' name='pmCobradoEfectivoDev' id='pmCobradoEfectivoDev' class='form-horizontal input-lg' ng-model='devform.data.pmCobradoEfectivoDev' value='' placeholder='Efectivo' only-numbers>"+
            "</div>",
    link: function(scope, element, attrs) {
        $(document).on('keyup', '#pmCobradoEfectivoDev', function(event) {
            var totalDevolucion = $("h2.total-devolucion").attr("data-total-devolucion");
            var valorEnEfectivo = $(this).val();
            $("#pmCobradoTarjetaDev").val(parseFloat(totalDevolucion-valorEnEfectivo),"");
        });
        $(document).on('keyup', '#pmCobradoTarjetaDev', function(event) {
            var totalDevolucion = $("h2.total-devolucion").attr("data-total-devolucion");
            var valorEnTarjeta = $(this).val();
            $("#pmCobradoEfectivoDev").val(parseFloat(totalDevolucion-valorEnTarjeta),"");
        });
        $(document).on('keyup', '#dtoEnPesos, #interesTarjeta', function(event) {
            $("#pmCobradoTarjetaDev, #pmCobradoEfectivoDev").val("");
        });

    }
  }
});

bazar.app.directive('mayusculas', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform","uppercase");
        }
    };
});