var r, rData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    r = url.searchParams.get("focus");

    if (r == null) {
        r = "Human";
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
            r = "Human";
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}


function updateDisplay() {
    var race = rData[r];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + race.name + "</h2><div class='display-img'><img class='img-fluid' src='Assets/" + r + ".webp' alt='" + r + "'></div>";
    if (race.examples != null && race.links != null && race.examples.length == race.links.length) {
        newContent += "<p class='center'><small><b>Examples of " + (race.name + 's').replace(/Mans$/g, "Men") + ": </b><i>";
        for (let i = 0; i < race.examples.length; i++) {
            newContent += "<a href='https://jojowiki.com/" + race.links[i] + "' target='_blank'>"  + race.examples[i] + "</a>";
            if (i != race.examples.length-1)
                newContent += ", ";
            else
                newContent += "</i></small></p>";
        }
    }
    newContent += "<h4 class='display-heading'>Description</h4><p>" + race.desc + "</p>";
    if (race.playing != null)
        newContent += "<h4 class='display-heading'>Playing a" + (/[AEIOU]/.test(race.name[0])?"n ":" ") + race.name + "</h4><p>" + race.playing + "</p>";
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
    if (race.levels != null) {
        newContent += "<h4 class='display-heading'>Leveling Up</h4>";
        newContent += "<table class='table table-striped levels' id='" + race.theme + "'><thead><tr><th>Level</th><th>Energy Required</th><th>Features</th></tr></thead><tbody>";
        for (let i = 1; i <= race.levels; i++) {
            newContent += "<tr><td>" + i + "</td><td>" + race.level[i].energy + "</td><td>";
            if (race.level[i].special != null)
                newContent += race.level[i].special;
            else if (race.level[i].feats != null)
                for (let j = 0; j < race.level[i].feats.length; j++) {
                    var f = race.level[i].feats[j];
                    if (f.includes("(")) {
                        f = f.split(" (");
                        f[1] = " (" + f[1];
                        newContent += "<a href='/abilities/?focus=" + f[0].replace(/[ -]/g, "_").replace("'", "") + "'>" + f[0] + "</a>" + f[1];
                    }
                    else {
                        newContent += "<a href='/abilities/?focus=" + race.level[i].feats[j].replace(/ /g, "_") + "'>" + race.level[i].feats[j] + "</a>";
                        if (j != race.level[i].feats.length-1)
                            newContent += " | ";
                        else
                            newContent += "</td>";
                    }
                }
            newContent += "</tr>";
        }
        newContent += "</tbody></table>";
    }

    if (race.subraces != null) {
        for (subrace of race.subraces) {
            newContent += "<div class='divider sub-divider'/>"
            newContent += `<div class='display-img'><img class='img-fluid' src='Assets/${r}_${subrace.name}.webp' alt='${subrace.name}'></div>`;
            newContent += `<h3 class='display-title center' id='${subrace.name}'>${subrace.name}</h3>`;
            if (subrace.examples != null && subrace.links != null && race.examples.length == subrace.links.length) {
                newContent += "<p class='center'><small><b>Examples of " + (subrace.name + 's') + ": </b><i>";
                for (let i = 0; i < subrace.examples.length; i++) {
                    newContent += "<a href='https://jojowiki.com/" + subrace.links[i] + "' target='_blank'>"  + subrace.examples[i] + "</a>";
                    if (i != subrace.examples.length-1)
                        newContent += ", ";
                    else
                        newContent += "</i></small></p>";
                }
            }
            newContent += "<h4 class='display-heading'>Description</h4><p>" + subrace.desc + "</p>";
            if (subrace.playing != null)
                newContent += "<h4 class='display-heading'>Playing a" + (/[AEIOU]/.test(subrace.name[0])?"n ":" ") + subrace.name + "</h4><p>" + subrace.playing + "</p>";
            if (subrace.note != null)
                newContent += "<p><small><b>Note: </b><i>" + subrace.note + "</i></small></p>";
            if (subrace.changes != null)
                newContent += "<h4 class='display-heading'>Changes</h4><p>" + subrace.changes + "</p>";
            if (subrace.feats != null) {
                newContent += "<h4 class='display-heading'>Racial Features</h4><ul>";
                for (let i = 0; i < subrace.feats.length; i++) {
                    if (subrace.feats[i+1] == "OR") {
                        newContent += "<li><a href='/abilities/?focus=" + subrace.feats[i].replace(/ /g, "_") + "'>" + subrace.feats[i] + "</a> OR <a href='/abilities/?focus=" + subrace.feats[i+2].replace(/ /g, "_") + "'>" + subrace.feats[i+2] + "</a></li>";
                        i += 2;
                    }
                    else
                        newContent += "<li><a href='/abilities/?focus=" + subrace.feats[i].replace(/ /g, "_") + "'>" + subrace.feats[i] + "</a></li>";
                }
                newContent += "</ul>";
            }
            if (subrace.note2 != null) {
                newContent += "<p><small><b>Note: </b><i>" + subrace.note2 + "</i></small></p>";
            }
        }
    }

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + r).addClass("listCurrent");
}