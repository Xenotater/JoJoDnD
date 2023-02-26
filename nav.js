$(document).ready(function() {
    let ads = true;
    if (window.location.href.includes("recovery"))
        ads = false;
    getNav(ads);
});

function getNav(adFlag) {
    var data = "";
    $.post("/nav.php", {action: "nav", ads: adFlag}, function(data) {
        $("#header").append(data);
        var id = "#" + window.location.pathname.replace(/\//g, "");
        if (id == "#")
            id += "home";
        $(id).addClass("current-nav");
    });
}