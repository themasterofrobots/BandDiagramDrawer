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

			this.parseXMLMaterial("Si.xml");
			this.addLayer(0);
			this.addLayer(0);
		}

		BDModel.prototype.addMaterial = function(newMat){
			this.materials.push(newMat);
		};

		BDModel.prototype.remMaterial = function(matIndex){
			this.materials.splice(matIndex, 1);
		};

		BDModel.prototype.parseXMLMaterial = function(filename){
			$.get(filename, function(xml) {
				this.loadMaterial($(xml).find("material").first());
			});
		};

		BDModel.prototype.loadMaterial = function(mat)
		{
			var $matxml = $(mat);
			var materialvar;
			materialvar.matname = $matxml.find("name").text();
			materialvar.affinity = parseFloat($matxml.find("affinity").text());
			materialvar.Eg = parseFloat($matxml.find("Eg").text());
			materialvar.ni = parseFloat($matxml.find("ni").text());
			materialvar.Nc = parseFloat($matxml.find("Nc").text());
			materialvar.Nv = parseFloat($matxml.find("Nv").text());
			materialvar.dielectric = parseFloat($matxml.find("dielectric").text());
			materialvar.effemass = parseFloat($matxml.find("effemass").text());
			materialvar.effhmass = parseFloat($matxml.find("effhmass").text());
			this.addMaterial(materialvar);
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
				layerInfo.Ec = -theMat.affinity;
				layerInfo.Ev = -(theMat.affinity + theMat.Eg);
				layerInfo.Ei = -(theMat.affinity + theMat.Eg / 2 + boltzman*this.temp*Math.log(theMat.Nv/theMat.Nc) / 2);
				var electrons = this.layers[i].dopingnType ? this.layers[i].dopingLevel : theMat.ni*theMat.ni/this.layers[i].dopingLevel;
				layerInfo.Ef = -(theMat.affinity + boltzman*this.temp*Math.log(theMat.Nc/electrons))
				returnVal.push(layerInfo);
			}
			return returnVal;
		};

		function BDLayer(materialBase, newIndex){
			this.name = "Side " + newIndex.toString();
			this.mat = materialBase;
			this.dopingLevel = 1E17;
			this.dopingnType = true;
		};

	})();


}).call(this);