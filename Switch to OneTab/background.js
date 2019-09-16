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
		[switchOnetab, "chrome-extension://chphlpgkkbolifaimnlloiipkdnihall/onetab.html"],
		[switchOnetab, "chrome://extensions/"],
		// [switchOnetab,"chrome-extension://coonecdghnepgiblpccbbihiahajndda/popup.html"],
		[switchOnetab, "chrome-extension://ednkcmmolacdihjlinicpakkkifbolbf/popup.html"],
		[switchOnetab, "chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/history.html", true],
		[switchOnetab, "https://photos.google.com/"],
		[switchOnetab, "chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html"],
		[switchOnetab, "chrome-extension://logpjaacgmcbpdkdchjiaagddngobkck/pages/options.html"],
		[switchOnetab, "https://tweetdeck.twitter.com"],
		[switchOnetab, "https://twitter.com/i/notifications"],
		[openOnetab, "https://myanimelist.net/animelist/Uzoma_Uwanamodo", 0],
		[openOnetab, "https://www1.swatchseries.to", 0],
		[openOnetab, "https://app.mysms.com", 0],
		[switchOnetab, "http://rmz/bookmarks_RMZ.html", 0],
		[switchOnetab, "http://new16/new%20%2016.html"],
		[switchDifferent, "https://app.grammarly.com/docs/new", "app.grammarly.com/ddocs"],
		// [switchDifferent, "http://uwana/H's%20POD%20[00001-00947]190705150722.PDF", "uwana.H"],
		[switchDifferent, "https://discordapp.com/channels/@me", "discordapp.com"],
		[switchOnetab, "https://episodemailer.com/shows/my"]
	][command - 0];
	now[0](...now.splice(1));
});

function switchOnetab(URL) {
	console.log("switch", r = arguments[1])
	chrome.tabs.query({
		"windowType": "normal"
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
		tabs = $j(tabsList).map(function (i, j) {
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
				"active": true
			}, function (tab) {
				chrome.windows.update(tab.windowId, {
					"focused": true
				});
			});
		} else {
			chrome.tabs.create({
				url: URL
			}, i => {
				chrome.windows.update(i.windowId, {
					focused: !0
				})
			})
		}
	});
}

function openOnetab(URL) {
	console.log("open", r = arguments[1], URL.match(/[/]$/) ? URL.replace(/^https?/, "*") + "*" : URL.replace(/^https?/, "*"));
	chrome.tabs.query({
		"windowType": "normal"
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
		tabs = $j(tabsList).map(function (i, j) {
			k = j.title + " " + j.url;
			if (k.match(new RegExp(words, "i"))) {
				console.log(j);
				return j;
			}
		}).toArray();
		console.log(tabs);
		if (tabs.length) {
			chrome.tabs.update(tabs[0].id, {
				"active": true
			}, function (tab) {
				chrome.windows.update(tab.windowId, {
					"focused": true
				});
			});
		} else {
			console.log(this.caller)
			chrome.windows.create({
				url: URL,
				state: r ? "maximized" : "normal"
			})
		}
	});
}

function switchDifferent(URL, regex) {
	console.log("diff", r = arguments[2])
	chrome.tabs.query({
		"windowType": "normal"
	}, function (tabsList) {
		words = regex.split(" ").map(function (j, i) {
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
		if (tabs.length) {
			if (r)
				chrome.tabs.reload(tabs[0].id);
			chrome.tabs.update(tabs[0].id, {
				"active": true
			}, function (tab) {
				chrome.windows.update(tab.windowId, {
					"focused": true
				});
			});
		} else {
			chrome.tabs.create({
				url: URL
			}, i => {
				chrome.windows.update(i.windowId, {
					focused: !0
				})
			})
		}
	});
}