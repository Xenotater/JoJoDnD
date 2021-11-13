$(document).ready(function() {
    $("#home-link").click(function () {
        clearParam();
    })

    $(".nav-link").click(function () {
        clearParam();
        var id = $(this).attr("id");
        switch(id) {
            case "rules":
                window.location.pathname = "rules/";
                break;
            case "passions":
                window.location.pathname = "passions/";
                break;
            default:
                window.location.pathname= "not_found/";
                break;
        }
    })
});

//searchParam deletion from https://gist.github.com/simonw/9445b8c24ddfcbb856ec
function clearParam() {
    history.replaceState && history.replaceState(
        null, '', location.pathname + location.search.replace(/[\?&]focus=[^&]+/, '').replace(/^&/, '?')
      );
    window.location.pathname = "/";
}