chrome.commands.onCommand.addListener(function (text) {
	chrome.tabs.query({
		currentWindow : true
	}, function (tabs) {
		t = tabs;
		temp2 = [];
		if (t.length % 10 && text == 1)
			temp2.push(t.splice((t.length % 10) * -1));
		while (t.length)
			temp2.push(t.splice(text == 1 ? -10 : 0));
		temp2.reverse();
		createSplitWindow(0)
	})
});

function createSplitWindow(n) {
	k = temp2[n++];
	j = $(k).map(function () {
			return this.id;
		}).get();
	console.log(k,j,n);
	chrome.windows.create(function (w) {
		chrome.tabs.move(j, {
			windowId : w.id,
			index : -1
		})
		if (n < temp2.length)
			return createSplitWindow(n);
		else
			return;
	})
}
