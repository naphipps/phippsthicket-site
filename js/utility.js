//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

if (typeof String.prototype.endsWith !== "function")
    String.prototype.endsWith = (suffix) => {
        return this.indexOf(suffix, this.length - suffix.length) === this.length - suffix.length;
    };

if (typeof String.prototype.startsWith !== "function")
    String.prototype.startsWith = (prefix) => {
        return this.indexOf(prefix) === 0;
    };

if (typeof Object.prototype.isEmpty !== "function")
    Object.prototype.isEmpty = () => {
        for (var _ in this) return false;
        return true;
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

    function isFilenameSrc(filename){
        return isFilenameJs(filename) || isFilenameCss(filename);
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

    function injectSrc(src, callback){
        var is_script = isFilenameJs(src);
        var is_stylesheet = isFilenameCss(src);

        if ((is_script && hasScript(src)) || (is_stylesheet && hasStylesheet(src))) {
            if (callback) callback(src);
            return;
        }

        function onload(event) {
            if (event.target) {
                event.target.removeEventListener("load", onload);
                event.target.removeEventListener("error", onerror);
            }

            if (callback) callback(src);
        }

        function onerror(event){
            if (event.target) {
                event.target.removeEventListener("load", onload);
                event.target.removeEventListener("error", onerror);
            }

            if (event.type && event.message) console.error(event.type + ": " + event.message);
        }
        
        var element = null;
        if (is_script) {
            element = create("script");
            element.setAttribute("src", src);
            element.setAttribute("async", true);
        }
        else if (is_stylesheet) {
            element = create("link");
            element.setAttribute("rel", "stylesheet");
            element.setAttribute("href", src);
        }

        element.addEventListener("load", onload);
        element.addEventListener("onerror", onerror);

        if (element) document.head.appendChild(element);
    }

    function removeSrc(src) {
        var elements = [];
        if (isFilenameJs(src)) elements = getScripts(src);
        else if (isFilenameCss(src)) elements = getStylesheets(src);

        for (var i = 0; i < elements.length; i++)
            elements[i].remove();
    }

    function getStylesheets(src){
        return document.head.querySelectorAll("link[rel=\"stylesheet\"][href=\"" + src + "\"]");
    }

    function hasStylesheet(src){
        return getStylesheets(src).length > 0;
    }

    function loadSrc(files, callback) {
        for (var i = 0; i < files.length; i++) 
            injectSrc(sanitizeFilename(files[i]), callback);
    }

    function unloadSrc(files) {
        for (var i = 0; i < files.length; i++)
            removeSrc(sanitizeFilename(files[i]));
    }

    async function fetchFile(filename, callback){
        //TODO: I think we can cache these files in our session storage or something?
        try {
            var response = await fetch(filename);
            if (!response.ok) throw new Error();
            response.text().then((text) => {
                if (callback) callback(filename, text);
            });
        }
        catch (exception){
            console.error("LOAD FAILED: " + files.join(",") + ", " + exception);
        }
    }

    function loadFile(files, callback){
        for (var i = 0; i < files.length; i++)
            fetchFile(sanitizeFilename(files[i]), callback);
    }
    
    function load(files, callback){
        if (!Array.isArray(files)) files = [files];
        callback = sanitizeCallback(callback);

        var src_files = files.filter(isFilenameSrc);
        var others = files.filter(isFilenameOther);
        var load_counter = src_files.length + others.length;
        var loaded = {};

        function resolveLoad(file, content) {
            if (file && content) loaded[file] = content;
            if (--load_counter === 0 && callback)
                callback(loaded.isEmpty() ? null : loaded);
        }

        loadSrc(src_files, resolveLoad);
        loadFile(others, resolveLoad);
    }
    
    function unload(files, callback){
        if (!Array.isArray(files)) files = [files];
        callback = sanitizeCallback(callback);

        unloadSrc(files.filter(isFilenameSrc));

        var others = files.filter(isFilenameOther);
        if (others.length > 0) console.error("UNLOAD FAILED: " + others.join(","));
        
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
        sanitizeCallback: sanitizeCallback,
        sanitizeFilename: sanitizeFilename
    };
};