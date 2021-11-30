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
    var src = c;

    if ($("#" + c).hasClass("stand-type"))
        clss = cData["Stands"].types[c];

    if ($("#" + c).hasClass("non-super")) {
        clss = cData["Non-Supernatural"].types[c];
        src = "Non-Supernatural"
    }

    newContent += "<h2 class='class-title'>" + clss.name + "</h2><div class='class-img'><img src='Assets/" + src + ".png' alt='" + src + "'></div>";
    if (clss.exampleOf != null) {
        newContent += "<p class='center'><small><b>Examples of " + clss.exampleOf + "</b>: <i>";
        for (let i = 0; i < clss.examples.length; i++) {
            newContent += "<a href='https://jojo.fandom.com/wiki/" + clss.links[i] + "' target='_blank'>" + clss.examples[i] + "</a>";
            if (i != clss.examples.length - 1)
                newContent += ", ";
        }
        newContent += "</i></small></p>";
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