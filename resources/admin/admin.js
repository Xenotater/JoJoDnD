$(document).ready(function () {
    $("#back").click(function () {
        window.location.href = "logout.php";
    });

    $(".contact").on("click", ".delete", function () {
        id = $(this).parent().attr("id").replace("contact", "");
        warn(id);
    });

    $("body").on("click", ".closeWarn", function() {
        closeWarn();
    });

    $("body").on("click", ".del", function() {
        id = $(this).attr("id").replace("del", "");
        deleteContact(id);
    });
});

function warn(id) {
    newText = "<div id='popUp' class='center'><i id='closeX' class='closeWarn bi bi-x-lg'></i>";
    newText += "<div class='content' id='warning'>";
    newText += "<h4>Deleting this entry will remove it from the database.</h4><h4>This CANNOT be undone.</h4>";
    newText += "<button id='cancel' class='closeWarn'>Cancel</button><button class='del' id='del" + id + "'>Delete</button>";
    newText += "</div></div>";
    $("body").append(newText);
}

function closeWarn() {
    $("#popUp").remove();
}

function deleteContact(id) {
    closeWarn();
    $.post("delete.php", {action: "del", id: id}, function(data) {
        if(data)
            $("#err").remove();
            $("body").append(data);
        $("#contact" + id).remove();
    });
}