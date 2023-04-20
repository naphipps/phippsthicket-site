//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

const VIDEO_GAME_TAG = "video game";
const VULKAN_TAG = "Vulkan";
const PROJECT_TAG = "project";
const CPP_TAG = "C++";
const C_TAG = "C";

var pages = new function(){

    var _pages = {
        "Home": {
            filename: "html/home.html"
        },
        "About": {
            filename: "html/about.html"
        },
        "Search": {
            filename: "html/search.html"
        },
        "My Blog Post Title": {
            filename: "html/blog_post.html",
            publish_date: "04-17-2023"
        },
        "Project Blue Star": {
            filename: "html/project_blue_star.html",
            tags: [VIDEO_GAME_TAG, VULKAN_TAG, PROJECT_TAG, CPP_TAG], 
            files: ["js/project_blue_star.js"],
            publish_date: "04-18-2023",
            init: ()=>{
                project_blue_star.hello();
            }
        }
    };

    /*
        "page title": {
            filename: string,
            tags: array of strings,
            files: array of string,
            publish_date: string,
            publich_date_format: string,
            description: string,
            old_titles: array of strings
            init: function,
            clear: function
        }
    */
    function sanitize(page) {
        if (typeof page.filename !== "string") page.filename = "";
        if (!Array.isArray(page.tags)) page.tags = [];
        if (!Array.isArray(page.files)) page.files = [];
        if (typeof page.publish_date !== "string") page.publish_date = "";
        if (typeof page.publish_date_format !== "string" || page.publish_date_format === "") page.publish_date_format = "MM-DD-YYYY";
        if (typeof page.init !== "function") page.init = ()=>{};
        if (typeof page.clear !== "function") page.clear = ()=>{};
        if (typeof page.description !== "string") page.description = "";
        if (!Array.isArray(page.old_titles)) page.old_titles = [];

        return page;
    }

    function get(page_title) {
        var page = _pages[page_title];
        
        if (!page) {
            //search via _pages.keys
            page_title = page_title.toLowerCase();
            var titles = Object.keys(_pages).filter((title) => {return title.toLowerCase() === page_title;});
            if (titles.length > 0) {
                page_title = titles[0];
                page = _pages[page_title];
            }
        }

        if (!page){
            //TODO: later add support to consider old titles
        }

        if (page) page.title = page_title; //ensures page has correct capitalization for title
        return page;
    }

    function init(){
        var entries = Object.keys(_pages);
		for (var i = 0; i < entries.length; i++) sanitize(_pages[entries[i]]);
    }

    return {
        sanitize: sanitize,
        get: get,
        init: init
    };
};

