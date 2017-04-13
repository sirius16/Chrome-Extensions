$j(document).ready(function () {
	for (let [i,j] of ["jQuery.js","script.js","jquery-ui.min.js"].entries())
	document.head.appendChild($j('<script />', {
			src : chrome.extension.getURL(j)
		}).on("load", [i,j], e => 
			console.log(i || dispatchEvent(new Event("$j")))
		)[0])
})
