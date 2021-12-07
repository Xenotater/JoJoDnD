var r, rData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    r = url.searchParams.get("focus");

    if (r == null) {
        r = "Zombie";
        updateURL();
    }

    getData();

    $(".list-link").click(function () {
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

    newContent += "<h2 class='display-title'>" + race.name + "</h2><div class='display-img'><img class='img-fluid' src='Assets/" + r + ".png' alt='" + r + "'></div>";
    newContent += "<p class='center'><small><b>Examples of " + (race.name + 's').replace(/Mans$/g, "Men") + ": </b><i>";
    for (let i = 0; i < race.examples.length; i++) {
        newContent += "<a href='https://jojo.fandom.com/wiki/" + race.links[i] + "' target='_blank'>"  + race.examples[i] + "</a>";
        if (i != race.examples.length-1)
            newContent += ", ";
        else
            newContent += "</i></small></p>";
    }
    newContent += "<h4 class='display-heading'>Description</h4><p>" + race.desc + "</p>";
    if (race.playing != null)
        newContent += "<h4 class='display-heading'>Playing a " + race.name + "</h4><p>" + race.playing + "</p>";
    if (race.note != null)
        newContent += "<p><small><b>Note: </b><i>" + race.note + "</i></small></p>";
    if (race.changes != null)
        newContent += "<h4 class='display-heading'>Changes</h4><p>" + race.changes + "</p>";
    if (race.feats != null) {
        newContent += "<h4 class='display-heading'>Racial Features</h4><ul>";
        for (let i = 0; i < race.feats.length; i++) {
            if (race.feats[i+1] == "OR") {
                newContent += "<li><a href='/abilities/?focus=" + race.feats[i].replace(/ /g, "_") + "'>" + race.feats[i] + "</a> OR <a href='/abilities/?focus=" + race.feats[i+2].replace(/ /g, "_") + "'>" + race.feats[i+2] + "</a></li>";
                i += 2;
            }
            else
                newContent += "<li><a href='/abilities/?focus=" + race.feats[i].replace(/ /g, "_") + "'>" + race.feats[i] + "</a></li>";
        }
        newContent += "</ul>";
    }
    if (race.note2 != null) {
        newContent += "<p><small><b>Note: </b><i>" + race.note2 + "</i></small></p>";
    }
    if (race.theme != null) {
        newContent += "<h4 class='display-heading'>Leveling Up</h4>";
        newContent += "<table class='table table-striped levels' id='" + race.theme + "'><thead><tr><th>Level</th><th>Energy Required</th><th>Features</th></tr></thead><tbody>";
        for (let i = 1; i <= 20; i++) {
            newContent += "<tr><td>" + i + "</td><td>" + race.level[i].energy + "</td><td>";
            if (race.level[i].special != null)
                newContent += race.level[i].special;
            else
                for (let j = 0; j < race.level[i].feats.length; j++) {
                    if (j == race.level[i].feats.length-2)
                        newContent += "and ";
                    newContent += "<a href='/abilities/?focus=" + race.level[i].feats[j].replace(/ /g, "_") + "'>" + race.level[i].feats[j] + "</a>";
                    if (j != race.level[i].feats.length-1)
                        newContent += ", ";
                    else
                        newContent += "</td>";
                }
            newContent += "</tr>";
        }
        newContent += "</tbody></table>";
    }
    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + r).addClass("listCurrent");
}