chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
	case "1":
		chrome.tabs.query({
			highlighted : true,
			currentWindow : true
		}, function (tabs) {
			p = 0;
			for (t of tabs)
				if (t.pinned)
					p++;
			q = p < tabs.length ? true : false
				if (q)
					pin(tabs, 0, q);
				else
					pin(tabs, tabs.length - 1, q);

		})
		break;
	case "2":
		thisTab = chrome.tabs.query({
				active : true,
				currentWindow : true
			}, function (t) {
				chrome.tabs.query({
					currentWindow : true
				}, function (tabs) {
					high = $j(tabs).map(function () {
							return this.index
						}).get()
						console.log(high)
						chrome.tabs.highlight({
							tabs : high
						})
				})
				console.log(t[0])
				chrome.tabs.update(t[0].id, {
					active : true
				})
			})
			break;
	case "3":
		chrome.tabs.query({
			highlighted : true,
			currentWindow : true
		}, function (t) {
			for (i of t) {
				if (~i.url.search("chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html"))
				chrome.tabs.update(i.id, {
					url: Object.fromEntries([...new URLSearchParams(i.url)]).uri
				});
				else chrome.tabs.reload(i.id);
			}
		});

	}
});

function pin(tabs, i, q) {
	if (tabs[i] == undefined)
		return;
	tab = tabs[i];
	console.log(q)
	pinTab(tab, q, tabs.length);
	if (q)
		return pin(tabs, ++i, q);
	else
		return pin(tabs, --i, q);
}

function pinTab(tab, q, len) {
	chrome.tabs.update(tab.id, {
		pinned : q
	}, function (t) {
		if (len == 1 && q) {
			chrome.tabs.query({
				currentWindow : true
			}, function (bat) {
				if (q)
					chrome.tabs.update(bat[tab.index + 1 == bat.length ? tab.index : tab.index + 1].id, {
						active : true
					})
			})
		}
	})
}
