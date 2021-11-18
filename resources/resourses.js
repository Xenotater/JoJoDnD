$(document).ready(function() {
    $("#login-btn").click(function() {
        popUp();
    });

    $("body").on("click", "#closeLogin", function() {
        closePopUp();
    });

    $("body").on("click", "#closeResponse", function() {
        closeResponse();
    });

    $("body").on("submit", "form", function(e) {
        e.preventDefault(); //don't submit normally
    });

    $("#send").click(function() {
        var name = $("#name").val(), subject = $("#subject").val(), comment = $("#comment").val(), email = $("#email").val();
        if (name != "" && subject != "" && comment != "" && $('#email').is(':valid')) {
            $.get("contact.php/?name=" + name + "&subject=" + subject + "&email=" + email + "&comment=" + comment, function(data) {
                respond(data);
            });
        }
    });

    $("body").on("click", "#login", function() {
        var user = $("#user").val(), pass = $("#pass").val();
        if (user != "" && pass != "")
            $.post("admin/login.php", {action: "login", user: user, pass: pass}, function(data) {
                if(data == "<h5 id='login-success'>Login Successful.</h5>")
                    window.location.href = "admin";
                $("#login-failure").remove();
                $("#login-window").append(data);
            });
    });
});

function popUp() {
    var newText = "<div id='popUp' class='center'><i id='closeLogin' class='bi bi-x-lg'></i>";
    newText += "<div class='content' id='login-window'>";
    newText += "<h2>Admin Login</h2>";
    newText += "<form id='login-form'>";
    newText += "<label for='user'>Username: </label><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password: </label><input type='password' id='pass' name='pass' required><br>";
    newText += "<input type='submit' value='Login' id='login'>"
    newText += "</form></div></div>";
    $("body").append(newText);
}

function closePopUp() {
    $("#popUp").remove();
}

function respond(text) {
    closeResponse();
    $("body").append("<div id='response'><i id='closeResponse' class='bi bi-x-lg'></i>" + text + "</div>");
    if ($("#response-text").html() == "Your response was submitted!") {
        $("#response").addClass("success");
        $("#contact").trigger("reset");
    }
    else
        $("#response").addClass("failure");
}

function closeResponse() {
    $("#response").remove();
}