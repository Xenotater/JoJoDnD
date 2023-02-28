var f, fData;

$(document).ready(function() {
  let url = new URL(window.location.href);
  f = url.searchParams.get("focus");

  if (f == null) {
    f = "Familiars";
    updateURL();
  }

  if ($("#" + f).hasClass("class"))
    drop("Classes");
  if ($("#" + f).hasClass("feature"))
    drop("Features");
  if ($("#" + f).hasClass("feat"))
    drop("Feat");

  getData();

  $(".droppable").click(function() {
      if ($(this).hasClass("dropped"))
        hide($(this).attr("id"));
      else
        drop($(this).attr("id"));
  });

  $(".list-link").click(function() {
    f = $(this).attr("id");
    updateURL();
    updateDisplay();
  });
});

function updateURL() {
  window.history.replaceState(null, "", '?focus=' + f);
}

function getData() {
  $.getJSON("familiars.json", function(data) {
      fData = data;
      if (fData[f] == null && fData["Familiars"].classes[f] == null && fData["Familiars"].features[f] == null && fData["Familiars"].feats[f] == null)
          f = "Familiars";
      updateDisplay();
  });

  $("#display").html("<div class='loading'></div>");
}

function drop(id) {
  $("#" + id).find(".dropdown").removeClass("bi-caret-down-fill");
  $("#" + id).find(".dropdown").addClass("bi-caret-up-fill");
  if (id == "Classes")
    $(".class").show();
  if (id == "Features")
    $(".feature").show();
  if (id == "Feats")
    $(".feat").show();
  $("#" + id).addClass("dropped");
}

function hide(id) {
  $("#" + id).find(".dropdown").removeClass("bi-caret-up-fill");
  $("#" + id).find(".dropdown").addClass("bi-caret-down-fill");
  if (id == "Classes")
    $(".class").hide();
  if (id == "Features")
    $(".feature").hide();
  if (id == "Feats")
    $(".feat").hide();
  $("#" + id).removeClass("dropped");
}

function updateDisplay() {
  let fam = fData[f];
  let newContent = ""

  if ($("#" + f).hasClass("class")) {
    fam = fData["Familiars"].classes[f];
    newContent = displayClass(fam);
  }  
  else if ($("#" + f).hasClass("feature")) {
    fam = fData["Familiars"].features[f];
    newContent = displayFeature(fam);
  }  
  else if ($("#" + f).hasClass("feat")) {
    fam = fData["Familiars"].feats[f];
    newContent = displayFeat(fam);
  }
  else {
    newContent = "<h2 class='display-title'>" + fam.name + "</h2>";
    newContent += "<div class='display-img'><img src='" + fam.img + "' alt='" + f + "'></div>";
    newContent += "<h4 class='display-heading'>Description</h4><p>" + fam.desc + "</p>";

    for (let i=0; i<fam.content.length; i++) {
      newContent += "<h4 class='display-heading'>" + fam.content[i].name + "</h4>";
      for (let j=0; j<fam.content[i].content.length; j++)
        newContent += fam.content[i].content[j];
    }
  }

  $("#display").html(newContent);
}

function displayClass(fam) {
  let text = "<h2 class='display-title'>" + fam.name + "</h2>";
  return text;
}