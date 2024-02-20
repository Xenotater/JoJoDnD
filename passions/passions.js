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
        passions = Object.keys(pData);
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
    box2Text += "<h3 class='display-title'>" + passion.name + " Traits</h3><p><b><u>Saving Throws:</u></b> " + passion.saves + "</p><p><b><u>\
    Ability Score Increase:</u></b> " + passion.ability + "</p><p><b><u>" + passion.custom.name + ":</u></b> " + passion.custom.desc;
    if (passion.alt != null) box2Text += " Alternatively, you may choose to forgo one of these Proficiencies to instead gain " + passion.alt;
    box2Text += "</p>";
    if (passion.profs != null) {
        box2Text += "<p><b><u>Additional Proficiencies:</u></b> You gain an additional " + passion.profs;
        if (passion.profs == 1)
            box2Text += " Proficiency"
        else
            box2Text += " Proficiencies";
        box2Text += "  of your choice.</p>";
    }
    
    $("#box1").html(box1Text);
    $("#box2").html(box2Text);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + p).addClass("listCurrent");
}