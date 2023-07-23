//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

var index = new function(){

	const PAGE_TITLE = "page_title";
	var _search_params = new URLSearchParams(window.location.search);

	const _social_icons = [
		{filename: "asset/github_icon.svg", class: "github_link"},
		{filename: "asset/twitter_icon.svg", class: "twitter_link"},
		{filename: "asset/instagram_icon.svg", class: "instagram_link"},
		{filename: "asset/discord_icon.svg", class: "discord_link"},
		{filename: "asset/trello_icon.svg", class: "trello_link"},
		{filename: "asset/google_icon.svg", class: "google_link"}
	];

	function goHome(){
		window.location = "/";
	}

	function loadHomePage(){
		injectPage(pages.get("Home"));
	}

	function injectArticle(page) {
		var article = pages.get("article");
		page.files.push(article.filename);
		page.files.push(page.filename)
		util.load(page.files, (files)=>{
			if (files) {
				util.byId("content").innerHTML = files[article.filename];
				util.byId("article_header").innerText = page.title;
				util.byId("article_content").innerHTML = files[page.filename];
				page.init();
				loadIcons();
			}
		});
	}

	function injectPage(page){
		if (page.is_article) {
			injectArticle(page);
		}
		else {
			page.files.push(page.filename)
			util.load(page.files, (files)=>{
				if (files) {
					var file = files[page.filename];
					if (file) {
						util.byId("content").innerHTML = file;
						page.init();
						loadIcons();
					}
					else {
						console.error("CANNOT LOAD EMPTY PAGE: " + page.filename);
						loadHomePage();
					}
				}
			});
		}
	}

	function digestPages(){
		pages.init();
		var found = false;

		if (_search_params.has(PAGE_TITLE)) {
			var page_title = _search_params.get(PAGE_TITLE);
			var page = pages.get(page_title);
			
			if (page) {
				found = true;
				//page_title = page.title; //gets the correct capitalization
				injectPage(page);
			}
			else if (page_title !== "") {
				//TODO: show message about not finding page -- maybe offer button to search for it
				console.error("Could not load page: '" + page_title + "'");
			}
		}

		if (!found) loadHomePage();
	}

	function openPage(page_title){
		var search_params = new URLSearchParams();
		search_params.set(PAGE_TITLE, page_title);
		window.location.search = search_params;
	}

	function digestIcons(icons){
		if (icons) {
			var social = null;
			var icon = null;
			var element = null;
			for (var i=0; i<_social_icons.length; i++){
				social = _social_icons[i];
				icon = icons[social.filename];

				if (icon){
					var elements = util.selectAll("." + social.class);
					for (var j=0; j<elements.length; j++)
						elements[j].innerHTML = icon;
				}
			}
		}
	}

	function loadIcons(){
		var icons = [];
		for (var i=0; i<_social_icons.length; i++)
			icons.push(_social_icons[i].filename);

		util.load(icons, digestIcons);
	}

	function loadPages(){
		util.load("js/pages.js", digestPages);
	}

	function init(){
		loadIcons();
		loadPages();
	}

	return {
		init: init,
		openPage: openPage,
		goHome: goHome
	};
};