var name, affinity, Eg, ni, nc, nv, dielectric;
var n1 = 2E17, n2 = 1E18;

function initialize()
{
	loadMaterial("Si.xml");
	$("#controls").change(0, updateBD);
	updateBD(0);
}

function loadMaterial(filename)
{
	var xml = loadXMLDoc(filename);
	var mats = xml.getElementsByTagName("material");
	for (i = 0; i < mats.length; i++)
	{
		var mat = mats[i];
		for (j = 0; j < mat.children.length; j++)
		{
			var node = mat.children[j];
			switch(node.nodeName) {
				case "name":
					name = node.firstChild.nodeValue;
					break;
				case "affinity":
					affinity = parseFloat(node.firstChild.nodeValue);
					break;
				case "Eg":
					Eg = parseFloat(node.firstChild.nodeValue);
					break;
				case "Ni":
					ni = parseFloat(node.firstChild.nodeValue);
					break;
				case "Nc":
					nc = parseFloat(node.firstChild.nodeValue);
					break;
				case "Nv":
					nv = parseFloat(node.firstChild.nodeValue);
					break;
				default:
					console.log("Unknown XML tag: " + node.nodeName)
					break;
			}
		}
	}
}

function updateDoping(origdopingvar, textid, radioname)
{
	var temp = parseFloat($(textid).val());

	if(isNaN(temp))
	{
		return origdopingvar;
	}

	temp += ni;

	if($("input[name=" + radioname + "]:checked").val() === "p")
		temp = ni*ni/temp;

	return temp;
}

function calcEnergy(doping, nc) {
	var boltzman = 8.61733E-5;
	var temp = 300;
	//this returns the magnitude, sign is positive
	return boltzman*temp*Math.log(nc/doping);
}

function drawPoint(x, y){
	$("#banddiagram").append($('<circle>').attr({cx: x, cy: y, r: 2, fill:"red"}));
}

function drawLine(x1, y1, x2, y2){
	var line = document.createElement("line");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", "red");
	document.getElementById("banddiagram").appendChild(line);
}

function updateBD(event)
{
	n1 = updateDoping(n1, "#conc1", "type1");
	n2 = updateDoping(n2, "#conc2", "type2");

	var Ef1 = calcEnergy(n1, nc);
	var Ef2 = calcEnergy(n2, nc);

	var Vbi = Ef1 - Ef2;

	var eVtopx = 200;
	var line = " h200";
	var ecstart = "M50," + (300-Ef1*eVtopx);
	var eistart = "M50," + (300-(Ef1-Eg/2)*eVtopx);
	var evstart = "M50," + (300-(Ef1-Eg)*eVtopx);

	//change this for the side factor calculation
	if(n1 < ni)
		n1 = ni*ni/n1;
	if(n2 < ni)
		n2 = ni*ni/n2;
	var sidefactor = n1/(n1+n2);
	var x1 = 200*(1-sidefactor);
	var x2 = 200*sidefactor;
	var V1 = Vbi*(1-sidefactor)*eVtopx;
	var V2 = Vbi*sidefactor*eVtopx;
	var poshelper = Math.min(x1, x2);
	var contactpotential = "q" + (x1-(1-sidefactor)*poshelper) + "," + 0 + " " + x1 + "," + V1 + " q" + (sidefactor)*poshelper + "," + V2 + " " + x2 + "," + V2;

	$("#Ec").attr("d", ecstart + line + contactpotential + line);
	$("#Ei").attr("d", eistart + line + contactpotential + line);
	$("#Ev").attr("d", evstart + line + contactpotential + line);
	$("#junction").attr({x1: 250+x1, x2: 250+x1});

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