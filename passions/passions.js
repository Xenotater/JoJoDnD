var p, pData;

$(document).ready(function () {
    var url = new URL(window.location.href);
    p = url.searchParams.get("focus");
    // var filterOpen = false;

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

    //all below wasn't needed for few number of passions, but may be for other pages
    // $("#search").focusin(function () {
    //     $(this).css("box-shadow", "0 0 20px purple");
    // })

    // $("#search").focusout(function () {
    //     $(this).css("box-shadow", "none");
    // })

    // $("#filter").click(function() {
    //     var that = "#filters";
    //     if (filterOpen) {
    //         $(this).css("box-shadow", "none");
    //         $("#list").animate({
    //             height: "500px"
    //         }, 400)
    //         $(that).animate({
    //             height: "0",
    //             paddingTop: "0",
    //             paddingBottom: "0"
    //         }, 400, function() {
    //             $(that).css("border-bottom", "none");
    //             $(that).html("");
    //         })
    //         filterOpen = false;
    //     }
    //     else {
    //         $(this).css("box-shadow", "0 0 20px purple");
    //         $(that).css("border-bottom", "2px solid purple");

    //         $(that).append("<span class='underline bold'>Abilities</span><span>: </span><button class='filter-item' id='str'>Str</button>");
    //         $(that).append("<button class='filter-item' id='dex'>Dex</button><button class='filter-item' id='con'>Con</button><button class='filter-item' id='int'>Int</button>");
    //         $(that).append("<button class='filter-item' id='wis'>Wis</button><button class='filter-item' id='cha'>Cha</button>");

    //         $("#list").animate({
    //             height: "450px"
    //         }, 400)
    //         $(that).animate({
    //             height: "50px",
    //             paddingTop: "7px",
    //             paddingBottom: "7px"
    //         }, 400)
    //         filterOpen = true;
    // //     }
    // // })

    // $("#reset").click(function() {
    //     $(this).css("box-shadow", "0 0 20px purple");
    //     var timeout = setTimeout(function() {
    //         $("#reset").css("box-shadow", "none");
    //     }, 1000);
    // })
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

    box1Text += "<h2 class='passion-title'>" + passion.name + "</h2><p>" + passion.desc + "</p><h5 class='passion-heading'>Examples</h4><ul id='example-list'>";
    for (let i = 0; i < passion.examples.length; i++) {
        box1Text += "<li>" + passion.examples[i] + "</li>";
    }
    box1Text += "</ul>";
    box2Text += "<h3 class='passion-title'>" + passion.name + " Traits</h3><p><i>Saving Throws:</i> " + passion.saves + "<p><b><u>\
    Ability Score Increase:</u></b> " + passion.ability + "<p><b><u>" + passion.custom.name + ":</u></b> " + passion.custom.desc;
    if (passion.languages != null) box2Text += "<p><b><u>Languages:</u></b> " + passion.languages;
    
    $("#box1").html(box1Text);
    $("#box2").html(box2Text);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + p).addClass("listCurrent");
}