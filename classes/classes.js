var c, cData, modData, viewModular = false;;

$(document).ready(function() {
    var url = new URL(window.location.href);
    c = url.searchParams.get("focus");

    if (c == null) {
        c = "Stands";
        updateURL();
    }
    if (c == "Stands" || $("#" + c).hasClass("stand-type"))
        drop("#Stands");
    if (c == "Non-Supernatural" || $("#" + c).hasClass("non-super"))
        drop("#Non-Supernatural");

    getData();

    $("#Stands").click(function() {
        if (c == "Stands") {
            if ($(this).hasClass("dropped"))
                hide("#Stands");
            else
                drop("#Stands");
        }
    });

    $("#Non-Supernatural").click(function() {
        if (c == "Non-Supernatural") {
            if ($(this).hasClass("dropped"))
                hide("#Non-Supernatural");
            else
                drop("#Non-Supernatural");
        }
    });

    $(".list-link").click(function() {
        c = $(this).attr("id");
        viewModular = false;
        updateURL();
        updateDisplay();
    });

    $("body").on("change", "#modular-switch", function() {
        viewModular = !viewModular;
        updateLevelupTable();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + c);
}

function getData() {
    $.getJSON("classes.json", function(data) {
        cData = data;
        if (cData[c] == null && cData["Stands"].types[c] == null && cData["Non-Supernatural"].types[c] == null)
            c = "Stands";

        $.getJSON("modular.json", function(data) {
            modData = data;
            updateDisplay();
            checkScroll();
        });
    });

    $("#display").html("<div class='loading'></div>");
}

function drop(id) {
    $(id).find(".dropdown").removeClass("bi-caret-down-fill");
    $(id).find(".dropdown").addClass("bi-caret-up-fill");
    if (id == "#Stands")
        $(".stand-type").css("display", "block");
    else
        $(".non-super").css("display", "block");
    $(id).addClass("dropped");
}

function hide(id) {
    $(id).find(".dropdown").removeClass("bi-caret-up-fill");
    $(id).find(".dropdown").addClass("bi-caret-down-fill");
    if (id == "#Stands")
        $(".stand-type").css("display", "none");
    else
        $(".non-super").css("display", "none");
    $(id).removeClass("dropped");
}

function updateDisplay() {
    var clss = cData[c];
    var newContent = "";

    if ($("#" + c).hasClass("stand-type"))
        clss = cData["Stands"].types[c];

    if ($("#" + c).hasClass("non-super"))
        clss = cData["Non-Supernatural"].types[c];

    newContent += "<h2 id='display-title'>" + clss.name + "</h2><div id='display-img'><img src='Assets/" + c + ".webp' alt='" + c + "'></div><p class='center'>";
    if (clss.exampleOf != null) {
        newContent += "<small><b>Examples of " + clss.exampleOf + ": </b><i>";
        for (let i = 0; i < clss.examples.length; i++) {
            newContent += "<a href='https://jojowiki.com/" + clss.links[i] + "' target='_blank'>" + clss.examples[i] + "</a>";
            if (i != clss.examples.length - 1)
                newContent += ", ";
        }
        newContent += "</i></small><br>";
    }
    if (clss.aka != null) {
        newContent += "<small>Also Known As <i>" + clss.aka + "</i> Stands</small>"
    }
    newContent += "</p>";
    if (clss.dc != null)
        newContent += "<div class='row center stats'><div class='col-sm-4'><p><b>Hit Dice: </b>" + clss.hDice + "</p></div><div class='col-sm-8'><p><b>" + clss.dcName + "</b>: " + clss.dc + "</p></div></div>";
    else if (clss.hDice != null)
        newContent += "<p class='center'><b>Hit Dice: </b>" + clss.hDice + "</p>";
    if (clss.aDice != null)
        newContent += "<div class='row center stats'><div class='col-sm-4'><p><b>Attack Dice: </b>" + clss.aDice[0] + "</p></div><div class='col-sm-8'><p><b>Attack Dice past Level 11: </b>" + clss.aDice[1] + "</p></div></div>";
    newContent += "<h4 class='display-heading'>Description</h4><p>" + clss.desc + "</p>";
    if (clss.notes != null)
        for (let i = 0; i < clss.notes.length; i++)
            newContent += "<p><small><b>Note: </b><i>" + clss.notes[i] + "</i></small></p>";

    if (clss.other != null)
        for (let i = 0; i < clss.other.length; i++) {
            newContent += "<h4 class='display-heading'>" + clss.other[i].name + "</h4>";
            for (let j = 0; j < clss.other[i].content.length; j++)
                newContent += clss.other[i].content[j];
        }

    if (clss.mults != null) {
        newContent += "<h4 class='display-heading'>Stat Conversion</h4><p class='center label'><b>Ability Score Multipliers:</b></p>";
        newContent += "<table class='table table-striped minor'><thead><tr><th>Stat</th><th>Multiplier</tr></thead><tbody>";
        newContent += "<tr><td>Power</td><td>Str x" + clss.mults[0] + "</td></tr>";
        newContent += "<tr><td>Precision</td><td>Dex x" + clss.mults[1] + "</td></tr>";
        newContent += "<tr><td>Durability</td><td>Con x" + clss.mults[2] + "</td></tr>";
        newContent += "<tr><td>Range</td><td>Int x" + clss.mults[3] + "</td></tr>";
        newContent += "<tr><td>Speed</td><td>Wis x" + clss.mults[4] + "</td></tr>";
        newContent += "<tr><td>Stand Energy</td><td>Cha x" + clss.mults[5] + "</td></tr>";
        newContent += "</tbody></table>";
    }
    if (clss.levelUp != null)
        newContent += "<h4 class='display-heading'>Increasing Stand Stats</h4><p>" + clss.levelUp + "</p>";
    
        if (clss.extra != null)
        for (let i = 0; i < clss.extra.length; i++) {
            newContent += "<p><b>" + clss.extra[i].name + ": </b>" + clss.extra[i].desc + "</p>";
            var table = clss.extra[i].table;
            if (table != null) {
                newContent += "<table class='table table-striped " + table.class + "'><thead><tr>";
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

    if (clss.level != null) {
        newContent += "<div id='levelup-header'><h4 class='display-heading'>Leveling Up</h4>"
        newContent += "<div id='modular-switch-box'><label>Modular Variant</label>"
        newContent += "<label class='switch horizontal'><input type='checkbox' id='modular-switch'";
        newContent += viewModular ? " checked " : "";
        newContent += "><span class='slider round horizontal'></span></label>";
        newContent += "</div></div>";
        newContent += "<table class='table table-striped levels' id='" + clss.theme + "'><thead><tr><th>Level</th><th>Pro. Bonus</th><th>Features</th>";
        if(clss.otherCols != null)
            for (let i = 0; i < clss.otherCols.length; i++)
                newContent += "<th>" + clss.otherCols[i].name + "</th>"
        newContent += "</tr></thead><tbody></tbody></table>";
    }
    
    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + c).addClass("listCurrent");

    if (clss.level != null)
        updateLevelupTable();
}

function updateLevelupTable() {
    let clss = cData[c];
    let newContent = "";

    if ($("#" + c).hasClass("stand-type"))
        clss = cData["Stands"].types[c];

    if ($("#" + c).hasClass("non-super"))
        clss = cData["Non-Supernatural"].types[c];
    
    for (let i = 1; i <= 20; i++) {
        let l = viewModular ? modData[c][i-1] : clss.level[i];
        newContent += "<tr><td>" + i + "</td><td>+" + calcPB(i) + "</td><td>";
        if (l.otherFeatures != null)
            for (let j = 0; j < l.otherFeatures.length; j++) {
                newContent += l.otherFeatures[j];
                if (j != l.otherFeatures.length-1 || l.linkFeatures != null || l.featFeatures != null || l.ability != null)
                    newContent += " | ";
            }
        if (l.linkFeatures != null)
            for (let j = 0; j < l.linkFeatures.length; j++) {
                if (l.linkFeatures[j] != "OR" && l.linkFeatures[j] != "and") {
                    var f = l.linkFeatures[j];
                    if (f.includes("(")) {
                        f = l.linkFeatures[j].split(" (");
                        f[1] = " (" + f[1];
                        newContent += "<a href='/abilities/?focus=" + f[0].replace(/[ -]/g, "_").replace("'", "") + "'>" + f[0] + "</a>" + f[1];
                    }
                    else
                        newContent += "<a href='/abilities/?focus=" + f.replace(/[ -]/g, "_").replace("'", "") + "'>" + f + "</a>"
                    if ((j != l.linkFeatures.length-1 || l.featFeatures != null ||l.ability != null) && (l.linkFeatures[j+1] != "OR" && l.linkFeatures[j+1] != "and"))
                        newContent += " | ";
                }
                else
                    newContent += " " + l.linkFeatures[j] + " ";
            }
        if (l.featFeatures != null)
            for (let j = 0; j < l.featFeatures.length; j++) {
                if (l.featFeatures[j] != "OR" && l.featFeatures[j] != "and") {
                    newContent += "<a href='/feats/?focus=" + l.featFeatures[j].replace(/[']/g, "").replace(/[ -]/g, "_") + "'>" + l.featFeatures[j] + "</a>";
                    if ((j != l.featFeatures.length-1 || l.ability != null) && (l.featFeatures[j+1] != "OR" && l.featFeatures[j+1] != "and"))
                        newContent += " | ";
                }
                else
                    newContent += " " + l.featFeatures[j] + " ";
            }
        if (l.ability != null)
            for (let j = 0; j < l.ability.length; j++) {
                newContent += l.ability[j];
                if (j != l.ability.length-1)
                    newContent += " | ";
            }
        if (l.otherFeatures == null && l.linkFeatures == null && l.featFeatures == null && l.ability == null)
            newContent += "-";
        newContent += "</td>";
        if (clss.otherCols != null)
            for (let j = 0; j < clss.otherCols.length; j++)
                newContent += "<td>" + clss.otherCols[j].level[i] + "</td>";
        newContent += "</tr>";
    }

    $("table.levels tbody").html(newContent);
}

function calcPB(level) {
    if (level > 20)
        return 6;
    else if (level < 1)
        return 2;
    else
        return Math.ceil(level / 4) + 1;
}

function checkScroll() {
    if (window.location.hash) {
        if ($("#display-img img")[0].complete)
            handleHashScroll(-120);
        else if ($("#display-img img")[0].complete != undefined)
            setTimeout(checkScroll, 100);
    }
}