(function(){
	var deepcopy,
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	if (typeof deepcopy === "undefined" || deepcopy === null) {
		deepcopy = function(src) {
			return $.extend(true, {}, src);
		};
	}

	window.BDModel = (function() {
		var boltzman = 8.61733E-5;
		function BDModel(bdcontroller) {
			this.temp = 300;
			this.materials = [];
			this.layers = [];

			//Exposed functions
			this.addMaterial = __bind(this.addMaterial, this);
			this.remMaterial = __bind(this.remMaterial, this);
			this.addLayer = __bind(this.addLayer, this);
			this.remLayer = __bind(this.remLayer, this);
			this.updateDrawing = __bind(this.updateDrawing, this);
			this.loadMaterial = __bind(this.loadMaterial, this);
			this.updateDopingType = __bind(this.updateDopingType, this);
			this.toggleCurvature = __bind(this.toggleCurvature, this);
			this.updateDopingConcentration = __bind(this.updateDopingConcentration, this);
			this.changeLayerName = __bind(this.changeLayerName, this);
			this.updateLayerControls = __bind(this.updateLayerControls, this);
			this.changePotential = __bind(this.changePotential, this);
			this.updateTemperature = __bind(this.updateTemperature, this);

			this.controller = bdcontroller;
			this.drawer = new BDDrawer(this);

			this.parseXMLMaterial("Si.xml");
		}

		BDModel.prototype.updateTemperature = function(temp){
			this.temp = temp;
			this.updateDrawing();
		}

		BDModel.prototype.changePotential = function(layerIndex, potential){
			this.layers[layerIndex].contactpotential = potential;
			this.updateDrawing();
		}

		BDModel.prototype.updateLayerControls = function(layerIndex) {
			this.drawer.updateLayerControls(this.layers[layerIndex]);
		}
		
		BDModel.prototype.changeLayerName = function(layerIndex, name){
			this.layers[layerIndex].name = name;
			this.drawer.changeLayerName(name);
		}
		
		BDModel.prototype.updateDopingConcentration = function(layerIndex, concentration){
			this.layers[layerIndex].dopingLevel = concentration;
			this.updateDrawing();
		}
		
		BDModel.prototype.toggleCurvature = function(){
			this.drawer.toggleCurvature();
			this.updateDrawing();
		}
		
		BDModel.prototype.updateDopingType = function(layerIndex, dopingType){
			this.layers[layerIndex].dopingnType = (dopingType == "n")
			this.updateDrawing();
		}

		BDModel.prototype.updateDrawing = function(){
			this.drawer.updateBD(this.layerInfo());
		}

		BDModel.prototype.addMaterial = function(newMat){
			this.materials.push(newMat);
		};

		BDModel.prototype.remMaterial = function(matIndex){
			this.materials.splice(matIndex, 1);
		};

		BDModel.prototype.loadMaterial = function(xml)
		{
			var $matxml = $(xml).find("material").first();
			var materialvar = {};
			materialvar.matname = $matxml.find("name").text();
			materialvar.affinity = parseFloat($matxml.find("affinity").text());
			materialvar.eg = parseFloat($matxml.find("Eg").text());
			materialvar.ni = parseFloat($matxml.find("ni").text());
			materialvar.nc = parseFloat($matxml.find("Nc").text());
			materialvar.nv = parseFloat($matxml.find("Nv").text());
			materialvar.dielectric = parseFloat($matxml.find("dielectric").text());
			materialvar.effemass = parseFloat($matxml.find("effemass").text());
			materialvar.effhmass = parseFloat($matxml.find("effhmass").text());
			this.addMaterial(materialvar);
			
			//fix later, don't keep this in the callback 
			this.addLayer(0);
			this.addLayer(0);
			this.layers[0].dopingnType = false;
			this.updateDrawing();
		};

		BDModel.prototype.parseXMLMaterial = function(filename){
			$.get(filename, this.loadMaterial);
		};

		BDModel.prototype.addLayer = function(matIndex){
			var newLayer = new BDLayer(this.materials[matIndex], this.layers.length+1)
			this.drawer.addLayer(this.layers.length, newLayer.name);
			this.layers.push(newLayer);
			this.updateDrawing();
		};

		BDModel.prototype.remLayer = function(layerIndex){
			this.layers.splice(layerIndex, 1);
			this.drawer.remLayer(layerIndex);
			this.updateDrawing();
		};

		BDModel.prototype.layerInfo = function(){
			var returnVal = [];
			for(i = 0; i < this.layers.length; i++)
			{
				var layerInfo = {};
				//Unfinished!!!
				var theMat = this.layers[i].mat;

				var electrons = this.layers[i].dopingnType ? this.layers[i].dopingLevel : theMat.ni*theMat.ni/this.layers[i].dopingLevel;
				var tempEf = -(theMat.affinity + boltzman*this.temp*Math.log(theMat.nc/electrons));
				var efOffset = this.layers[i].contactpotential - tempEf;
				layerInfo.ec = -theMat.affinity+efOffset;
				layerInfo.ev = -(theMat.affinity + theMat.eg)+efOffset;
				layerInfo.ei = -(theMat.affinity + theMat.eg / 2 + boltzman*this.temp*Math.log(theMat.nv/theMat.nc) / 2)+efOffset;
				layerInfo.ef = this.layers[i].contactpotential;
				layerInfo.dopingLevel = this.layers[i].dopingLevel > this.layers[i].mat.ni ? this.layers[i].dopingLevel : this.layers[i].mat.ni;
				returnVal.push(layerInfo);
			}
			return returnVal;
		};


		function BDLayer(materialBase, newIndex){
			this.name = "Side " + newIndex.toString();
			this.mat = materialBase;
			this.dopingLevel = 1E17;
			this.dopingnType = true;
			this.contactpotential = 0.0;
		};
		
		


		return BDModel;

	})();

}).call(this);