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

$(document).ready(function(){
	parseBDLines();
});