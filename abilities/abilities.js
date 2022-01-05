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

    $(".simplebar-content").html("<tr id='temp'><td><div class='loading'></div></td></tr>");
    $("#display").html("<div class='loading'></div>");
}

function updateList() {
    $(".simplebar-content").html("");
    sort();
    if (reverse)
        abilities.reverse();
    for (let i = 0; i < abilities.length; i++) {
        var abil = aData[abilities[i][0]];
        var classes = abil.classes;
        var races = abil.races;

        var newContent = "<tr class='list-link' id='" + abil.name.replace(/[ -]/g, "_") + "'><td>" + abil.name + "</td><td>";
        for (let i = 0; i < abil.classes.length; i++) {
            newContent += abil.classes[i];
            if (i != abil.classes.length - 1)
                newContent += ", ";
            else
                newContent += "</td>";
        }
        newContent += "</tr>";

        $(".simplebar-content").append(newContent);
    }
    $("#" + a).addClass("listCurrent");
}

function updateDisplay() {
    var abil = aData[a];
    var newContent = "";

    newContent += "<h2 class='display-title'>" + abil.name + "</h2>";
    for (let i = 0; i < abil.desc.length; i++)
        newContent += "<p>" + abil.desc[i] + "</p>"
    newContent += "<h4 class='display-heading'>Given To</h4><ul id='given'>";
    newContent += parseTypes(abil.classes);
    newContent += "</ul>"

    $("#display").html(newContent);
    $(".listCurrent").removeClass("listCurrent");
    $("#" + a).addClass("listCurrent");
}

function parseTypes(classes) {
    var content = "";

    if (classes != null) {
        for (let i = 0; i < classes.length; i++) {
            var cls = "", page = "classes";
            switch (classes[i]) {
                case "Pwr":
                    cls = "Power-Type Stands";
                    break;
                case "Rng":
                    cls = "Ranged-Type Stands";
                    break;
                case "Rmt":
                    cls = "Remote-Type Stands";
                    break;
                case "Abl":
                    cls = "Ability-Type Stands";
                    break;
                case "Enh":
                    cls = "Enhancement-Type Stands";
                    break;
                case "Rev":
                    cls = "Revenge-Type Stands";
                    break;
                case "Ind":
                    cls = "Independent-Type Stands";
                    break;
                case "Hive":
                    cls = "Hive-Type Stands";
                    break;
                case "Act":
                    cls = "Act-Type Stands";
                    break;
                case "Stands":
                    cls = "All Stands";
                    break;
                case "Rip":
                    cls = "Ripple Users";
                    break;
                case "Spin":
                    cls = "Spin Users";
                    break;
                case "Zom":
                    cls = "Zombies";
                    page = "races";
                    break;
                case "Ghl":
                    cls = "Ghouls";
                    page = "races";
                    break;
                case "Vamp":
                    cls = "Vampires";
                    page = "races";
                    break;
                case "PM":
                    cls = "Pillar Men";
                    page = "races";
                    break;
                case "EPM":
                    cls = "Enhanced Pillar Men";
                    page = "races";
                    break;
                case "Ult":
                    cls = "Ultimate Beings";
                    page = "races";
                    break;
                case "Rck":
                    cls = "Rock Humans";
                    page = "races";
                    break;
                default:
                    cls = "Error";
                    page = "not_found";
                    break;
            }
            content += "<li><a href='/" + page + "/?focus=" + 
            cls.replace("-Type Stands", "").replace(" Users", "").replace("All ", "").replace(/s$/, "").replace(/Men$/, "Men").replace(/ /g, "") + "'>" + cls + "</a></li>";
        }
    }

    return content;
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

    if (query.match(/^NOT */)) {
        not = true;
        query = query.replace(/^NOT */, "");
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