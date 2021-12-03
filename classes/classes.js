var c, cData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    c = url.searchParams.get("focus");

    if (c == null) {
        c = "Ripple";
        updateURL();
    }

    getData();

    $(".class-link").click(function () {
        c = $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + c);
}

function getData() {
    $.getJSON("classes.json", function(data) {
        cData = data;
        if (cData[c] == null && cData["Stands"].types[c] == null && cData["Non-Supernatural"].types[c] == null)
            c = "Ripple";
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}

function showTypes() {
    $(".stand-type").css("display", "block");
}

function updateDisplay() {
    var clss = cData[c];
    var newContent = "";

    if ($("#" + c).hasClass("stand-type"))
        clss = cData["Stands"].types[c];

    if ($("#" + c).hasClass("non-super"))
        clss = cData["Non-Supernatural"].types[c];

    newContent += "<h2 class='class-title'>" + clss.name + "</h2><div class='class-img'><img src='Assets/" + c + ".png' alt='" + c + "'></div>";
    if (clss.exampleOf != null) {
        newContent += "<p class='center'><small><b>Examples of " + clss.exampleOf + ": </b><i>";
        for (let i = 0; i < clss.examples.length; i++) {
            newContent += "<a href='https://jojo.fandom.com/wiki/" + clss.links[i] + "' target='_blank'>" + clss.examples[i] + "</a>";
            if (i != clss.examples.length - 1)
                newContent += ", ";
        }
        newContent += "</i></small></p>";
    }
    if (clss.dc != null)
        newContent += "<div class='row center' id='stat'><div class='col-sm-4'><p><b>Hit Dice: </b>" + clss.hDice + "</p></div><div class='col-sm-8'><p><b>" + clss.dcName + "</b>: " + clss.dc + "</p></div></div>";
    else if (clss.hDice != null)
        newContent += "<p class='center'><b>Hit Dice: </b>" + clss.hDice + "</p>";
    newContent += "<h4 class='class-heading'>Description</h4><p>" + clss.desc + "</p>";
    if (clss.extra != null)
        for (let i = 0; i < clss.extra.length; i++) {
            newContent += "<p><b>" + clss.extra[i].name + ": </b>" + clss.extra[i].desc + "</p>";
            var table = clss.extra[i].table;
            if (table != null) {
                newContent += "<table class='table table-striped' id='" + table.id + "'><thead><tr>";
                for (let j = 0; j < table.head.length; j++)
                    newContent += "<th>" + table.head[j] + "</th>";
                newContent += "</tr></thead><tbody>";
                for (let j = 0; j < table.body.length; j++) {
                    newContent += "<tr>";
                    for (let k = 0; k < table.body[j].length; k++)
                        newContent += "<td>" + table.body[j][k] + "</td>";
                    newContent += "</tr>";
                }
                newContent += "</tbody></table>";
            }
        }
    if (clss.notes != null)
        for (let i = 0; i < clss.notes.length; i++)
            newContent += "<p><small><b>Note: </b><i>" + clss.notes[i] + "</i></small></p>";

    if (clss.level != null) {
        newContent += "<h4 class='class-heading'>Leveling Up</h4>";
        newContent += "<table class='table table-striped levels' id='" + clss.theme + "'><thead><tr><th>Level</th><th>Pro. Bonus</th><th>Feats</th><th>Features</th>";
        if(clss.otherCols != null)
            for (let i = 0; i < clss.otherCols.length; i++)
                newContent += "<th>" + clss.otherCols[i].name + "</th>"
        newContent += "</tr></thead><tbody>";
        for (let i = 1; i <= 20; i++) {
            l = clss.level[i];
            newContent += "<tr><td>" + i + "</td><td>+" + l.pro + "</td><td>" + l.feats + "</td><td>";
            if (l.otherFeatures != null)
                for (let j = 0; j < l.otherFeatures.length; j++) {
                    newContent += l.otherFeatures[j];
                    if (j != l.otherFeatures.length-1 || l.linkFeatures != null || l.featFeatures != null || l.ability != null)
                        newContent += ", ";
                }
            if (l.linkFeatures != null)
                for (let j = 0; j < l.linkFeatures.length; j++) {
                    if (l.linkFeatures[j] != "OR") {
                        newContent += "<a href='/abilities/?focus=" + l.linkFeatures[j].replace(/ /g, "_") + "'>" + l.linkFeatures[j] + "</a>";
                        if ((j != l.linkFeatures.length-1 || l.featFeatures != null ||l.ability != null) && l.linkFeatures[j+1] != "OR")
                            newContent += ", ";
                    }
                    else
                        newContent += " OR ";
                }
            if (l.featFeatures != null)
                for (let j = 0; j < l.featFeatures.length; j++) {
                    if (l.featFeatures[j] != "OR") {
                        newContent += "<a href='/feats/?focus=" + l.featFeatures[j].replace(/ /g, "_") + "'>" + l.featFeatures[j] + "</a>";
                        if (j != l.featFeatures.length-1 || l.ability != null)
                            newContent += ", ";
                    }
                    else
                        newContent += " OR ";
                }
            if (l.ability != null)
                for (let j = 0; j < l.ability.length; j++) {
                    newContent += l.ability[j];
                    if (j != l.ability.length-1)
                        newContent += ", ";
                }
            newContent += "</td>";
            if (clss.otherCols != null)
                for (let j = 0; j < clss.otherCols.length; j++)
                    newContent += "<td>" + clss.otherCols[j].level[i] + "</td>";
            newContent += "</tr>";
        }
        newContent += "</tbody></table>";
    }
    
    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + c).addClass("listCurrent");

    if (c == "Stands" || $(".listCurrent").hasClass("stand-type"))
        $(".stand-type").css("display", "block");
    else
        $(".stand-type").css("display", "none");

    if (c == "Non-Supernatural" || $(".listCurrent").hasClass("non-super"))
        $(".non-super").css("display", "block");
    else
        $(".non-super").css("display", "none");
}