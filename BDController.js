(function(){
	var deepcopy,
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	if (typeof deepcopy === "undefined" || deepcopy === null) {
		deepcopy = function(src) {
			return $.extend(true, {}, src);
		};
	}

	window.BDController = (function() {
		function BDController(){
			this.updateStyleControls = __bind(this.updateStyleControls, this);
			this.changeLineDrawn = __bind(this.changeLineDrawn, this);
			this.changeLineColor = __bind(this.changeLineColor, this);
			this.changeLineWidth = __bind(this.changeLineWidth, this);
			this.changeLineStyle = __bind(this.changeLineStyle, this);
			this.lineStyleHelper = __bind(this.lineStyleHelper, this);
			this.updateDopingType = __bind(this.updateDopingType, this);
			this.addLayer = __bind(this.addLayer, this);
			this.remLayer = __bind(this.remLayer, this);
			this.changeCurvature = __bind(this.changeCurvature, this);
			this.updateDopingConcentration = __bind(this.updateDopingConcentration, this);
			this.changeLayerName = __bind(this.changeLayerName, this);
			this.updateLayerControls = __bind(this.updateLayerControls, this);
			this.changePotential = __bind(this.changePotential, this);
			this.updateTemperature = __bind(this.updateTemperature, this);
			
			$("#newlayer").click(this.addLayer);
			$("#dellayer").click(this.remLayer);
			$(".dopingtype").change(this.updateDopingType);
			$("#conc").keyup(this.updateDopingConcentration);
			$(".curvature").change(this.changeCurvature);
			$("#selectedline").change(this.updateStyleControls);
			$("#lineactive").click(this.changeLineDrawn);
			$("#linecolor").change(this.changeLineColor);
			$("#linewidth").change(this.changeLineWidth);
			$("#linestyle").change(this.changeLineStyle);
			$("#layername").keyup(this.changeLayerName);
			$("#layerselect").change(this.updateLayerControls);
			$("#potential").keyup(this.changePotential);
			$("#temperature").keyup(this.updateTemperature);
			//$("#downloadPNG").click(downloadCanvas);
			
			this.updateStyleControls();
			this.model = new BDModel(this);
		}

		BDController.prototype.updateTemperature = function(){
			var temp = $("#temperature").val();
			var parent = $("#temperature").parent()
			if ($.isNumeric(temp)){
				parent.toggleClass("has-success", true);
				parent.toggleClass("has-error", false);
				this.model.updateTemperature();
			}
			else {
				parent.toggleClass("has-success", false);
				parent.toggleClass("has-error", true);
			}
			
		}

		BDController.prototype.changePotential = function(){
			var potential = $("#potential").val();
			var parent = $("#potential").parent()
			if ($.isNumeric(potential)){
				parent.toggleClass("has-success", true);
				parent.toggleClass("has-error", false);
				this.model.changePotential(this.getSelectedLayer(), potential);
			}
			else {
				parent.toggleClass("has-success", false);
				parent.toggleClass("has-error", true);
			}
		}

		BDController.prototype.updateLayerControls = function(){
			this.model.updateLayerControls(this.getSelectedLayer());
		}
		
		BDController.prototype.changeLayerName = function(){
			this.model.changeLayerName(this.getSelectedLayer(), $("#layername").val());
		}
		
		BDController.prototype.updateDopingConcentration = function(){
			var conc = $("#conc").val();
			var parent = $("#conc").parent()
			if ($.isNumeric(conc)){
				parent.toggleClass("has-success", true);
				parent.toggleClass("has-error", false);
				this.model.updateDopingConcentration(this.getSelectedLayer(), conc);
			}
			else{
				parent.toggleClass("has-success", false);
				parent.toggleClass("has-error", true);
			}
		}
		
		BDController.prototype.changeCurvature = function(){
			this.model.toggleCurvature();
		}

		BDController.prototype.addLayer = function(){
			//change this to add material selection as well
			this.model.addLayer(0);
		}
		
		BDController.prototype.remLayer = function(){
			//change this to add material selection as well
			this.model.remLayer(this.getSelectedLayer);
		}

		BDController.prototype.updateDopingType = function(){
			this.model.updateDopingType(this.getSelectedLayer(), $(".dopingtype:checked").val());
		}

		BDController.prototype.getSelectedLine = function(){
			return $("#" + $("#selectedline option:selected").val());
		}
		
		BDController.prototype.getSelectedLayer = function(){
			return $("#layerselect").val();
		}

		BDController.prototype.updateStyleControls = function(){
			var $line = this.getSelectedLine();
			$("#lineactive").prop("checked", ($line.attr("visibility") !== "hidden"));
			$("#linecolor").val($line.attr("stroke"));
			$("#linewidth").val($line.attr("stroke-width"));
			$("#linestyle").val($line.attr("stroke-dasharray-helper"));
		}

		BDController.prototype.changeLineDrawn = function(){
			this.getSelectedLine().toggleAttr("visibility", "hidden");
		}

		BDController.prototype.changeLineColor = function(){
			this.getSelectedLine().attr("stroke", $("#linecolor option:selected").val());
		}

		BDController.prototype.changeLineWidth = function(){
			this.getSelectedLine().attr("stroke-width", $("#linewidth option:selected").val());
			this.lineStyleHelper(this.getSelectedLine());
		}

		BDController.prototype.changeLineStyle = function(){
			this.getSelectedLine().attr("stroke-dasharray-helper", $("#linestyle option:selected").attr("value"));
			this.lineStyleHelper(this.getSelectedLine());
		}

		BDController.prototype.lineStyleHelper = function($line){
			var thickness = parseFloat($line.attr("stroke-width"));
			if(thickness < 3.5) thickness += 1.0;
			var dasharray = $line.attr("stroke-dasharray-helper").split(",");
			$.each(dasharray, function(index, value){
				dasharray[index] = thickness*parseFloat(value);
				if(dasharray[index] === 0.0) 
					dasharray[index] = "none";
			});
			$line.attr("stroke-dasharray", dasharray.join());
		}

		$.fn.toggleAttr = function(attribute, value){
			if ($(this).attr(attribute) === value)
			{
				$(this).removeAttr(attribute);
			}
			else
			{
				$(this).attr(attribute, value);
			}
		}

		return BDController;

	})();

}).call(this);