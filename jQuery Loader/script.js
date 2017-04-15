try {
	console.log($);
} catch (e) {
	console.log(e)
}
console.log($j);
str = JSON.stringify;
function obj(text) {
	if (typeof text == "object")
		text=JSON.stringify(text,null,4);
	var obj = $j("<textarea />",{text:text}).appendTo("body").select();
	document.execCommand("copy");
	obj.remove();
}

String.prototype.parse = function () {
	var e = this.toString();
	if (!arguments.length)
		return e;
	var t = typeof arguments[0],
	n = "string" == t || "number" == t ? Array.prototype.slice.call(arguments) : arguments[0];
	for (var i in n)
		e = e.replace(new RegExp("\\{" + i + "\\}", "gi"), n[i]);
	i = 0;
	e = e.replace(/%s/g, function (x) {
			return n[i] ? n[i++] : x;
		})
		return e
}

search = a => $j("*").filter(function () {
		return this.outerHTML == $j(a)[0].outerHTML
	})
	// function parse(str) {
	// var args = [].slice.call(arguments, 1),
	// i = 0;

	// return str.replace(/%s/g, function () {
	// return args[i++];
	// });
	// }
