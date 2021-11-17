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

    $("form").submit(function(e) {
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
});

function popUp() {
    var newText = "<div id='popUp' class='center'><i id='closeLogin' class='bi bi-x-lg'></i>";
    newText += "<div class='content' id='login'>";
    newText += "<h2>Admin Login</h2>";
    newText += "<form id='login-form' action='admin.php' method='post'>";
    newText += "<label for='user'>Username: </label><input type='text' id='user' name='user'><br>";
    newText += "<label for='pass'>Password: </label><input type='password' id='pass' name='pass'><br>";
    newText += "<input type='submit' value='Login'>"

    newText += "</form></div></div>";
    $("body").append(newText);
};

function closePopUp() {
    $("#popUp").remove();
};

function respond(text) {
    closeResponse();
    $("body").append("<div id='response'><i id='closeResponse' class='bi bi-x-lg'></i>" + text + "</div>");
    if ($("#response-text").html() == "Your response was submitted!") {
        $("#response").addClass("success");
        $("#contact").trigger("reset");
    }
    else
        $("#response").addClass("failure");
};

function closeResponse() {
    $("#response").remove();
};