$(document).ready(function() {
    var url = new URL(window.location.href);
    var p = url.searchParams.get("focus");

    $(".passion-link").click(function() {
        var p = $(this).html();
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("focus", p);
            window.location.search = searchParams.toString();
        }
    })
});