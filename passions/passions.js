var p, pData, passions;

$(document).ready(function () {
    var url = new URL(window.location.href);
    p = url.searchParams.get("focus");

    if (p == null) {
        p = "Academic";
        updateURL();
    }

    getData();

    $("#list").on("click", ".list-link", function () {
        p = $(this).attr("id");
        updateURL();
        updateDisplay();
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + p);
}

function getData() {
    $.getJSON("passions.json", function(data) {
        pData = data;
        if (pData[p] == null)
            p = "Academic";
        passions = Object.keys(pData).sort();
        updateList();
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    $("#list-table tbody").html("");
    for (let i=0; i < passions.length; i++) {
        let passion = pData[passions[i]];
        $("#list-table tbody").append("<tr class='list-link' id='" + passion.name.replace(/ /g, "_") + "'><td>" + passion.name + "</td><td>" + passion.stats + "</td></tr>");
    }
    $("#" + p).addClass("listCurrent");
}

function updateDisplay() {
    var passion = pData[p], box1Text = "", box2Text = "";

    $("#display").html("<div class='col-5' id='box1'></div><div class='col-7' id='box2'></div>");

    box1Text += "<h2 class='display-title'>" + passion.name + "</h2><p>" + passion.desc + "</p><h5 class='display-heading'>Examples</h4><ul id='example-list'>";
    for (let i = 0; i < passion.examples.length; i++) {
        box1Text += "<li>" + passion.examples[i] + "</li>";
    }
    box1Text += "</ul>";
    box2Text += "<h3 class='display-title'>" + passion.name + " Traits</h3><p><b><u>Saving Throws:</u></b> " + passion.saves + "</p><p><b><u>Ability Score Increase:</u></b> ";
    if (passion.ability != null)
        box2Text += passion.ability;
    else
        box2Text += parseASI(passion.stats);
    box2Text += "</p><p><b><u>" + passion.custom.name + ":</u></b> " + passion.custom.desc;
    if (passion.alt != null) box2Text += " Alternatively, you may choose to forgo one of these Proficiencies to instead gain " + passion.alt;
    box2Text += "</p>";
    box2Text += "<p><b><u>Additional Proficiencies:</u></b> You gain an additional amount of Proficiencies of your choice equal to 1 + your Proficiency Bonus."
    
    $("#box1").html(box1Text);
    $("#box2").html(box2Text);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + p).addClass("listCurrent");
}

function parseASI(asi) {
    if (asi == "")
        return "";

    let stats = [], vals = [];
    let text = "Your ";

    asi = asi.split(", ");

    for (let i=0; i<asi.length; i++) {
        let stat = asi[i].split(" ");
        stats.push(parseStat(stat[0]));
        vals.push(stat[1].replace("+", ""));
    }

    if ([...new Set(vals)].length == 1 && asi.length > 1) {
        for (let i=0; i<asi.length; i++) {
            text += stats[i];
            if (i + 1 != asi.length && asi.length > 2)
                text += ", ";
            if (i + 2 == asi.length)
                text += " and ";
        }
        text += " Scores increase by " + vals[0];
    }
    else if (asi.length > 1) {
        for (let i=0; i<asi.length; i++) {
            text += stats[i] + " Score increases by " + vals[i];
            if (i + 2 == asi.length)
                text += ", and your ";
            else if (i + 1 != asi.length)
                text += ", your ";
        }
    }
    else
        text += stats[0] + " Score increases by " + vals[0];

    return text + ".";
}

function parseStat(stat) {
    switch (stat) {
        case "Str":
            return "Strength";
        case "Dex":
            return "Dexterity";
        case "Con":
            return "Constitution";
        case "Int":
            return "Intelligence";
        case "Wis":
            return "Wisdom";
        case "Cha":
            return "Charisma";
        default:
            return "";
    }
}