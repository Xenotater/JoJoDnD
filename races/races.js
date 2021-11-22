var r, rData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    r = url.searchParams.get("focus");

    if (r == null) {
        r = "Zombie";
        updateURL();
    }

    getData();

    $(".race-link").click(function () {
        r = $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + r);
}

function getData() {
    $.getJSON("races.json", function(data) {
        rData = data;
        if (rData[r] == null)
            r = "Zombie";
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}


function updateDisplay() {
    var race = rData[r];
    var newContent = "";

    newContent += "<h2 class='race-title'>" + race.name + "</h2><div class='race-img'><img class='img-fluid' src='Assets/" + r + ".png' alt='" + r + "'></div>";
    newContent += "<p class='center'><small><b>Examples</b>:";
    for (let i = 0; i < race.examples.length; i++) {
        newContent += race.examples[i];
        if (i != race.examples.length-1)
            newContent += ", ";
        else
            newContent += "</small></p>";
    }
    newContent += "<h4 class='race-heading'>Description</h4><p>" + race.desc + "</p>";
    if (race.playing != null)
        newContent += "<h4 class='race-heading'>Playing a " + race.name + "</h4><p>" + race.playing + "</p>";
    if (race.changes != null)
        newContent += "<h4 class='race-heading'>Changes</h4><p>" + race.changes + "</p>";
    if (race.feats != null) {
        newContent += "<h4 class='race-heading'>Racial Features</h4><ul>";
        for (let i = 0; i < race.feats.length; i++) {
            newContent += "<li><a href='/abilities/?focus=" + race.feats[i].replace(/ /g, "_") + "'>" + race.feats[i] + "</a></li>";
        }
        newContent += "</ul>";
    }
    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + race.name).addClass("listCurrent");
}