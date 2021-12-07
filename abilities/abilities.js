var a, aData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    a = url.searchParams.get("focus");

    if (a == null) {
        a= "Anchored_Stand";
        updateURL();
    }

    getData();

    $("#list").on("click", ".list-link", function () {
        a= $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + a);
}

function getData() {
    $.getJSON("abilities.json", function(data) {
        aData = data;
        if (aData[a] == null)
            a = "Anchored_Stand";
        updateList();
        updateDisplay();
    });

    $("#list-table tbody").html("<tr id='temp'><td><div class='loading'></div></td></tr>");
    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    $("#temp").remove();
    for (var key of Object.keys(aData)) {
        var abil = aData[key];
        var classes = abil.classes;
        var races = abil.races;

        var newContent = "<tr class='list-link' id='" + abil.name.replace(/ /g, "_") + "'><td>" + abil.name + "</td><td>";
        for (let i = 0; i < abil.cls.length; i++) {
            newContent += abil.cls[i];
            if (i != abil.cls.length - 1)
                newContent += ", ";
            else
                newContent += "</td>";
        }
        newContent += "</tr>";

        $("#list-table tbody").append(newContent);
    }
}

function updateDisplay() {
    var abil = aData[a];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + abil.name + "</h2>";
    newContent += "<p>" + abil.desc + "</p>"
    newContent += "<h4 class='display-heading'>Given To</h4><ul id='given'>";
    if (abil.classes != null)
        for (let i = 0; i < abil.classes.length; i++)
            newContent += "<li><a href='/classes/?focus=" + abil.classes[i].replace(" Stands", "").replace(/ /g, "_") + "'>" + abil.classes[i] + "</a></li>";
    if (abil.races != null)
        for (let i = 0; i < abil.races.length; i++)
            newContent += "<li><a href='/races/?focus=" + abil.races[i].replace(/ /g, "_") + "'>" + abil.races[i] + "</a></li>";

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + a).addClass("listCurrent");
}