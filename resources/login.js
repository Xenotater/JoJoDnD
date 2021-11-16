$(document).ready(function() {
    $("#login-btn").click(function() {
        popUp();
    })

    $("body").on("click", "#close", function() {
        close();
    })

    $("#submit").click(function() {
        if ($("#name").val() != "" && $("#subject").val() != "" && $("#comment").val() != "") {
            $("#response-frame").css("display", "unset");
        }
    })
})

function popUp() {
    var newText = "<div id='popUp' class='center'><span id='close'><i class='bi bi-x-lg'></i></span>";
    newText += "<div class='content' id='login'>";
    newText += "<h2>Admin Login</h2>";
    newText += "<form id='login-form' action='admin.php' method='post'>";
    newText += "<label for='user'>Username: </label><input type='text' id='user' name='user'><br>";
    newText += "<label for='pass'>Password: </label><input type='password' id='pass' name='pass'><br>";
    newText += "<input type='submit' value='Login'>"

    newText += "</form></div></div>";
    $("body").append(newText);
}

function close() {
    $("#popUp").remove();
}