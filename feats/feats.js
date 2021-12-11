var f, fData, feats, reverse = false;

$(document).ready(function () {
    var url = new URL(window.location.href);
    f = url.searchParams.get("focus");
    q = url.searchParams.get("search");

    if (f == null) {
        f = "Adrenaline_Rush";
        updateURL();
    }

    getData(q);

    $("#list").on("click", ".list-link", function () {
        f = $(this).attr("id");
        updateURL();
        updateDisplay();
    });

    $("#search").on("input", function () {
        search($(this).val());
        updateSearch($(this).val()); 
    });

    $(".sorter").click(function() {
        var btn = $(this);
        var id = btn.attr("id");

        if (id == "Down") {
            if (btn.hasClass("bi-caret-down")) {
                btn.removeClass("bi-caret-down");
                btn.addClass("bi-caret-down-fill");
                $("#Up").removeClass("bi-caret-up-fill");
                $("#Up").addClass("bi-caret-up");
                reverse = true;
                updateList();
            }
        }
        else {
            if (btn.hasClass("bi-caret-up")) {
                btn.removeClass("bi-caret-up");
                btn.addClass("bi-caret-up-fill");
                $("#Down").removeClass("bi-caret-down-fill");
                $("#Down").addClass("bi-caret-down");
                reverse = false;
                updateList();
            }
        }
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + f);
}

function getData(q) {
    $.getJSON("feats.json", function(data) {
        fData = data;
        if (fData[f] == null)
            f = "Adrenaline_Rush";
        feats = Object.keys(fData);
        updateList();
        updateDisplay();

        if (q != null) {
            $("#search").val(q);
            search(q);
        }
    });

    $(".simplebar-content").html("<tr id='temp'><td><div class='loading'></div></td></tr>");
    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    $(".simplebar-content").html("");
    feats.sort();
    if (reverse)
        feats.reverse();
    for (let i = 0; i < feats.length; i++)
        $(".simplebar-content").append("<tr class='list-link' id='" + fData[feats[i]].name.replace(/ /g, "_") + "'><td>" + fData[feats[i]].name + "</td></tr>");
    $("#" + f).addClass("listCurrent");
}

function updateDisplay() {
    var feat = fData[f];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + feat.name + "</h2>";
    if (feat.prereq != null)
        newContent += "<p><b><u>Prerequisite:</u> " + feat.prereq + "</b></p>";
    newContent += "<p class='section'><b>Description: </b></p><p>" + feat.desc + "</p>";
    newContent += "<p class='section'><b>Effects: </b></p><ul>"
    for (let i = 0; i <feat.effects.length; i++)
        newContent += "<li>" + feat.effects[i] + "</li>";
    newContent += "</ul>";

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + f).addClass("listCurrent");
}

function search(query) {
    var not = false;
    feats = [];
    
    if (query.match(/^NOT */)) {
        not = true;
        query = query.replace(/^NOT */, "");
    }

    for (var key in fData) {
        var matched = false;
        for (var key2 in fData[key]) {
            var attr= "";
            attr += fData[key][key2];
            if (attr.toLowerCase().includes(query.toLowerCase()))
                matched = true;
            if ("prerequisite".includes(query.toLowerCase()) && fData[key].prereq != null) //make sure prereqs can be searched for
                matched = true;
        }
        if ((matched && !not) || (!matched && not))
            feats.push(key);
    }

    updateList();
}

function updateSearch(query) {
    updateURL();
    if (query != "")
        window.history.replaceState(null, "", window.location.search + '&search=' + query);
}