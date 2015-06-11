(function(){
	var deepcopy,
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	if (typeof deepcopy === "undefined" || deepcopy === null) {
		deepcopy = function(src) {
			return $.extend(true, {}, src);
		};
	}

	window.BDState = (function() {
		var boltzman = 8.61733E-5;
		function BDState() {
			this.temp = 300;
			this.materials = [];
			this.layers = [];

		}

		BDState.prototype.addMaterial = function(newMat){
			this.materials.push(newMat);
		};

		BDState.prototype.addLayer = function(matIndex){
			this.layers.push(new BDLayer(this.materials[matIndex]));
		};

		BDState.prototype.remLayer = function(layerIndex){
			this.layers.splice(layerIndex, 1);
		};

	})();


}).call(this);