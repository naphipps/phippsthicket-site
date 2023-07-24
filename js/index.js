//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/17/23
//
//##===----------------------------------------------------------------------===##//

var index = new function(){

	const PAGE_TITLE = "p";
	var _search_params = new URLSearchParams(window.location.search);

	const _social_icons = [
		{filename: "asset/github_icon.svg", class: "github_icon"},
		{filename: "asset/twitter_icon.svg", class: "twitter_icon"},
		{filename: "asset/instagram_icon.svg", class: "instagram_icon"},
		{filename: "asset/discord_icon.svg", class: "discord_icon"},
		{filename: "asset/trello_icon.svg", class: "trello_icon"},
		{filename: "asset/google_icon.svg", class: "google_icon"}
	];

	const _links = [
		{class: "github_link", href: "https://github.com/naphipps"},
		{class: "twitter_link", href: "https://twitter.com/PhippsThicket"},
		{class: "discord_link", href: "https://discord.gg/5PMGCZuj9D"},
		{class: "instagram_link", href: "https://www.instagram.com/phippsthicket/"},
		{class: "trello_link", href: "https://trello.com/b/YJhL1R6V", title: "Current Project"},
		{class: "google_domains_link", href: "https://domains.google"},
		{class: "github_hosting_link", href: "https://github.com/naphipps/phippsthicket-site"}
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
				setLinks();
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
						setLinks();
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

	function setLinks(){
		var link = null;

		for (var i=0; i<_links.length; i++){
			link = _links[i];
			
			var elements = util.selectAll("." + link.class);
			for (var j=0; j<elements.length; j++)
				for (var attribute in link)
					if (attribute !== "class")
						elements[j].setAttribute(attribute, link[attribute]);
		}
	}

	function loadPages(){
		util.load("js/pages.js", digestPages);
	}

	function init(){
		loadIcons();
		setLinks();
		loadPages();
	}

	return {
		init: init,
		openPage: openPage,
		goHome: goHome
	};
};