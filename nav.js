$(document).ready(function() {
    getNav();

    $("body").on("click", "#home-link", function () {
        clearParam();
    })

    $("body").on("click", ".nav-link", function () {
        clearParam();
        var id = $(this).attr("id");
        console.log(id);
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
})

function getNav() {
    var nav = new XMLHttpRequest();
    var path = "";
    
    if (location.pathname != "/")
        path = "../"

    nav.onload = function() {
        if (nav.status == 200) {
            $("body").prepend(nav.responseText);
            $("#home-logo").attr("src", path + $("#home-logo").attr("src"));
            $(".barImg").each(function () {
                $(this).attr("src", path + $(this).attr("src"));
            })
        }
    }
    
    nav.open("GET", path + "nav.php", true);
    nav.send();
}

//searchParam deletion from https://gist.github.com/simonw/9445b8c24ddfcbb856ec
function clearParam() {
    history.replaceState && history.replaceState(
        null, '', location.pathname + location.search.replace(/[\?&]focus=[^&]+/, '').replace(/^&/, '?')
      );
    window.location.pathname = "/";
}