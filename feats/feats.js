var f, fData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    f = url.searchParams.get("focus");

    if (f == null) {
        f = "Adrenaline_Rush";
        updateURL();
    }

    getData();

    $("#list").on("click", ".list-link", function () {
        f = $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + f);
}

function getData() {
    $.getJSON("feats.json", function(data) {
        fData = data;
        if (fData[f] == null)
            f = "Adrenaline_Rush";
        updateList();
        updateDisplay();
    });

    $("#list-table tbody").html("<tr id='temp'><td><div class='loading'></div></td></tr>");
    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    $("#temp").remove();
    for (var key of Object.keys(fData))
        $("#list-table tbody").append("<tr class='list-link' id='" + fData[key].name.replace(/ /g, "_") + "'><td>" + fData[key].name + "</td></tr>");
}

function updateDisplay() {
    var feat = fData[f];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + feat.name + "</h2>";
    if (feat.prereq != null)
        newContent += "<p><b><u>Prerequisite:</u> " + feat.prereq + "</b></p>";
    newContent += "<p class='label'><b>Description: </b></p><p>" + feat.desc + "</p>";
    newContent += "<p class='label'><b>Effects: </b></p><ul>"
    for (let i = 0; i <feat.effects.length; i++)
        newContent += "<li>" + feat.effects[i] + "</li>";
    newContent += "</ul>";

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + f).addClass("listCurrent");
}