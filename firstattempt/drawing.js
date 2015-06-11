var material = {};
var n1 = 2E17, n2 = 1E18;

$(document).ready(function(){
	parseXML("Si.xml", material);
	parseBDLines();
});

function updateDoping(origdopingvar, textid, radioname)
{
	var temp = parseFloat($(textid).val());

	if(isNaN(temp))
	{
		return origdopingvar;
	}

	temp += material.ni;

	if($("input[name=" + radioname + "]:checked").val() === "p")
		temp = material.ni*material.ni/temp;

	return temp;
}

function calcEnergy(doping, nc) {
	var boltzman = 8.61733E-5;
	var temp = 300;
	//this returns the magnitude, sign is positive
	return boltzman*temp*Math.log(nc/doping);
}

function drawPoint(x, y){
	$("#banddiagram").append($('<circle>').attr({cx: x, cy: y, r: 2, fill: "red", class:"diagnostic"}));
}

function drawLine(x1, y1, x2, y2){
	$("#banddiagram").append($('<line>').attr({x1: x1, y1: y1, x2: x2, y2: y2, stroke: "red", class:"diagnostic"}));
}

function updateBD()
{
	n1 = updateDoping(n1, "#conc1", "type1");
	n2 = updateDoping(n2, "#conc2", "type2");

	var Ef1 = calcEnergy(n1, material.Nc);
	var Ef2 = calcEnergy(n2, material.Nc);

	var Vbi = Ef1 - Ef2;

	var eVtopx = 200;
	var line = " h200";
	var ecstart = "M50," + (300-Ef1*eVtopx);
	var eistart = "M50," + (300-(Ef1-material.Eg/2)*eVtopx);
	var evstart = "M50," + (300-(Ef1-material.Eg)*eVtopx);

	//change this for the side factor calculation
	if(n1 < material.ni)
		n1 = material.ni*material.ni/n1;
	if(n2 < material.ni)
		n2 = material.ni*material.ni/n2;
	var sidefactor = $("input[name=curvature]:checked").val() === "real" ? n1/(n1+n2) : 0.5;
	var x1 = 200*(1-sidefactor);
	var x2 = 200*sidefactor;
	var V1 = Vbi*(1-sidefactor)*eVtopx;
	var V2 = Vbi*sidefactor*eVtopx;
	var poshelper = Math.min(x1, x2);
	var contactpotential = " q" + (x1-(1-sidefactor)*poshelper) + "," + 0 + " " + x1 + "," + V1 + " q" + (sidefactor)*poshelper + "," + V2 + " " + x2 + "," + V2;

	$("#Ec").attr("d", ecstart + line + contactpotential + line);
	$("#Ei").attr("d", eistart + line + contactpotential + line);
	$("#Ev").attr("d", evstart + line + contactpotential + line);
	$("#junction").attr({x1: 250+x1, x2: 250+x1});

	$(".diagnostic").remove();

	drawPoint(250,300-Ef1*eVtopx);
	drawPoint(250+x1-(1-sidefactor)*poshelper,300-Ef1*eVtopx);
	drawPoint(250+x1,300-Ef1*eVtopx+V1);
	drawPoint(250+x1+(sidefactor)*poshelper,300-Ef1*eVtopx+V1+V2);
	drawPoint(250+x1+x2,300-Ef1*eVtopx+V1+V2);

	drawLine(250, 300-Ef1*eVtopx, 250+x1-(1-sidefactor)*poshelper, 300-Ef1*eVtopx);
	drawLine(250+x1-(1-sidefactor)*poshelper, 300-Ef1*eVtopx, 250+x1,300-Ef1*eVtopx+V1);
	drawLine(250+x1,300-Ef1*eVtopx+V1,250+x1+(sidefactor)*poshelper,300-Ef1*eVtopx+V1+V2);
	drawLine(250+x1+(sidefactor)*poshelper,300-Ef1*eVtopx+V1+V2, 250+x1+x2,300-Ef1*eVtopx+V1+V2);

	drawCanvas();
}

function getSelectedLine(){
	return $("#" + $("#selectedline option:selected").val());
}

function updateStyleControls(){
	var $line = getSelectedLine();
	$("#lineactive").prop("checked", ($line.attr("visibility") !== "hidden"));
	$("#linecolor").val($line.attr("stroke"));
	$("#linewidth").val($line.attr("stroke-width"));
	$("#linestyle").val($line.attr("stroke-dasharray-helper"));
}

function changeLineDrawn(){
	getSelectedLine().toggleAttr("visibility", "hidden");
}

function changeLineColor(){
	getSelectedLine().attr("stroke", $("#linecolor option:selected").val());
}

function changeLineWidth(){
	getSelectedLine().attr("stroke-width", $("#linewidth option:selected").val());
	lineStyleHelper(getSelectedLine());
}

function changeLineStyle(){
	getSelectedLine().attr("stroke-dasharray-helper", $("#linestyle option:selected").attr("value"));
	lineStyleHelper(getSelectedLine());
}

function lineStyleHelper($line){
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

function bindEvtHandlers(){
	$(".dopingtype").change(updateBD);
	$(".conctext").keyup(updateBD);
	$(".curvature").change(updateBD);
	$("#selectedline").change(updateStyleControls);
	$("#lineactive").click(changeLineDrawn);
	$("#linecolor").change(changeLineColor);
	$("#linewidth").change(changeLineWidth);
	$("#linestyle").change(changeLineStyle);
	$("#downloadPNG").click(downloadCanvas);
	updateStyleControls();
	updateBD();
}