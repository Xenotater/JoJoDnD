$(document).ready(function () {
    $("#back").click(function () {
        if ($("#err").length)
            window.location.href = "../index.html";
        else
            window.location.href = "logout.php";
    });
});