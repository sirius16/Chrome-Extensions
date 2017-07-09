var title, url;
var eventsid = [];
// downimg = 0;
onMessage = function (a, b, c) {
	// downimg = localStorage.downimg
	if (a.subject == "Download Image") {

		options = {
			url: a.url,
			conflictAction: "uniquify",
		}
		console.log(a, b, options, chrome.downloads, chrome.permissions.contains({
				permissions: ['downloads']
			}, a => console.log(a)))
		chrome.downloads.download(options,
			down => {
			console.log(down);
			// localStorage.title = tab.title;
			// localStorage.url = new URL(tab.url).hostname;
			eventsid[down] = new CustomEvent(down, {
					detail: [b]
				});
			dispatchEvent(eventsid[down]);
			// console.log(url, title);
			console.log(top.url, top.title);
			console.log("T617L");
			c({
				OK: !0
			});
		});

		console.log("5B8Z9")
	} else if (a.subject == "e621")
		a.links.forEach(i => {
			chrome.downloads.download({
				url: i.url
			}, p => {
				eventsid["e621" + p] = new CustomEvent("e621" + p, {
						detail: [i]
					});
				dispatchEvent(eventsid["e621" + p]);
				log("4585R");
				// c({
				// OK: !0
				// });
			});
		})
		return !0;
};

// changeFileName = ;

onDeterminingFilename = (i, suggest) => {
	var file,
	extension;
	console.log(i, eventsid);
	if (eventsid[i.id]) {
		eventsid[i.id].detail.push(i)
		addEventListener(i.id, (a) => {
			console.log(a, [b, i] = a.detail)
			chrome.tabs.get(b.tab.id, tab => {
				console.log(i);
				title = tab.title;
				url = new URL(tab.url).hostname.replace("www.", "");
				file = i.filename.split(".");
				for (j in file)
					file[j] = file[j].trim()
						extension = "." + file.splice(-1)[0];
				file = file.join("_");
				file = title.trim() + " " + file;
				file = url + '/' + file.replace(/[^-a-z0-9]+/gi, " ").trim();
				console.log(file, extension);
				suggest({
					filename: file + extension.replace(/:(large|small)/, ""),
					conflictAction: "uniquify"
				});
			});
		});
		dispatchEvent(eventsid[i.id]);
	} else if (eventsid["e621" + i.id]) {
		log(i.id, eventsid["e621" + i.id].detail[0].filename);
		suggest({
			filename: eventsid["e621" + i.id].detail[0].filename.replace("/","/"+ (++localStorage.e621) + " ")
		});
	} else {
		addEventListener(i.id, e => {
			changeFileName({
				detail: e.detail.concat(i)
			})
		})
	}

	// console.log(file,extension)
	return !0
}

chrome.runtime.onMessage.addListener(onMessage);
chrome.downloads.onDeterminingFilename.addListener(onDeterminingFilename);
