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
    var path = "";
    if (window.location.pathname != "/")
    path = "../"

    $.get(path + "nav.php", function(data) {
        $("body").prepend(data);
        $("#home-logo").attr("src", path + $("#home-logo").attr("src"));
        $(".barImg").each(function () {
            $(this).attr("src", path + $(this).attr("src"));
        })
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