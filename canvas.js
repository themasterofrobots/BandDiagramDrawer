/*function drawCanvas()
{
	//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var data = document.getElementById("banddiagram").outerHTML;

	var DOMURL = window.URL || window.webkitURL || window;

	var img = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function () {
	  ctx.drawImage(img, 0, 0);
	  DOMURL.revokeObjectURL(url);
	}

	img.src = url;
}*/

function drawCanvas()
{
	//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var data = document.getElementById("banddiagram").outerHTML;

	var DOMURL = window.URL || window.webkitURL || window;

	var img = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function () {
	  ctx.drawImage(img, 0, 0);
	  DOMURL.revokeObjectURL(url);
	}

	img.src = url;
	//download();
}

function downloadCanvas()
{
	var canvas = document.getElementById("canvas");
	var url2 = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	//window.location.href=url2;
	downloadFile(url2);
}