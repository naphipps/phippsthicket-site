//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

new function(){
    if (typeof String.prototype.endsWith !== "function") {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) === this.length - suffix.length;
        };
    }

    if (typeof String.prototype.startsWith !== "function") {
        String.prototype.startsWith = function(prefix) {
            return this.indexOf(prefix) === 0;
        };
    }

    //TODO: ensure string.contains, array.contains
};

var util = new function(){

    function sanitizeCallback(callback){
        return typeof callback === "function" ? callback : null;
    }

    function sanitizeFilename(filename){
        while (filename.startsWith("/")) filename = filename.substring(1);
        while (filename.startsWith("./")) filename = filename.substring(2);
        return filename;
    }

    function byId(id){
        return document.getElementById(id);
    }

    function selectAll(selectors){
        return document.querySelectorAll(selectors);
    }
    
    function create(name){
        return document.createElement(name);
    }
    
    function empty(element){
        while (element.firstChild)
            element.firstChild.remove();
    }

    function isFilenameJs(filename){
        return filename.endsWith(".js");
    }

    function isFilenameCss(filename){
        return filename.endsWith(".css");
    }

    function isFilenameOther(filename){
        return !(isFilenameJs(filename) || isFilenameCss(filename));
    }

    function getScripts(src){
        return document.head.querySelectorAll("script[src=\"" + src + "\"]");
    }

    function hasScript(src){
        return getScripts(src).length > 0;
    }

    function injectScript(src, callback){
        if (hasScript(src)) return;

        callback = sanitizeCallback(callback);
        var script = create("script");
        script.setAttribute("src", src);
        script.setAttribute("async", true);
        script.addEventListener("load", callback);
        document.head.appendChild(script);
    }

    function removeScript(src){
        var scripts = getScripts(src);
        for (var i = 0; i < scripts.length; i++)
            scripts[i].remove();
    }

    function getStylesheets(src){
        return document.head.querySelectorAll("link[rel=\"stylesheet\"][href=\"" + src + "\"]");
    }

    function hasStylesheet(src){
        return getStylesheets(src).length > 0;
    }

    function injectStylesheet(src, callback){
        if (hasStylesheet(src)) return;
        
        callback = sanitizeCallback(callback);
        var link = create("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", src);
        link.addEventListener("load", callback);
        document.head.appendChild(link);
    }

    function removeStylesheet(src){
        var stylesheets = getStylesheets(src);
        for (var i = 0; i < stylesheets.length; i++)
            stylesheets[i].remove();
    }

    function loadJs(filename, callback){
        if (Array.isArray(filename)){
            for (var i = 0; i < filename.length; i++) 
                injectScript(sanitizeFilename(filename[i]), callback);
        }
        else {
            injectScript(sanitizeFilename(filename), callback);
        }
    }

    function loadCss(filename, callback){
        if (Array.isArray(filename)) {
            for (var i = 0; i < filename.length; i++) 
                injectStylesheet(sanitizeFilename(filename[i]), callback);
        }
        else {
            injectStylesheet(sanitizeFilename(filename), callback);
        }
    }

    function unloadJs(filename){
        if (Array.isArray(filename)){
            for (var i = 0; i < filename.length; i++)
                removeScript(sanitizeFilename(filename[i]));
        }
        else {
            removeScript(sanitizeFilename(filename));
        }
    }

    function unloadCss(filename){
        if (Array.isArray(filename)){
            for (var i = 0; i < filename.length; i++)
                removeStylesheet(sanitizeFilename(filename[i]));
        }
        else {
            removeStylesheet(sanitizeFilename(filename));
        }
    }

    async function loadFile(filename, callback){
        var files = {};
        try {
            if (Array.isArray(filename)){
                var filenames = filename;

                for (var i = 0; i < filenames.length; i++) {
                    filename = sanitizeFilename(filenames[i]);
                    var response = await fetch(filename);
                    if (!response.ok) throw new Error();
                    files[filename] = await response.text();
                }
            }
            else {
                filename = sanitizeFilename(filename);
                var response = await fetch(filename);
                if (!response.ok) throw new Error();
                files[filename] = await response.text();
            }
        }
        catch (exception){
            console.error("LOAD FAILED: " + filename + ", " + exception);
            files = null;
        }

        callback = sanitizeCallback(callback);
        if (callback) callback(files);
    }
    
    function load(filename, callback){

        callback = sanitizeCallback(callback);

        var counter = 1;
        function removeSelfCallback(callback){
            function removeSelf(event){
                if (event && event.target) {
                    event.target.removeEventListener("load", removeSelf);
                }
                if (--counter === 0 && callback) callback();
            }
            return removeSelf;
        }

        if (Array.isArray(filename)) {
            var jsFiles = filename.filter(isFilenameJs);
            var cssFiles = filename.filter(isFilenameCss);
            var others = filename.filter(isFilenameOther);
            counter = jsFiles.length + cssFiles.length;
            var onloadCallback = removeSelfCallback(()=>{loadFile(others, callback);});

            if (counter > 0) {
                loadJs(jsFiles, onloadCallback);
                loadCss(cssFiles, onloadCallback);
            }
            else {
                loadFile(others, callback);
            }
        }
        else if (isFilenameJs(filename)) {
            loadJs(filename, removeSelfCallback(callback));
        }
        else if (isFilenameCss(filename)) {
            loadCss(filename, removeSelfCallback(callback));
        }
        else {
            loadFile(filename, callback);
        }
    }
    
    function unload(filename, callback){
        if (Array.isArray(filename)){
            unloadJs(filename.filter(isFilenameJs));
            unloadCss(filename.filter(isFilenameCss));

            var others = filename.filter(isFilenameOther);
            for (var i = 0; i < others.length; i++)
                console.error("LOAD FAILED: " + others[i]);
        }
        else if (isFilenameJs(filename)) {
            unloadJs(filename);
        }
        else if (isFilenameCss(filename)) {
            unloadCss(filename);
        }
        else {
            console.error("UNLOAD FAILED: " + filename);
        }

        callback = sanitizeCallback(callback);
        if (callback) callback();
    }

    function dispatchOn(event_type, element){
        var was_disabled = element.disabled || element.hasAttribute("disabled");
        if (was_disabled) element.removeAttribute("disabled");

        var event = document.creaetEvent("Event");
        event.initEvent(event_type, true, true);
        element.dispathEvent(event);

        if (was_disabled) element.setAttribute("disabled", true);
    }

    return {
        byId: byId,
        selectAll, selectAll,
        create: create,
        empty: empty,
        load: load,
        unload: unload,
        dispatchOn: dispatchOn,
        sanitizeFilename: sanitizeFilename
    };
};