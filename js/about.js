//##===----------------------------------------------------------------------===##//
//
//  Author: Nathan Phipps 4/25/23
//
//##===----------------------------------------------------------------------===##//

var about = new function(){

    function init(){
        //about_buttons
        console.log("hello from about")

        util.byId("about_buttons");

        var host_button = util.byId("about_host_button");
        var domain_button = util.byId("about_domain_button");

        host_button.addEventListener("click", ()=>{
            window.open(host_button.getAttribute("href"), host_button.getAttribute("target"));
        });

        domain_button.addEventListener("click", ()=>{
            window.open(domain_button.getAttribute("href"), domain_button.getAttribute("target"));
        });
    }

    return {
        init: init
    }
};