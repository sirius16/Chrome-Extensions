Clipboard = {
	read : function () {
		ClipboardBuffer = $j("<textarea />").appendTo('body').val('').select()
		document.execCommand('paste')
		return ClipboardBuffer.val();
	}
}
chrome.commands.onCommand.addListener(function (text) {
	string = Clipboard.read()
		var urlList = string.match(/(https?|ftp|ssh|mailto):\/\/[a-z0-9\/:%_+.,#?!@&=-]+/gi);
	for (i in urlList) {
		urlList[i] = urlList[i].replace(/(?=.*fanfiction)m\./, "www.")
			urlList[i] = "chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#uri=" + urlList[i];
			chrome.tabs.create({url:urlList[i]})
	}
	
});
