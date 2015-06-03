function loadXMLDoc(filename)
{
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",filename,false);
	xhttp.send();
	return xhttp.responseXML;
};

function loadXMLDocjquery(filename, passbackfunction)
{
	$.get(filename, passbackfunction, "xml");
};


function parseXML(filename, materialvar){
	$.get(filename, function(xml) {
		//$(xml).find("material").each(loadMaterial);
		loadMaterial($(xml).find("material").first(), materialvar);

		bindEvtHandlers();
	});
};

function loadMaterial(mat, materialvar)
{
	var $matxml = $(mat);
	materialvar.matname = $matxml.find("name").text();
	materialvar.affinity = parseFloat($matxml.find("affinity").text());
	materialvar.Eg = parseFloat($matxml.find("Eg").text());
	materialvar.ni = parseFloat($matxml.find("ni").text());
	materialvar.Nc = parseFloat($matxml.find("Nc").text());
	materialvar.Nv = parseFloat($matxml.find("Nv").text());
	materialvar.dielectric = parseFloat($matxml.find("dielectric").text());
	materialvar.effemass = parseFloat($matxml.find("effemass").text());
	materialvar.effhmass = parseFloat($matxml.find("effhmass").text());
};

function parseBDLines(){
	$.get("bdlines.xml", function(xml) {
		$.each($(xml).find("colors")[0].children, function(index, $color){
			var $tag = $('<option>').attr("value", $color.tagName);
			$tag.append($color.tagName)
			$("#linecolor").append($tag);
		});
		$.each($(xml).find("widths")[0].children, function(index, $width){
			var widthnumber = $width.tagName.substr(1);
			var $tag = $('<option>').attr("value", widthnumber);
			$tag.append(widthnumber)
			$("#linewidth").append($tag);
		});
		$.each($(xml).find("styles")[0].children, function(index, $style){
			var $tag = $('<option>').attr("value", $style.textContent);
			$tag.append($style.tagName.replace("_", " "))
			$("#linestyle").append($tag);
		});
	});
};