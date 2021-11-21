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

    $.post(path + "nav.php", {action: "nav"}, function(data) {
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

//searchParam deletion from https://gist.github.com/simonw/9445b8c24ddfcbb856ec
function clearParam() {
    history.replaceState && history.replaceState(
        null, '', window.location.pathname + window.location.search.replace(/[\?&]focus=[^&]+/, '').replace(/^&/, '?')
      );
    window.location.pathname = "/";
}