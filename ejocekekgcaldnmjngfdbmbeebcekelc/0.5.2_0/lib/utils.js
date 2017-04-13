var _gaq = _gaq || [];

// Escape characters that could break regex. (https://gist.github.com/robozevel/4141906)
(function (replace) {
    var escape = [/[\-\[\]\/\\{}()*+?.^$|]/g, '\\$&'];
    RegExp.Safe = function (pattern, flags) {
        return new RegExp(replace.apply(String(pattern), escape), flags);
    };
}(String.prototype.replace));

/**
 * Generate a random UUID
 * format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
var getUUID = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
}());

var time = (function() {
    var actions = {};
    var actionsCount = {};

    function Action(label, category) {
        this.key = label || getUUID();
        this.label = this.key.split("_").shift();
        this.category = category || "Background";
        this.startTime = new Date().getTime();
        this.endTime = null;

        if (!(this.label in actionsCount)) {
            actionsCount[this.label] = 0;
        }
        this.count = actionsCount[this.label]++;
    }

    Action.prototype.end = function() {
        end(this);
    };

    function end(label) {
        var action = label instanceof Action ? label : actions[label];
        
        if (action) {
            if (action.endTime) {
                var updatedTime = action.timeSpent + (new Date().getTime() - action.endTime);
                console.warn("TIME ::", action.label, "has already ended", "(" + action.timeSpent + " seconds)");
                console.debug("TIME ::", action.label, "::", (updatedTime / 1000).toFixed(3), "seconds");
            } else {
                action.endTime = new Date().getTime();
                action.timeSpent = action.endTime - action.startTime;
                console.debug("TIME ::", action.label, "::", (action.timeSpent / 1000).toFixed(3), "seconds");
                _gaq.push(['_trackTiming', action.category, action.label, action.timeSpent, action.count]);
            }
        } else {
            console.warn("TIME ::", label, "has never started");
        }

        return action;
    }

    function start(label, category, once) {
        var action = new Action(label, category);
        if (action.key in actions && once) {
            console.warn("TIME ::", label, "has already started");
            return actions[action.key];
        } else {
            actions[action.key] = action;
        }
        return action;
    }

    function getActions() {
        return _.sortBy(actions, "count");
    }

    return {
        start: start,
        end: end,
        getAction: function(filter, last) {
            if (!filter) return null;
            if (filter instanceof Action) return filter;
            if (typeof filter === "string") filter = { label: filter };
            var actionLog = getActions();
            if (last) actionLog.reverse();
            return _.find(actionLog, filter);
        },
        getActions: function(category, label) {
            var filter = null;
            if (typeof category === "object") {
                filter = category;
            } else if (arguments.length) {
                filter = {};
                if (category) filter.category = category;
                if (label) filter.label = label;
            }
            return filter ? _.filter(getActions(), filter) : getActions();
        }
    };

}());

time.start("externalScripts");