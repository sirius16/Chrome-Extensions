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

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
	suggest([{
				content : "Fanfiction",
				description : "FF.net"
			}, {
				content : "ArchiveofourOwn",
				description : "AO3"
			}, {
				content : "Fanfiction|ArchiveofourOwn",
				description : "FF + AO3"
			}, {
				content : "Wonkette.com -http.{0,10}feedly.com",
				description : "Wonkette"
			}
		]);
});
chrome.omnibox.onInputEntered.addListener(function (text) {
	chrome.tabs.query({
		"windowType" : "normal"
	}, function (tabsList) {
		words = text.split(" ").map(function (j, i) {
				j = j.replace("chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#uri=", "")
					if (j.match(/^-/))
						j = "^((?!" + j.slice(1) + ").)*$";
					j = j.replace(/^#/, "http://");
				if (j.match(/^:/))
					j = j.slice(1).match(/(?=(?:https?:[/]+)?(.*?)[/]).*/)[1];
				if (j.match(/(https?|ftp|ssh|mailto):/))
					j = j.replace(/[^/]/g, function (x) {
							return "[%s]".parse(x);
						});
				return "(?=.*(" + j + "))"
			}).join("").replace(/[/]/gi, "\/")
			console.log(words)
			tabs = $j(tabsList).map(function (i, j) {
				k = j.title + " " + j.url;
				if (k.match(new RegExp(words, "i"))) {
					console.log(j);
					return j;
				}
			}).toArray();
		console.log(tabs);
		console.log(tabs.map(function (j, i) {
				return i + "\t" + j.title
			}).join("\n"));
		chrome.windows.create({
			tabId : tabs[0].id
		}, function (window) {
			tabs.map(function (j, i) {
				chrome.tabs.move(j.id, {
					windowId : window.id,
					index : i
				});
			});
		});
	});
});
