var wData, weapons, sortType = "name", reverse = false;

$(document).ready(function() {
    getData();

    $("#weapon-list").on("mouseenter", ".attr", function(e) {
        hintText = hint($(this).html());
        popUp(hintText, e.pageX, e.pageY)
    });
    $("#weapon-list").on("mouseleave", ".attr", function() {
        $("#popUp").remove();
    });
    $("#weapon-list").on("scroll", function() {
        $("#popUp").remove();
    });

    $("#weapon-list").on("click", ".sorter", function() {
        var btn = $(this);
        var id = btn.attr("id");

        if (id.includes("Down")) {
            if (btn.hasClass("bi-caret-down")) {
                var current = $(".bi-caret-down-fill");
                current.removeClass("bi-caret-down-fill");
                current.addClass("bi-caret-down");
                current = $(".bi-caret-up-fill");
                current.removeClass("bi-caret-up-fill");
                current.addClass("bi-caret-up");

                btn.removeClass("bi-caret-down");
                btn.addClass("bi-caret-down-fill");
                sortType = id.replace("Down", "");
                reverse = false;
            }
        }
        else {
            if (btn.hasClass("bi-caret-up")) {
                var current = $(".bi-caret-down-fill");
                current.removeClass("bi-caret-down-fill");
                current.addClass("bi-caret-down");
                current = $(".bi-caret-up-fill");
                current.removeClass("bi-caret-up-fill");
                current.addClass("bi-caret-up");
                
                btn.removeClass("bi-caret-up");
                btn.addClass("bi-caret-up-fill");
                sortType = id.replace("Up", "");
                reverse = true;
            }
        }
        
        updateTable();
    });

    $("#search").on("input", function () {
        search($(this).val());
    });
});

function getData() {
    $.getJSON("weapons.json", function(data) {
        wData = data.weapons;
        weapons = wData;
        sort("name");
        createTable();
        $("#nameDown").removeClass("bi-caret-down");
        $("#nameDown").addClass("bi-caret-down-fill");
    });

    $("#weapon-list").html("<div class='loading'></div>");
}

function createTable() {
    var newText = "<table class='table table-striped'><thead><tr>";
    newText += "<th><div class='label'>Name</div><div class='sortBtns'><i id='nameUp' class='bi bi-caret-up sorter'></i><br><i id='nameDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "<th><div class='label'>Attributes</div><div class='sortBtns'><i id='attrUp' class='bi bi-caret-up sorter'></i><br><i id='attrDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "<th><div class='label'>Type</div><div class='sortBtns'><i id='typeUp' class='bi bi-caret-up sorter'></i><br><i id='typeDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "<th><div class='label'>Stat</div><div class='sortBtns'><i id='statUp' class='bi bi-caret-up sorter'></i><br><i id='statDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "<th><div class='label'>Prerequisite</div><div class='sortBtns'><i id='prereqUp' class='bi bi-caret-up sorter'></i><br><i id='prereqDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "<th><div class='label'>Effect</div><div class='sortBtns'><i id='effectUp' class='bi bi-caret-up sorter'></i><br><i id='effectDown' class='bi bi-caret-down sorter'></i></div></th>";
    newText += "</tr></thead><tbody></tbody></table>";

    $("#weapon-list").html(newText);
    updateTable();
}

function updateTable() {
    var newText = "";

    sort();
    if (reverse)
        weapons.reverse();
    
    for (let i = 0; i < weapons.length; i++) {
        w = weapons[i];
        newText += "<tr><td>" + w.name + "</td><td>";
        for (let j = 0; j < w.attr.length; j++) {
            newText += "<span class='attr'>" + w.attr[j] + "</span>"
            if (j < w.attr.length - 1)
                newText += ", "
        }
        newText += "</td><td>" + w.type + "</td><td>" + w.stat + "</td><td>" + w.prereq + "</td><td>" + w.effect + "</td></tr>";
    }
    newText += "</tbody></table>";

    $("#weapon-list tbody").html(newText);
}

function hint(attr) {
    if (attr.includes("Reach")) {
        var reach = attr.charAt(7);
        attr = "Reach";
    }
    if (attr.includes("Thrown") || attr.includes("Ranged")) {
        var dist = attr.substring(attr.indexOf('(') + 1, attr.indexOf(')')).split('/');
        attr = attr.substring(0, attr.indexOf(' '));
    }

    switch(attr) {
        case "Melee":
            return("This weapon has a range of 1m from the person/stand wielding it.");
        case "Reach":
            return("This weapon has a range of " + reach + "m from the person/stand wielding it.")
        case "One-Handed":
            return("This weapon can be wielded with one hand. When making an attack using a One-Handed weapon with another in your other hand, you may make an additional Attack with the other weapon as a Bonus Action. May be hostered or concealed easily.");
        case "Two-Handed":
            return("This weapon requires two hands to wield. Using this weapon to make an Attack with only 1 hand inflicts Disadvantage. Difficult to holster or conceal.")
        case "Thrown":
            return("This weapon can be used as both a ranged and a melee weapon. It can be thrown up to " + dist[0] + "m, or as far as " + dist[1] + "m with Disadvantage. Once thrown, this weapon must be picked up in order to be used again.");
        default:
            return("Error: This attribute doesn't have a definition. Please alert the site administrator.");     
    }
}

function popUp(text, posX, posY) {
    $("#popUp").remove(); //just in case
    $("body").append("<div class='content' id='popUp'><p>" + text + "</p></div>");
    $("#popUp").css("left", posX + 25);

    //ensure popUp doesn't go past navbar
    if (posY - $("#popUp").outerHeight() > $("nav").position().top + 88)
        posY -= $("#popUp").outerHeight();
    else
        posY -= .5 * $("#popUp").outerHeight();

    $("#popUp").css("top", posY - 25);
}

//sort-by-key from https://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects
function sort() {
    weapons.sort(function (a, b) {
        var x = a[sortType]; var y = b[sortType];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function search(query) {
    weapons = [];
    for (let i = 0; i < wData.length; i++) {
        var matched = false;
        for (var key in wData[i]) {
            var attr= "";
            attr += wData[i][key];
            if (attr.toLowerCase().includes(query.toLowerCase()))
                matched = true;
        }
        if (matched)
            weapons.push(wData[i]);
    }

    updateTable();
}