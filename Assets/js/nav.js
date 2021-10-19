$(document).ready(function() {
    $("#home-link").click(function () {
        //searchParam deletion from https://gist.github.com/simonw/9445b8c24ddfcbb856ec
        history.replaceState && history.replaceState(
            null, '', location.pathname + location.search.replace(/[\?&]focus=[^&]+/, '').replace(/^&/, '?')
          );
        window.location.pathname = "/";
    })

    $(".nav-link").click(function () {
        //searchParam deletion from https://gist.github.com/simonw/9445b8c24ddfcbb856ec
        history.replaceState && history.replaceState(
            null, '', location.pathname + location.search.replace(/[\?&]focus=[^&]+/, '').replace(/^&/, '?')
          );
        window.location.search = "";
        var id = $(this).attr("id");
        switch(id) {
            case "rules":
                window.location.pathname = "/rules.html";
                break;
            case "passions":
                window.location.pathname = "/passions.html";
                break;
            default:
                window.location.pathname= "/not_found.html";
                break;
        }
    })
});