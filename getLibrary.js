function logFunction(f,namespace=window) {
    var $namespace = {}
    functionLogger = {
        log: !1,
        loggedFunctions:{},
        getLog: function (f = "") {
        if (f) {
            functionLogger.log = !0;
            eval(f);
        }
        functionLogger.log = !1;
        var loggedFunctions = functionLogger.loggedFunctions;
        functionLogger.loggedFunctions = {}
        functionLogger.restoreNamespace();
        return loggedFunctions;
        
    },
    /**
     * Gets a function that when called will log information about itself if logging is turned on.
     *
     * @param func The function to add logging to.
     * @param name The name of the function.
     *
     * @return A function that will perform logging and then call the function. 
     */
    getLoggableFunction : function (func, name) {
        return function () {
            if (functionLogger.log) {
                functionLogger.loggedFunctions[name] = func.toString()
                var logText = name + '(';
                for (var i = 0; i < arguments.length; i++) {
                    if (i > 0) {
                        logText += ', ';
                    }
                    logText += arguments[i];
                }
                logText += ');';
                
                console.log(logText);
                console.trace(this,arguments,logText,func,functionLogger.loggedFunctions)
            }

            return func.apply(this, arguments);
        }
    },
    /**
     * After this is called, all direct children of the provided namespace object that are 
     * functions will log their name as well as the values of the parameters passed in.
     *
     * @param namespaceObject The object whose child functions you'd like to add logging to.
     */
    addLoggingToNamespace: function (namespaceObject) {
        for (var name in namespaceObject) {
            var potentialFunction = namespaceObject[name];
            
            if (Object.prototype.toString.call(potentialFunction) === '[object Function]') {
                namespaceObject[name] = functionLogger.getLoggableFunction(potentialFunction, name);
                $namespace[name] = potentialFunction;
            }
        }
    },
    restoreNamespace: function () {
        for (var [name,func] of Object.entries($namespace))
            namespace[name] = func
    }

};


functionLogger.addLoggingToNamespace(namespace);
return functionLogger.getLog.apply(namespace,[f])
}

function obj(text) {
	if (typeof text == "object")
		text = JSON.stringify(text, null, 4);
	var obj = $j("<textarea />", {
		text: text
	}).appendTo("body").select();
	document.execCommand("copy");
	obj.remove();
	log(text);
}


getLibrary = (f,namespace=window) => obj(Object.entries(logFunction(f,namespace)).reduce((i,j,k,l)=>i+=`\t${j[0]}:${j[1]}${k != l.length-1 ? ",":""}\n`,"Object.entries({\n") + "}).forEach(t=>void 0===this[t[0]]&&(this[t[0]]=t[1]))")