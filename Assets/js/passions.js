$(document).ready(function() {
    var url = new URL(window.location.href);
    var p = url.searchParams.get("focus");
    // var filterOpen = false;

    if (p != null) {
        updateDisplay(p);
    }

    $(".passion-link").click(function() {
        var p = $(this).html();
        window.history.replaceState(null, "", '?focus=' + p);
        updateDisplay(p);
    })

    $(".passion-list-link").click(function() {
        var p = $(this).attr("id");
        window.history.replaceState(null, "", '?focus=' + p);
        updateDisplay(p);
    })

    function updateDisplay(passion) {
        $("#display").html("<h1>Displaying " + passion + "</h1>")
    }

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