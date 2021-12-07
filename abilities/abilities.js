var a, aData, abilities = [], sortType = "name", reverse = false;

$(document).ready(function () {
    var url = new URL(window.location.href);
    a = url.searchParams.get("focus");
    q = url.searchParams.get("search");

    if (a == null) {
        a= "Anchored_Stand";
        updateURL();
    }

    getData(q);

    $("#list").on("click", ".list-link", function () {
        a= $(this).attr("id");
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

        if (id.includes("Down")) {
            if (btn.hasClass("bi-caret-down")) {
                reset(".bi-caret-down-fill");
                reset(".bi-caret-up-fill");

                btn.removeClass("bi-caret-down");
                btn.addClass("bi-caret-down-fill");

                if (id.includes("class"))
                    sortType = "cls";
                else
                    sortType = "name";
                reverse = true;
                updateList();
            }
        }
        else {
            if (btn.hasClass("bi-caret-up")) {
                reset(".bi-caret-down-fill");
                reset(".bi-caret-up-fill");

                btn.removeClass("bi-caret-up");
                btn.addClass("bi-caret-up-fill");

                if (id.includes("class"))
                    sortType = "cls";
                else
                    sortType = "name";
                reverse = false;
                updateList();
            }
        }
    });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + a);
}

function getData(q) {
    $.getJSON("abilities.json", function(data) {
        aData = data;
        if (aData[a] == null)
            a = "Anchored_Stand";
        for (var key of Object.keys(aData))
            abilities.push([key, aData[key]]);
        // abilities = Object.keys(aData);
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
    var currentID = $(".listCurrent").attr("id");
    $("#list-table tbody").html("");
    sort();
    if (reverse)
        abilities.reverse();
    for (let i = 0; i < abilities.length; i++) {
        var abil = aData[abilities[i][0]];
        var classes = abil.classes;
        var races = abil.races;

        var newContent = "<tr class='list-link' id='" + abil.name.replace(/ /g, "_") + "'><td>" + abil.name + "</td><td>";
        for (let i = 0; i < abil.cls.length; i++) {
            newContent += abil.cls[i];
            if (i != abil.cls.length - 1)
                newContent += ", ";
            else
                newContent += "</td>";
        }
        newContent += "</tr>";

        $("#list-table tbody").append(newContent);
    }
    $("#" + currentID).addClass("listCurrent");
}

function updateDisplay() {
    var abil = aData[a];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + abil.name + "</h2>";
    newContent += "<p>" + abil.desc + "</p>"
    newContent += "<h4 class='display-heading'>Given To</h4><ul id='given'>";
    if (abil.classes != null)
        for (let i = 0; i < abil.classes.length; i++)
            newContent += "<li><a href='/classes/?focus=" + abil.classes[i].replace(" Stands", "").replace(/ /g, "_") + "'>" + abil.classes[i] + "</a></li>";
    if (abil.races != null)
        for (let i = 0; i < abil.races.length; i++)
            newContent += "<li><a href='/races/?focus=" + abil.races[i].replace(/ /g, "_") + "'>" + abil.races[i] + "</a></li>";

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + a).addClass("listCurrent");
}

function reset(target) {
    var current = $(target);
    if (target.includes("down")) {
        $(current).removeClass("bi-caret-down-fill");
        $(current).addClass("bi-caret-down");
    }
    else {
        $(current).removeClass("bi-caret-up-fill");
        $(current).addClass("bi-caret-up");
    }
}

//sort-by-key from https://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects
function sort() {
    abilities.sort(function (a, b) {
        var x = a[1][sortType]; var y = b[1][sortType];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function search(query) {
    var not = false;
    abilities = [];
    if (query.match(/^NOT /)) {
        not = true;
        query = query.replace("NOT ", "");
    }
    for (var key in aData) {
        var matched = false;
        for (var key2 in aData[key]) {
            var attr= "";
            attr += aData[key][key2];
            if (attr.toLowerCase().includes(query.toLowerCase()))
                matched = true;
            if ("prerequisite".includes(query.toLowerCase()) && aData[key].prereq != null) //make sure prereqs can be searched for
                matched = true;
        }
        if ((matched && !not) || (!matched && not))
            abilities.push([key, aData[key]]);
    }

    updateList();
}

function updateSearch(query) {
    updateURL();
    if (query != "")
        window.history.replaceState(null, "", window.location.search + '&search=' + query);
}