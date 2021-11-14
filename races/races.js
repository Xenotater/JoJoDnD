$(document).ready(function () {
    var url = new URL(window.location.href);
    var r = url.searchParams.get("focus");

    if (r == null) {
        r = "Zombie";
        updateURL(r);
    }
    updateDisplay(r);

    $(".race-link").click(function () {
        var r = $(this).attr("id");
        updateURL(r);
        updateDisplay(r);
    })
})

function updateURL(r) {
    window.history.replaceState(null, "", '?focus=' + r);
}

function updateDisplay(r) {
    var name = r.replace(/\_/g, ' ');

    switch (r) {
        default:
            name = "Zombie";
            updateURL(name);
        case "Zombie":
            break; 
        case "Ghoul":
            break;
        case "Vampire":
            break;
        case "Pillar_Man":
            break;
        case "Enhanced_Pillar_Man":
            break;   
        case "Ultimate_Being":
            break;
        case "Abomination":
            break;
        case "Rock_Human":
            break;    
    }

    $(".listCurrent").removeClass("listCurrent");
    $("#" + name).addClass("listCurrent");
    display(name);
}

function display(name) {
    var newContent = "", img_src = name.replace(/\ /g, '_');

    newContent += "<h2 class='race-title'>" + name + "</h2><div class='race-img'><img class='img-fluid' src='Assets/" + img_src + ".png' alt='" + img_src + "'></div>";
    newContent += "<p class='race-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Euismod in pellentesque massa placerat duis ultricies lacus. Tellus at urna condimentum mattis pellentesque id nibh tortor id. Aliquam faucibus purus in massa tempor nec feugiat nisl. Sem nulla pharetra diam sit amet. Volutpat sed cras ornare arcu dui. Lectus nulla at volutpat diam ut venenatis tellus in. Sed blandit libero volutpat sed cras ornare arcu dui. Vitae congue eu consequat ac felis donec et odio. Non consectetur a erat nam at lectus urna duis. Non tellus orci ac auctor augue mauris augue neque gravida. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Habitant morbi tristique senectus et netus. Enim praesent elementum facilisis leo vel fringilla est ullamcorper. Scelerisque purus semper eget duis at tellus at urna. Nunc sed blandit libero volutpat. Tincidunt eget nullam non nisi est sit amet.<br>Bibendum enim facilisis gravida neque convallis a cras semper. Diam in arcu cursus euismod quis viverra nibh cras. Purus sit amet luctus venenatis lectus magna. Tristique et egestas quis ipsum. Malesuada fames ac turpis egestas integer eget. Viverra justo nec ultrices dui sapien eget mi proin. Nisl nisi scelerisque eu ultrices vitae auctor eu augue. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit. Aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus. Imperdiet proin fermentum leo vel orci porta non. Purus sit amet volutpat consequat. Quis imperdiet massa tincidunt nunc. Commodo odio aenean sed adipiscing. Metus aliquam eleifend mi in. Mattis pellentesque id nibh tortor id aliquet lectus. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Mauris in aliquam sem fringilla ut morbi. Turpis egestas maecenas pharetra convallis posuere morbi. Sed tempus urna et pharetra.";
    $("#display").html(newContent);
}