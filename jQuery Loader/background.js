$j(document).ready(function () {
	for (let [i,j] of ["xml2json.min.js","jQuery.js"].entries())
	document.head.appendChild($j('<script />', {
			src : chrome.extension.getURL(j)
		}).on("load", [i,j], e => 
			console.log(i-1 || dispatchEvent(new Event("$j")),j)
		)[0])
	// $j("<script />",text:`
// ).appendTo("head")
})


addEventListener("$j", e => {
	document.head.appendChild($j('<script />', {
			src: chrome.extension.getURL("jquery-ui.min.js")
		})[0])
});
loadScript = a => {}