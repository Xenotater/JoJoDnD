$(document).ready(function() {
    $("#home-link").click(function () {
        window.location.pathname = "/";
    });

    $(".nav-link").click(function () {
        var id = $(this).attr("id");
        switch(id) {
            case "rules":
                window.location.pathname = "/rules.html";
                break;
            // case "passions":
            //     window.location.pathname = "/passions.html";
            //     break;
            default:
                window.location.pathname= "/not_found.html";
                break;
        }
    });
});