$j(document).ready(function () {
	$j("body").on("mousedown", "img,video", function (e) {
		console.log(e);
		if (e.shiftKey)
			chrome.runtime.sendMessage({
				subject: "Download Image",
				url: e.target.src,
				alt: e.target.alt.trim()
			}, a => {
				console.log(a.OK);
			});
	});


	// chrome.runtime.sendMessage($xx("//a/@href[not(contains(.,'javascript'))]|//img/@src").filter(a => a).map(a => a.ownerElement).reduce((a, b) => b.nodeName.match(/IMG/) ? [].concat(b, a) : a.concat(b), []).map(a => ({
	// 	content: ((a.src && a.src.trim()) || (a.href && a.href.trim())),
	// 	description: (a.innerText && "Link: " + a.innerText.trim()) || (a.alt && "Image: " + a.alt.trim()) || (a.src && "Image: " + a.src.trim()) || ("Link: " + a.href && a.href.trim())
	// })));

	$j("<script>", {
		text: `urls = (...a) => {dispatchEvent(new CustomEvent("urls",{detail:a}))};`
	}).appendTo(document.head || document.documentElement);
});

addEventListener("urls", e => {
	console.log(e);
	for (var i of e.detail)
		chrome.runtime.sendMessage({
			subject: "Download Image",
			url: i
		});
});

chrome.runtime.onMessage.addListener(e => {
	console.log(e);
	if (e == "imglinks")
		chrome.runtime.sendMessage($xx("//a/@href[not(contains(.,'javascript'))]|//img/@src").filter(a => a).map(a => a.ownerElement).reduce((a, b) => b.nodeName.match(/IMG/) ? [].concat(b, a) : a.concat(b), []).map(a => ({
			content: ((a.src && a.src.trim()) || (a.href && a.href.trim())) + ((a.innerText && "|" + a.innerText.trim()) || (a.alt && "|" + a.alt.trim()) || ""),
			description: (a.innerText && "Link: " + a.innerText.trim()) || (a.alt && "Image: " + a.alt.trim()) || (a.src && "Image: " + a.src.trim()) || ("Link: " + a.href && a.href.trim())
		})));
	else {
		ld = e.split("|");
		chrome.runtime.sendMessage({
			subject: "Download Image",
			url: ld[0],
			description: (ld[1] && ld[1].match(": http")) ? "" : ld[1]
		});
	}
});

addEventListener("e621", e => {
	console.log(e);
	chrome.runtime.sendMessage({
		subject: "e621",
		links: e.detail
	});
	// $j("<a />", {
	// download: "e621",
	// href: "data:text/plain," + encodeURIComponent(JSON.stringify(e.detail))
	// })[0].click()
});