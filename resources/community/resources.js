$(document).ready(function() {
  getData();

  $("body").click(function() {
    $(".versionSelector[style*='display: flex;']").css("display", "none"); //hide any showing version selectors
  });

  $("#cards").on("click", ".hasVersions", function(e) {
    const selector = this.children[0];
    if ($(selector).css("display") === "flex")
      $(selector).css("display", "none");
    else
      $(selector).css("display", "flex"); //show matching version selector
    e.stopPropagation();
  });

  $("#cards").on("click", ".versionSelector", function(e) {
    e.stopPropagation();
  });
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
    let newText = "";
    
    if (r.link)
      newText += "<a target='_blank' href='" + r.link + "' class='card'>";
    
    if (r.versions) {
      newText += "<div class='card hasVersions'>";
      newText += "<div class='versionSelector'>";
      for (let i=0; i<r.versions.length; i++)
        newText += "<a target='_blank' href='" + r.versions[i].link + "' class='version'>" + r.versions[i].name + "</a>";
      newText += "</div>";
    }
    
    newText += "<div class='title'>" + r.title;
    newText += "</div><div class='cardImg'><img src='" + r.img + "' alt = '" + r.alt + "'></img>";
    newText += "</div><div class='desc'>" + r.desc;
    newText += "</div></a>";

    $("#cards").append(newText);
  });
}

