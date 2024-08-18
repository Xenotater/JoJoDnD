var f, fData, feats, reverse = false, showEpics = false;

$(document).ready(function () {
    let url = new URL(window.location.href);
    f = url.searchParams.get("focus");
    q = url.searchParams.get("search");

    if (f == null) {
        f = "Act_Modification";
        updateURL();
    }

    getData(q);

    $("#list").on("click", ".list-link", function () {
        f = $(this).attr("id");
        if (f == "Epic_Feat") {
            showEpics = true;
            $("#epic-switch").prop("checked", true);
            f = "Extreme_Motivation";
            updateList();
        }
        updateURL();
        updateDisplay();
    });

    $("#display").on("click", "a.in-page", function() {
        f= $(this).html().replace(/[ -]/g, "_").replace(/'/g, "");
        if (!(fData[f].prereq?.includes("Epic") ^ !showEpics)) {
            showEpics = !showEpics;
            $("#epic-switch").prop("checked", showEpics);
            updateList();
        }
        updateURL();
        updateDisplay();
    });

    $("#epic-switch").change(function() {
        showEpics = !showEpics;
        if (showEpics)
            f = "Extreme_Motivation";
        else
            f = "Act_Modification";
        updateURL();
        updateList();
        updateDisplay();
    });

    $("#search").on("input", function () {
        search($(this).val());
        updateURL(); 
    });

    $(".sorter").click(function() {
        let btn = $(this);
        let id = btn.attr("id");

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
    let query = $("#search").val();
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
        if (fData[f].prereq?.includes("Epic")) {
            showEpics = true;
            $("#epic-switch").prop("checked", true);
        }
        feats = Object.keys(fData);
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
    $("#list-table tbody").html("");
    feats.sort();
    if (reverse)
        feats.reverse();
    for (let i = 0; i < feats.length; i++) {
        let feat = fData[feats[i]];
        if (!(feat.prereq?.includes("Epic") ^ showEpics)) //xand
            $("#list-table tbody").append("<tr class='list-link' id='" + feat.name.replace(/[ -]/g, "_").replace(/'/g, "") + "'><td>" + feat.name + "</td></tr>");
    }
    $("#" + f).addClass("listCurrent");
}

function updateDisplay() {
    let feat = fData[f];
    let newContent = "";

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
    let not = false;
    feats = [];
    
    if (query.match(/^NOT */)) {
        not = true;
        query = query.replace(/^NOT */, "");
    }

    for (let key in fData) {
        let matched = false;
        for (let key2 in fData[key]) {
            let attr= "";
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