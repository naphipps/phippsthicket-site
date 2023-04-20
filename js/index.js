//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

var index = new function(){

	const PAGE_TITLE = "page_title";
	var _search_params = new URLSearchParams(window.location.search);

	const _social_icons = [
		{filename: "asset/github_icon.svg", id: "github_link"},
		{filename: "asset/twitter_icon.svg", id: "twitter_link"},
		{filename: "asset/instagram_icon.svg", id: "instagram_link"},
		{filename: "asset/discord_icon.svg", id: "discord_link"},
		{filename: "asset/trello_icon.svg", id: "trello_link"}
	];

	function goHome(){
		window.location = "/";
	}

	function loadHomePage(){
		util.load("html/home.html", function(files){
			var file = files["html/home.html"];
			if (file) util.byId("content").innerHTML = file;
		});
	}

	function digestPages(){
		pages.init();
		var found = false;

		if (_search_params.has(PAGE_TITLE)) {
			var page_title = _search_params.get(PAGE_TITLE);
			var page = pages.get(page_title);
			
			if (page) {
				found = true;
				page_title = page.title; //gets the correct capitalization
				page.files.push(page.filename)
				util.load(page.files, (files)=>{
					if (files) {
						console.log(files)
						util.byId("content").innerHTML = files[page.filename];
						page.init();
						//TODO: setup way to call clear() on current page before navigating to next page?
					}
				});
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
				element = util.byId(social.id);
				if (icon && element) element.innerHTML = icon;
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

	function loadLogo(){
		util.load("asset/logo.svg", function(logos){
			if (logos) {
				var logo = logos["asset/logo.svg"];
				var element = util.byId("logo");
				if (logo && element) element.innerHTML = logo;
			}
		});
	}

	function init(){
		loadLogo();
		loadIcons();
		loadPages();
	}

	init();

	return {
		init: init,
		openPage: openPage,
		goHome: goHome
	};
};