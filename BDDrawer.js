(function(){
	var deepcopy,
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	if (typeof deepcopy === "undefined" || deepcopy === null) {
		deepcopy = function(src) {
			return $.extend(true, {}, src);
		};
	}

	BDDrawer = (function() {

 

		function BDDrawer(bdmodel) {
			this.model = bdmodel;
			this.eVtopx = 200;
			//fixed for now
			this.pxheight = 400;
			this.pxwidth = 1168;
			this.drawingBuffer = 20;
			this.junctionwidths = 80;
			//Note, we must have materialwidths must be greater than two junctionwidths
			this.materialwidths = 180;
			
			this.realisticCurvature = true;

			this.updateBD = __bind(this.updateBD, this);
			this.toggleCurvature = __bind(this.toggleCurvature, this);
			this.addLayer = __bind(this.addLayer, this);
			this.remLayer = __bind(this.remLayer, this);
			this.changeLayerName = __bind(this.changeLayerName, this);
			this.updateLayerControls = __bind(this.updateLayerControls, this);

			this.toggled = false

			$("#menu-toggle").click(function(e) {
				e.preventDefault();
				$("#wrapper").toggleClass("toggled");
				if(this.toggled){
					$("#menu-toggle").html("&gt;");
				}
				else {
					$("#menu-toggle").html("&lt;");
				}
				this.toggled = !this.toggled;
			});
		}

		BDDrawer.prototype.updateLayerControls = function(layer){
			$("#layername").val(layer.name);
			$("#conc").val(layer.dopingLevel);
			$(".dopingtype [value=n]").prop("checked", layer.dopingnType);
			$(".dopingtype [value=p]").prop("checked", !layer.dopingnType);
		}
		
		BDDrawer.prototype.toggleCurvature = function(){
			this.realisticCurvature = !this.realisticCurvature;
		}

		BDDrawer.prototype.drawRegion = function(Vleft, Vright, sidefactor, linear, x1, x2, string){
			string += linear;

			var Vdiff = Vleft - Vright;
			var V1 = Vdiff*(1-sidefactor)*this.eVtopx;
			var V2 = Vdiff*sidefactor*this.eVtopx;
			var poshelper = Math.min(x1, x2);
			string += " q" + (x1-(1-sidefactor)*poshelper) + "," + 0 + " " + x1 + "," + V1 + " q" + (sidefactor)*poshelper + "," + V2 + " " + x2 + "," + V2;
			return string;
		}
 
		BDDrawer.prototype.updateBD = function(energies)
		{
			var min = Infinity;
			var max = -Infinity;
			$.each(energies, function(index, value){
				min = Math.min(min, value.ec, value.ei, value.ev, value.ef);
				max = Math.max(max, value.ec, value.ei, value.ev, value.ef); 
			});
			var diff = max - min;
			this.eVtopx = (this.pxheight-2*this.drawingBuffer)/diff;
			var start = "M" + this.drawingBuffer + ",";

			var ecPath = start + (this.drawingBuffer + this.eVtopx*(max - energies[0].ec));
 			var eiPath = start + (this.drawingBuffer + this.eVtopx*(max - energies[0].ei));
			var evPath = start + (this.drawingBuffer + this.eVtopx*(max - energies[0].ev));
			var efPath = start + (this.drawingBuffer + this.eVtopx*(max - energies[0].ef));

			var widthOfPrev = this.materialwidths/2;

			for(i = 0; i < energies.length - 1; i++)
			{
				var sidefactor = 0.5;
				if(this.realisticCurvature)
				{
					var d1 = energies[i].dopingLevel;
					var d2 = energies[i+1].dopingLevel; 
					sidefactor= d1/(d1+d2);
				} 

				var x1 = this.junctionwidths*(1-sidefactor);
				var x2 = this.junctionwidths*sidefactor;
				var linear = " h" + (this.materialwidths-x1+widthOfPrev);
				widthOfPrev = this.materialwidths-x2;

				ecPath = this.drawRegion(energies[i].ec, energies[i+1].ec, sidefactor, linear, x1, x2, ecPath);
				eiPath = this.drawRegion(energies[i].ei, energies[i+1].ei, sidefactor, linear, x1, x2, eiPath);
				evPath = this.drawRegion(energies[i].ev, energies[i+1].ev, sidefactor, linear, x1, x2, evPath);
				efPath = this.drawRegion(energies[i].ef, energies[i+1].ef, sidefactor, linear, x1, x2, efPath);
			}

			var linear = " h" + (this.materialwidths/2+widthOfPrev);
			ecPath += linear;
			eiPath += linear;
			evPath += linear;
			efPath += linear;

			$("#Ec").attr("d", ecPath);
			$("#Ei").attr("d", eiPath);
			$("#Ev").attr("d", evPath);
			$("#Ef").attr("d", efPath);
			//$("#junction").attr({x1: 250+x1, x2: 250+x1});

		}
		
		BDDrawer.prototype.addLayer = function(number, name){
			$("#layerselect").append("<option value=\"" + number + "\">" + name + "</option>");
		}
		
		BDDrawer.prototype.remLayer = function(){
			$("#layerselect option:selected").remove();
		}
		
		BDDrawer.prototype.changeLayerName = function(name){
			$("#layerselect option:selected").text(name);
		}

		return BDDrawer;

	})();


}).call(this);