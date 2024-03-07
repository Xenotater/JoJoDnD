var f, fData;

$(document).ready(function() {
  let url = new URL(window.location.href);
  f = url.searchParams.get("focus");

  if (f == null) {
    f = "Familiars";
    updateURL();
  }

  getData();

  $(".droppable").click(function() {
      if ($(this).hasClass("dropped"))
        hide($(this).attr("id"));
      else
        drop($(this).attr("id"));
  });

  $("body").on("click", ".list-link", function() {
    f = $(this).attr("id");
    updateURL();
    updateDisplay();
  });

  $("body").on("click", ".in-page", function() {
    f = $(this).attr("id").replace("-link", "");
    updateURL();
    doDrops();
    updateDisplay();
  });

  $(window).on('popstate', function() {
    let url = new URL(window.location.href);
    f = url.searchParams.get("focus");
    doDrops();
    updateDisplay();
  });
});

function updateURL() {
  window.history.pushState(null, "", '?focus=' + f);
}

function getData() {
  $.getJSON("familiars.json", function(data) {
      fData = data;
      if (fData[f] == null && fData["Familiars"].classes[f] == null && fData["Familiars"].features[f] == null && fData["Familiars"].feats[f] == null)
          f = "Familiars";
      populateList();
      doDrops();
      updateDisplay();
  });

  $("#display").html("<div class='loading'></div>");
}

function drop(id) {
  $("#" + id).find(".dropdown").removeClass("bi-caret-down-fill");
  $("#" + id).find(".dropdown").addClass("bi-caret-up-fill");
  if (id == "Classes")
    $("#class-list").css("display", "block");
  if (id == "Features")
    $("#feature-list").css("display", "block");
  if (id == "Feats")
    $("#feat-list").css("display", "block");
  $("#" + id).addClass("dropped");
}

function hide(id) {
  $("#" + id).find(".dropdown").removeClass("bi-caret-up-fill");
  $("#" + id).find(".dropdown").addClass("bi-caret-down-fill");
  if (id == "Classes")
    $("#class-list").css("display", "none");
  if (id == "Features")
    $("#feature-list").css("display", "none");
  if (id == "Feats")
    $("#feat-list").css("display", "none");
  $("#" + id).removeClass("dropped");
}

function populateList() {
  let classes = fData["Familiars"].classes;
  let features = fData["Familiars"].features;
  let feats = fData["Familiars"].feats;

  for (var key in classes)
    $("#class-list").append('<div class="tr list-link class" id="' + key + '"><div class="td">' + classes[key].name + '</div></div>');
  for (var key in features)
    $("#feature-list .simplebar-content").append('<div class="tr list-link feature" id="' + key + '"><div class="td">' + features[key].name + '</div></div>');
  for (var key in feats)
    $("#feat-list .simplebar-content").append('<div class="tr list-link feat" id="' + key + '"><div class="td">' + feats[key].name + '</div></div>');
}

function doDrops() {
  hide("Classes");
  hide("Features");
  hide("Feats");
  if ($("#" + f).hasClass("class"))
    drop("Classes");
  if ($("#" + f).hasClass("feature"))
    drop("Features");
  if ($("#" + f).hasClass("feat"))
    drop("Feats");
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

    if (l.features != null) {
      for (let j=0; j<l.features.length; j++) {
        if (l.features[j] == "OR")
          newContent += " OR ";
        else {
          newContent += "<a class='in-page' id='" + l.features[j].replace(/[ -]/g, "_") + "-link'>" + l.features[j] + "</a>";
          if ((j != l.features.length - 1 && l.features[j+1] != "OR") || l.other != null)
            newContent += " | "
        }
      }
    }

    if (l.other != null) {
      newContent += l.other;
    }

    text += "<td>" + l.dice + "dx</td>";
    text += "</td></tr>"
  }
  
  text += "</tbody></table>";

  return text;
}

function displayFeature(fam) {
  let text = "<h2 class='display-title'>" + fam.name + "</h2>";
  for (let i=0; i<fam.desc.length; i++)
    text += "<p>" + fam.desc[i] + "</p>";
  text += "<h4 class='display-heading'>Given To</h4><ul id='given'>";
  for (let i=0; i<fam.classes.length; i++)
    text += "<li><a class='in-page' id='" + fam.classes[i] + "-link'>The " + fam.classes[i] + "</a></li>";
  text += "</ul>";
  return text;
}

function displayFeat(fam) {
  let text = "<h2 class='display-title'>" + fam.name + "</h2>";
  for (let i=0; i<fam.desc.length; i++)
    text += "<p>" + fam.desc[i] + "</p>";
  return text;
}