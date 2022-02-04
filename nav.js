$(document).ready(function() {
    getNav();

    $("body").on("click", ".navigator", function () {
        clearParam();
        var id = $(this).attr("id");
        if(id == "home")
            window.location.pathname = "/";
        else
            window.location.pathname = id;
    });
});

function getNav() {
    $.post("/nav.php", {action: "nav"}, function(data) {
        $("body").prepend(data);
        var id = "#" + window.location.pathname.replace(/\//g, "");
        if (id == "#")
            id += "home";
        $(id).addClass("current-nav");
    });
}

function clearParam() {
    window.history.replaceState(null, "", window.location.pathname);
    window.location.pathname = "/";
}