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
		function BDModel() {
			this.temp = 300;
			this.materials = [];
			this.layers = [];

			//Exposed functions
			this.addMaterial = __bind(this.addMaterial, this);
			this.remMaterial = __bind(this.remMaterial, this);
			this.addLayer = __bind(this.addLayer, this);
			this.remLayer = __bind(this.remLayer, this);
			this.update = __bind(this.update, this);
			this.loadMaterial = __bind(this.loadMaterial, this);

			this.drawer = new BDDrawer(this);

			this.parseXMLMaterial("Si.xml");
		}

		BDModel.prototype.update = function(){
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
			this.update();
		};

		BDModel.prototype.parseXMLMaterial = function(filename){
			$.get(filename, this.loadMaterial);
		};

		BDModel.prototype.addLayer = function(matIndex){
			var newLayer = new BDLayer(this.materials[matIndex], this.layers.length+1)
			this.layers.push(newLayer);
		};

		BDModel.prototype.remLayer = function(layerIndex){
			this.layers.splice(layerIndex, 1);
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
				layerInfo.dopingLevel = this.layers[i].dopingLevel;
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