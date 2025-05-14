var r, rData;

$(document).ready(function() {
  var url = new URL(window.location.href);
  r = decodeURIComponent(url.searchParams.get("focus"));

  getData();

  $("#tabsColumn").on("click", ".rulesTab", function () {
    r = $(this).text();
    updateURL();
    updateDisplay();
  });
});

function updateURL() {
    window.history.replaceState(null, "", '?focus=' + encodeURIComponent(r));
}

function getData() {
  $.getJSON("rules.json", function(data) {
    rData = data;
    if (getRuleSection(r) == undefined)
      r = "Basics";
    fillTabs();
    updateDisplay();
  });

  $("#display").html("<div class='loading'></div>");
}

function getRuleSection(title) {
  return rData.tabs.find((ruleSection) => ruleSection.title == title);
}

function fillTabs() {
  let newContent = "";

  for (let ruleSection of rData.tabs)
    newContent += `<div id='${ruleSection.title.replace(/[^A-z]/g, "")}' class='rulesTab'><span>${ruleSection.title}</span></div>`;

  $("#tabsColumn").html(newContent);
  $(".currentTab").removeClass("currentTab");
  $("#" + r).addClass("currentTab");
}

function updateDisplay() {
  $("#display").html("");

  let ruleCategory = getRuleSection(r);
  let newContent = `<h2 class='display-title center'>${ruleCategory.title}</h2>`;
  for (section of ruleCategory.sections) {
    newContent += `<h3 class='display-heading'>${section.heading}</h3>`;
    if (section.description)
      newContent += `<div>${section.description}</div>`
    for (subsection of section.items) {
      newContent += `<h5>${subsection.subheading}</h5>`
      for (detail of subsection.details)
        newContent += `<div class='indent'>${detail}</div>`;
      if (subsection.compactDetails) {
        newContent += `<div>`;
        for (detail of subsection.compactDetails)
          newContent += detail + "<br>";
        newContent += "</div>";
      }
    }
  }

  $("#display").html(newContent);
  $(".currentTab").removeClass("currentTab");
  $("#" + r.replace(/[^A-z]/g, "")).addClass("currentTab");
}