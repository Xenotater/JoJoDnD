$(document).ready(function() {
    $("body").on("click", "#closeResponse", function() {
        closeResponse();
    });

    $("body").on("submit", "form", function(e) {
        e.preventDefault(); //don't submit normally
    });

    $("#send").click(function() {
        var name = $("#name").val(), subject = $("#subject").val(), comment = $("#comment").val(), email = $("#email").val();
        if (name != "" && subject != "" && comment != "" && $('#email').is(':valid')) {
            $.post("contact.php", {action: "send", name: name, email: email, subject: subject, comment: comment}, function(data) {
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

    if (getLanguage() != "en") {
        $("#viewSheet").attr("href", "Assets/translations/JoJo_Char_Sheet_" + getLanguage().toUpperCase() + ".pdf");
        $("#downloadSheet").attr("href", "Assets/translations/JoJo_Char_Sheet_" + getLanguage().toUpperCase() + ".pdf");
    }
});

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