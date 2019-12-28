var TabManager = React.createFactory(React.createClass({
	getInitialState: function () {
		this.update();
		return {
			layout: localStorage.layout || "horizontal",
			windows: [],
			selection: {},
			hiddenTabs: {},
			tabsbyid: {},
			windowsbyid: {},
			filterTabs: !!localStorage["filter-tabs"]
		};
	},
	render: function () {
		var hiddenCount = this.state.hiddenCount || 0;
		var tabCount = this.state.tabCount || 0;
		return React.DOM.div({},
			this.state.windows.map(window => {
				return Window({
					window,
					tabs: window.tabs,
					layout: this.state.layout,
					selection: this.state.selection,
					hiddenTabs: this.state.hiddenTabs,
					filterTabs: this.state.filterTabs,
					tabMiddleClick: this.deleteTab.bind(this),
					select: this.select.bind(this),
					drag: this.drag.bind(this),
					drop: this.drop.bind(this),
					ref: "window" + window.id
				});
			}),
			React.DOM.div({
					className: "window searchbox"
				},
				React.DOM.input({
					type: "text",
					onChange: this.searching,
					onKeyDown: this.checkEnter,
					ref: "searchbox"
				}),
				React.DOM.div({
					className: "icon windowaction " + this.state.layout,
					title: "Change layout",
					onClick: this.changelayout
				}),
				React.DOM.div({
					className: "icon windowaction trash",
					title: "Delete Tabs",
					onClick: this.deleteTabs
				}),
				React.DOM.div({
					className: "icon windowaction pin",
					title: "Pin Tabs",
					onClick: this.pinTabs
				}),
				React.DOM.div({
					className: "icon windowaction filter" + (this.state.filterTabs ? " enabled" : ""),
					title: (this.state.filterTabs ? "Do not hide" : "Hide") + " non-matching Tabs",
					onClick: this.toggleFilterMismatchedTabs
				}),
				React.DOM.div({
					className: "icon windowaction new",
					title: "Add Window",
					onClick: this.addWindow
				})
			),
			React.DOM.div({
				className: "window placeholder"
			})
		);
	},
	componentDidMount: function () {
		var box = this.refs.searchbox.getDOMNode();
		box.focus();
		box.select();
		chrome.windows.onCreated.addListener(this.update.bind(this));
		chrome.windows.onRemoved.addListener(this.update.bind(this));
		chrome.tabs.onCreated.addListener(this.update.bind(this));
		chrome.tabs.onUpdated.addListener(this.update.bind(this));
		chrome.tabs.onMoved.addListener(this.update.bind(this));
		chrome.tabs.onDetached.addListener(this.update.bind(this));
		chrome.tabs.onRemoved.addListener(this.update.bind(this));
		chrome.tabs.onReplaced.addListener(this.update.bind(this));
	},
	update: function () {
		chrome.windows.getAll({
			populate: true
		}, function (windows) {
			this.state.windows = windows;
			this.state.windowsbyid = {};
			this.state.tabsbyid = {};
			var tabCount = 0;
			for (var i = 0; i < windows.length; i++) {
				var window = windows[i];
				this.state.windowsbyid[window.id] = window;
				for (var j = 0; j < window.tabs.length; j++) {
					var tab = window.tabs[j];
					this.state.tabsbyid[tab.id] = tab;
					tabCount++;
				}
			}
			for (var id in this.state.selection) {
				if (!this.state.tabsbyid[id]) delete this.state.selection[id];
			}
			this.state.tabCount = tabCount;
			this.state.searchLen = 0;
			this.forceUpdate();
		}.bind(this));
	},
	deleteTabs: function () {
		var tabs = Object.keys(this.state.selection).map(id => this.state.tabsbyid[id]);
		if (tabs.length) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.remove(tabs[i].id);
			}
		} else {
			chrome.windows.getCurrent(function (w) {
				chrome.tabs.getSelected(w.id, function (t) {
					chrome.tabs.remove(t.id);
				});
			});
		}
	},
	deleteTab: function (tabId) {
		chrome.tabs.remove(tabId);
	},
	addWindow: function () {
		var tabs = Object.keys(this.state.selection).map(id => this.state.tabsbyid[id]);
		var first = tabs.shift();
		var count = 0;
		if (first) {
			chrome.windows.create({
				tabId: first.id
			}, function (w) {
				chrome.tabs.update(first.id, {
					pinned: first.pinned
				});
				for (var i = 0; i < tabs.length; i++) {
					(function (tab) {
						chrome.tabs.move(tab.id, {
							windowId: w.id,
							index: 1
						}, function () {
							chrome.tabs.update(tab.id, {
								pinned: tab.pinned
							});
						});
					})(tabs[i]);
				}
			});
		} else {
			chrome.windows.create({});
		}
	},
	pinTabs: function () {
		var tabs = Object.keys(this.state.selection).map(id => this.state.tabsbyid[id]).sort((a, b) => a.index - b.index);
		if (tabs.length) {
			if (tabs[0].pinned) tabs.reverse();
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.update(tabs[i].id, {
					pinned: !tabs[0].pinned
				});
			}

		} else {
			chrome.windows.getCurrent(function (w) {
				chrome.tabs.getSelected(w.id, function (t) {
					chrome.tabs.update(t.id, {
						pinned: !t.pinned
					});
				});
			});
		}
	},
	searching: function (e) {
		this.state.timer && clearTimeout(this.state.timer);
		this.state.timer = setTimeout(function (a, b) {
			//a.state.tooSoon = !1;
			a.search(b);
		}, 500, this, {
			target: e.target
		});
	},
	search: function (e) {
		var hiddenCount = this.state.hiddenCount || 0;
		var searchLen = (e.target.value || "").length;
		try {
			var regex = new RegExp(e.target.value.trim(), "i");
		} catch {
			return;
			var regex = this.state.regex;
		}
		if (!searchLen) {
			this.state.selection = {};
			this.state.hiddenTabs = {};
			hiddenCount = 0;
		} else {
			var idList;
			var lastSearchLen = this.state.searchLen;
			if (!lastSearchLen) {
				idList = this.state.tabsbyid;
			} else if (lastSearchLen > searchLen) {
				idList = this.state.hiddenTabs;
			} else if (lastSearchLen < searchLen) {
				idList = this.state.selection;
			} else {
				return;
			}
			idList = this.state.tabsbyid
			for (var id in idList) {
				var tab = this.state.tabsbyid[id];
				if (tab && regex.source.replace(/AO3/ig,"$&|archiveofourown").trim().split(/\s{2,}/).every(i=>!(tab.title + tab.url).match(new RegExp(i.trim().replace(/^!/,""),"i")) == (i[0] == "!"))) {
					hiddenCount -= (this.state.hiddenTabs[id] || 0);
					this.state.selection[id] = true;
					delete this.state.hiddenTabs[id];
				} else {
					hiddenCount += 1 - (this.state.hiddenTabs[id] || 0);
					this.state.hiddenTabs[id] = true;
					delete this.state.selection[id];
				}
			}
		}
		this.state.hiddenCount = hiddenCount;
		this.state.searchLen = searchLen;
		this.state.regex = regex;
		//this.state.timer && clearTimeout(this.state.timer);
		
		//this.state.tooSoon = !0;
		this.forceUpdate();
	},
	checkEnter: function (e) {
		if (e.keyCode == 13) this.addWindow();
	},
	changelayout: function () {
		if (this.state.layout == "blocks") {
			localStorage.layout = this.state.layout = "horizontal";
		} else if (this.state.layout == "horizontal") {
			localStorage.layout = this.state.layout = "vertical";
		} else {
			localStorage.layout = this.state.layout = "blocks";
		}
		this.forceUpdate();
	},
	select: function (id) {
		if (this.state.selection[id]) {
			delete this.state.selection[id];
		} else {
			this.state.selection[id] = true;
		}
		this.forceUpdate();
	},
	drag: function (e, id) {
		if (!this.state.selection[id]) {
			this.state.selection = {};
			this.state.selection[id] = true;
		}
		this.forceUpdate();
	},
	drop: function (id, before) {
		var tab = this.state.tabsbyid[id];
		var tabs = Object.keys(this.state.selection).map(id => this.state.tabsbyid[id]);
		var index = tab.index + (before ? 0 : 1);

		for (var i = 0; i < tabs.length; i++) {
			(function (t) {
				chrome.tabs.move(t.id, {
					windowId: tab.windowId,
					index: index
				}, function () {
					chrome.tabs.update(t.id, {
						pinned: t.pinned
					});
				});
			})(tabs[i]);
		}
	},
	toggleFilterMismatchedTabs: function () {
		this.state.filterTabs = !this.state.filterTabs;
		localStorage["filter-tabs"] = this.state.filterTabs ? 1 : "";
		this.forceUpdate();
	}
}));

function shiftClick(selecter = "", fn = function (e) {
	return e.forEach(i => i.checked = lastChecked.checked);
}, evtTrue = {}) {
	if (!selecter)
		return;
	shiftClick.observe && shiftClick.observe.disconnect();
	Object.defineProperty(shiftClick, "checked", {
		get: function () {
			return checked;
		}
	});
	//getEventListeners(document.body).click && getEventListeners(document.body).click.forEach(c => document.body.removeEventListener("click", c.listener));
	var checked = [...document.body.querySelectorAll(selecter)];

	shiftClick.observe = new MutationObserver(m => {
		checked = [...document.body.querySelectorAll(selecter)];
	});
	shiftClick.observe.observe(document.body, {
		childList: true,
		subtree: true
	});

	document.body.addEventListener("click", check);

	function check(e) {
		var lastChecked;
		if (!((elem = e.path.filter(f => ~checked.indexOf(f))) && (e.shiftKey || Object.entries(evtTrue).every(f => e[f[0]] == f[1]))))
			return;
		else
			elem = elem[0];

		if (!(lastChecked = check.lastChecked)) {
			check.lastChecked = elem;
			return;
		}
		console.log(e, elem, check.lastChecked, (checkedIndices = [elem, lastChecked].map(i => checked.indexOf(i)).sort((i, j) => i - j)), e.shiftKey && checked.slice(...checkedIndices));
		e.shiftKey && fn.call(...Array(2).fill(checked.slice(...checkedIndices.map((i, j) => j && ++i || i))));

		check.lastChecked = elem[0] || elem;
	}
}
document.onreadystatechange = e => (shiftClick(".icon.tab.full:not(.hidden)", a => a.filter(f => f.classList.contains("selected") == elem.classList.contains("selected") && f != elem).forEach(i => i.dispatchEvent(new MouseEvent("click", {
	ctrlKey: true,
	bubbles: true,
	altKey: true
}))), {
	altKey: !1,
	ctrlKey: !0
}), document.body["onkeydown"] = function (e) {
	var $this;
	!$this && ($this = arguments.callee, $this.keyFn = {
		"Escape": function () {
			shiftClick.checked.filter(i => i.classList.contains("selected")).forEach(i => i.dispatchEvent(new MouseEvent("click", {
				ctrlKey: true,
				bubbles: true,
				altKey: true
			})))
		},
		Delete: function () {
			document.querySelector(".trash").click();
		}
	});
	console.log($this.keyFn, e.key in $this.keyFn);
	if (!(e.key in $this.keyFn))
		if (e.key == "f" && e.ctrlKey) {
			document.querySelector("input").select();
			document.querySelector("input").focus();
			e.preventDefault();
			return !1;
		} else
			return;
	(!(first_press = $this.first_press)) && (first_press = !0, $this.prev_press = e.key, setTimeout(function () {
		$this.first_press = !1;
	}, 500)) || e.key == $this.prev_press && (first_press = !1, $this.keyFn[e.key]());
	$this.first_press = first_press;
}, document.onreadystatechange = undefined);

addEventListener('error', e => alert(e.error.stack));