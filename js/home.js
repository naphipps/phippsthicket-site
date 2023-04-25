var home = new function() {

    function init(){
        util.load("html/under_construction.html", (files)=>{
            util.byId("home_latest_news").innerHTML = files["html/under_construction.html"];
        });
    }

    return {
        init: init
    };
};