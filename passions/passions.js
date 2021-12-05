var p, pData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    p = url.searchParams.get("focus");

    if (p == null) {
        p = "Academic";
        updateURL();
    }

    getData();

    $(".passion-link").click(function () {
        p = $(this).html();
        p = p.replace(' ', '_');
        updateURL();
        updateDisplay();
    });

    $(".passion-list-link").click(function () {
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
        updateDisplay();
    });

    $("#display").html("<div class='loading'></div>");
}

function updateDisplay() {
    var passion = pData[p], box1Text = "", box2Text = "";

    $("#display").html("<div class='col-5' id='box1'></div><div class='col-7' id='box2'></div>");

    box1Text += "<h2 class='display-title'>" + passion.name + "</h2><p>" + passion.desc + "</p><h5 class='display-heading'>Examples</h4><ul id='example-list'>";
    for (let i = 0; i < passion.examples.length; i++) {
        box1Text += "<li>" + passion.examples[i] + "</li>";
    }
    box1Text += "</ul>";
    box2Text += "<h3 class='display-title'>" + passion.name + " Traits</h3><p><i>Saving Throws:</i> " + passion.saves + "<p><b><u>\
    Ability Score Increase:</u></b> " + passion.ability + "<p><b><u>" + passion.custom.name + ":</u></b> " + passion.custom.desc;
    if (passion.languages != null) box2Text += "<p><b><u>Languages:</u></b> " + passion.languages;
    
    $("#box1").html(box1Text);
    $("#box2").html(box2Text);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + p).addClass("listCurrent");
}