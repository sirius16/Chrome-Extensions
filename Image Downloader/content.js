$j(document).ready(function () {
	$j("body").on("mousedown", "img,video", function (e) {
		console.log(e);
		if (e.shiftKey)
			chrome.runtime.sendMessage({
				subject: "Download Image",
				url: e.target.src
			}, a => {
				console.log(a.OK);
			});
	});
	$j("<script>", {
		text: `urls = (...a) => {dispatchEvent(new CustomEvent("urls",{detail:a}))};`
	}).appendTo(document.head || document.documentElement)
});

addEventListener("urls", e => {
	console.log(e)
	for (i of e.detail)
		chrome.runtime.sendMessage({
			subject: "Download Image",
			url: i
		})
})

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
})
