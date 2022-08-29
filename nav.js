$(document).ready(function() {
    getNav();
});

function getNav() {
    var data = "";
    $.post("/nav.php", {action: "nav"}, function(data) {
        $("body").prepend(data);
        var id = "#" + window.location.pathname.replace(/\//g, "");
        if (id == "#")
            id += "home";
        $(id).addClass("current-nav");
    });
}