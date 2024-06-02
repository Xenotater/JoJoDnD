var f, fData, feats, reverse = false;

$(document).ready(function () {
    var url = new URL(window.location.href);
    f = url.searchParams.get("focus");
    q = url.searchParams.get("search");

    if (f == null) {
        f = "Act_Modification";
        updateURL();
    }

    getData(q);

    $("#list").on("click", ".list-link", function () {
        f = $(this).attr("id");
        if (f == "Epic_Feat")
            search("Epic Feat");
        updateURL();
        updateDisplay();
    });

    $("#display").on("click", "a.in-page", function() {
        f= $(this).html().replace(/[ -]/g, "_").replace(/'/g, "");
        updateURL();
        updateDisplay();
    });

    $("#search").on("input", function () {
        search($(this).val());
        updateURL(); 
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
    var query = $("#search").val();
    if (query != "")
        window.history.replaceState(null, "", '?focus=' + f + '&search=' + query);
    else
        window.history.replaceState(null, "", '?focus=' + f);
}

function getData(q) {
    $.getJSON("feats.json", function(data) {
        fData = data;
        if (fData[f] == null)
            f = "Act_Modification";
        feats = Object.keys(fData);
        if (f == "Epic Feat" || (fData[f].prereq != null && fData[f].prereq.includes("Epic")))
            search("Epic Feat");
        updateList();
        updateDisplay();

        if (q != null) {
            $("#search").val(q);
            search(q);
        }
    });

    $("#list-table tbody").html("<tr id='temp'><td><div class='loading'></div></td></tr>");
    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    var showEpic = $("#search").val().includes("Epic");
    $("#list-table tbody").html("");
    feats.sort();
    if (reverse)
        feats.reverse();
    for (let i = 0; i < feats.length; i++) {
        let feat = fData[feats[i]];
        if (feat.prereq == null || !feat.prereq.includes("Epic Feat") || showEpic)
            $("#list-table tbody").append("<tr class='list-link' id='" + feat.name.replace(/[ -]/g, "_").replace(/'/g, "") + "'><td>" + feat.name + "</td></tr>");
    }
    $("#" + f).addClass("listCurrent");
}

function updateDisplay() {
    var feat = fData[f];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + feat.name + "</h2>";
    if (feat.prereq != null)
        newContent += "<p><b><u>Prerequisite:</u> " + feat.prereq + "</b></p>";
    if (feat.desc != null)
        newContent += "<p class='section'><b>Description: </b></p><p>" + feat.desc + "</p>";
    newContent += "<p class='section'><b>Effects: </b></p><ul class='effects'>"
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

    $("#search").val(query); //put query in the search box, in case the search was done through some other method
    updateList();
}