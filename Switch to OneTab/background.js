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

chrome.commands.onCommand.addListener(function (command) {
	now = [null,
	[switchOnetab,"chrome-extension://chphlpgkkbolifaimnlloiipkdnihall/onetab.html"],
	[switchOnetab,"chrome://extensions/"],
	[switchOnetab,"chrome-extension://coonecdghnepgiblpccbbihiahajndda/popup.html"],
	[switchOnetab,"chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/history.html", true],
	[],[],
	[switchOnetab,"chrome-extension://logpjaacgmcbpdkdchjiaagddngobkck/options.html"],
	[switchOnetab,"https://tweetdeck.twitter.com"]
][command];
now[0](...now.splice(1));
});

function switchOnetab(URL) {
	console.log("switch", r = arguments[1])
	chrome.tabs.query({
		"windowType" : "normal"
	}, function (tabsList) {
		words = URL.split(" ").map(function (j, i) {
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
			tabs = $(tabsList).map(function (i, j) {
				k = j.title + " " + j.url;
				if (k.match(new RegExp(words, "i"))) {
					console.log(j);
					return j;
				}
			}).toArray();
		if (tabs.length) {
			if (r)
				chrome.tabs.reload(tabs[0].id);
			chrome.tabs.update(tabs[0].id, {
				"active" : true
			}, function (tab) {
				chrome.windows.update(tab.windowId, {
					"focused" : true
				});
			});
		} else {
			chrome.tabs.create({
				url : URL
			}, i=>{chrome.windows.update(i.windowId,{focused:!0})})
		}
	});
}

function openOnetab(URL) {
	console.log("open", r = arguments[1], URL.match(/[/]$/) ? URL.replace(/^https?/, "*") + "*" : URL.replace(/^https?/, "*"));
	chrome.tabs.query({
		"windowType" : "normal"
	}, function (tabsList) {
		words = URL.split(" ").map(function (j, i) {
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
			tabs = $(tabsList).map(function (i, j) {
				k = j.title + " " + j.url;
				if (k.match(new RegExp(words, "i"))) {
					console.log(j);
					return j;
				}
			}).toArray();
		console.log(tabs);
		if (tabs.length) {
			chrome.tabs.update(tabs[0].id, {
				"active" : true
			}, function (tab) {
				chrome.windows.update(tab.windowId, {
					"focused" : true
				});
			});
		} else {
			console.log(this.caller)
			chrome.windows.create({
				url : URL,
				state : r ? "maximized" : "normal"
			})
		}
	});
}
