var a, aData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    a = url.searchParams.get("focus");

    if (a== null) {
        a = "Stone_Mask";
        updateURL();
    }

    getData();

    $(".art-link").click(function () {
        a = $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + a);
}

function getData() {
    $.getJSON("artifacts.json", function(data) {
        aData = data;
        if (aData[a] == null)
            a = "Stone_Mask";
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}

function updateDisplay() {
    var art = aData[a];
    var newContent = "";

    newContent += "<h2 class='art-title'>" + art.name + "</h2><div class='art-img'><img class='img-fluid' src='Assets/" + a + ".png' alt='" + a + "'></div>";
    if (art.lore != null)
        newContent += "<p class='center note'><small><i>" + art.lore + "</i></small></p>";
    newContent += "<h4 class='art-heading'>Description</h4><p>" + art.desc + "</p>";
    if (art.effect != "N/A")
        newContent += "<h4 class='art-heading'>Effect</h4><p>" + art.effect + "</p>";
    if (art.note != null)
        newContent += "<p class='note'><small><b>Note</b>:<i> " + art.note + "</i></small></p>";
    if (art.other != null) {
        for (let i = 0; i < art.other.length; i++) {
            newContent += "<h4 class='art-heading'>" + art.other[i].name + "</h4>";
            for (let j = 0; j < art.other[i].content.length; j++)
                newContent += art.other[i].content[j];
        }
    }

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + a).addClass("listCurrent");
}