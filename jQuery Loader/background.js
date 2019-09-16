console.log(document)
$j(document).ready(function () {if (!document.title.match("UMBC Mail"))
	for (let [i,j] of ["xml2json.min.js","jQuery.js","jquery-ui.min.js"].entries())
	document.head.appendChild($j('<script />', {
			src : chrome.extension.getURL(j)
		}).on("load", [i,j], e => 
			console.log(i == 1 && dispatchEvent(new Event("$j")),i,j)
		)[0])
	// $j("<script />",text:`
// ).appendTo("head")
})



loadScript = a => {}