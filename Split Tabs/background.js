chrome.commands.onCommand.addListener(function (text) {
	if (text == 1)
		splitTabss();
	else if (text==2)
		splitTabss(0);
});

chrome.omnibox.onInputEntered.addListener(txt=>{splitTabss(parseInt(txt,10))})
	



function splitTabss(n = 10) {
	chrome.tabs.query({
		currentWindow: true
	}, function (tabs) {
		t = tabs;
		temp2 = n ? [...chunks(t, n)] : [tabs];
		createSplitWindow(temp2);

	})
}

function createSplitWindow(n) {
	k = n.shift();
	j = $j(k).map(function () {
			return this.id;
		}).get();
	console.log(k, j, n);
	chrome.windows.create(function (w) {
		chrome.tabs.move(j, {
			windowId: w.id,
			index: -1
		})
		if (n.length)
			return createSplitWindow(n);
		else
			return;
	})
}
