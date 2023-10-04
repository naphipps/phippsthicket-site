//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/25/23
//
//##===----------------------------------------------------------------------===##//

var home = new function() {

    function init(){
        util.byId("content").style.display = "none";

        util.load("html/under_construction.html", (files)=>{
            util.byId("home_latest_news").innerHTML = files["html/under_construction.html"];
            util.byId("content").style.display = "block";
        });

        util.byId("home_about_button").addEventListener("click", ()=>{index.openPage("About");});
    }

    return {
        init: init
    };
};