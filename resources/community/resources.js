$(document).ready(function() {
  getData();
});

function getData() {
  $.getJSON("resources.json", function(data) {
    $(".loading").remove();
    updateResources(data.resources);
  });
  $("#cards").html("<div class='loading'></div>");
}

function updateResources(resources) {
  resources.forEach(r => {
    let newText = "<a target='_blank' href='" + r.link + "' class='card'>";
    newText += "<div class='title'>" + r.title;
    newText += "</div><div class='cardImg'><img src='" + r.img + "' alt = '" + r.alt + "'></img>";
    newText += "</div><div class='desc'>" + r.desc;
    newText += "</div></a>";
    $("#cards").append(newText);
  });
}

