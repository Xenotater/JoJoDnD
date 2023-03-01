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
  $(".listCurrent").removeClass("listCurrent");
  $("#" + f).addClass("listCurrent");
}

function displayClass(fam) {
  let text = "<h2 class='display-title'>" + fam.name + "</h2>";
  text += "<div class='display-img'><img src='" + fam.img + "' alt='" + f + "'></div>"
  text += "<h4 class='display-heading'>Description</h4><p>" + fam.desc + "</p>";
  text += "<p><b>Primary Stat:</b> " + fam.prime + "</p>";
  text += "<p><b>Proficiencies:</b> Choose " + fam.profNum + " of the following: " + fam.profs + ". Additionally, choose " + fam.adProfs +" other Proficiencies.</p>";
  text += "<p><b>Saving Throws:</b> " + fam.name + " Familiars are Proficient in " + fam.prime + " Saving Throws, and one other Saving Throw of your choice.</p>";
  text += "<p><b>Effect DC:</b> 8 + Proficiency Bonus + " + fam.prime + " Modifier";

  text += "<h4 class='display-heading'>Leveling Up</h4>";
  text += "<table class='table table-striped levels'><thead><tr><th>Level</th><th>Pro. Bonus</th><th>Feats</th><th>Features</th><th>Ability Dice</th></tr></thead><tbody>";
  
  for (let i=1; i<=20; i++) {
    l = fam.levels[i];
    text += "<tr><td>" + i + "</td><td>+" + l.pro + "</td><td>" + l.feats + "</td><td>";

    if (l.other != null) {
      text += l.other;
      if (l.features != null)
        text += ", ";
    }

    if (l.features != null) {
      for (let j=0; j<l.features.length; j++) {
        if (l.features[j] == "OR")
          text += " OR ";
        else
          text += "<a href='./?focus=" + l.features[j].replace(/[ -]/g, "_") + "'>" + l.features[j] + "</a>";
      }
    }

    text += "<td>" + l.dice + "dx</td>";
    text += "</td></tr>"
  }
  
  text += "</tbody></table>";

  return text;
}