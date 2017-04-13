var title, url;
var eventsid = [];
// downimg = 0;
onMessage = function (a, b, c) {
	// downimg = localStorage.downimg
	options = {
		url : a.url,
		conflictAction : "uniquify",
	}
	console.log(a, b, options, chrome.downloads, chrome.permissions.contains({
			permissions : ['downloads']
		}, a => a))
	chrome.downloads.download(options,
		down => {
		console.log(down);
		// localStorage.title = tab.title;
		// localStorage.url = new URL(tab.url).hostname;
		eventsid[down] = new CustomEvent(down, {
				detail : [b]
			})
			dispatchEvent(eventsid[down])
			// console.log(url, title);
			console.log(top.url, top.title);
		console.log("T617L");
		c({
			OK : !0
		});
	});

	console.log("5B8Z9")
	return !0;
};

// changeFileName = ;

onDeterminingFilename = (i, suggest) => {
	var file,extension;
	console.log(i, eventsid);
	if (eventsid[i.id]) {
		eventsid[i.id].detail.push(i)
		addEventListener(i.id, (a) => {
	console.log(a, [b,i] = a.detail)
	chrome.tabs.get(b.tab.id, tab => {
		console.log(i);
		title = tab.title;
		url = new URL(tab.url).hostname;
		file = i.filename.split(".");
		for (j in file)
			file[j] = file[j].trim()
				extension = "." + file.splice(-1)[0];
		file = file.join("_");
		file = title.trim() + " " + file;
		file = url + '/' + file.replace(/[^-a-z0-9]+/gi, " ").trim();
		console.log(file, extension);
		suggest({
			filename : file + extension,
			conflictAction : "uniquify"
		});
	});
});
		dispatchEvent(eventsid[i.id]);
	} else {
		addEventListener(i.id, e=>{changeFileName({detail:e.detail.concat(i)})})
	}
	
	// console.log(file,extension)
	return !0
}

chrome.runtime.onMessage.addListener(onMessage);
chrome.downloads.onDeterminingFilename.addListener(onDeterminingFilename);
