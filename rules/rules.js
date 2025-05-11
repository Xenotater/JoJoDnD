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
    window.history.replaceState(null, "", '?focus=' + r);
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

  let rulesSection = getRuleSection(r);
  let newContent = `<h2 class='display-heading center'>${rulesSection.title}</h2>`;
  newContent += `<p>${JSON.stringify(rulesSection)}</p>`

  $("#display").html(newContent);
  $(".currentTab").removeClass("currentTab");
  $("#" + r.replace(/[^A-z]/g, "")).addClass("currentTab");
}