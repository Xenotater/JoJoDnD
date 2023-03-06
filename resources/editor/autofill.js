var scores = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};

$(document).ready(function () {
  if ($("#autofill").is(":checked")) {
    $(".stat-score").on("focus", function() {
          saveScore(this);
    });

    $(".stat-score").on("keyup", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
                saveScore(this);
        }
    });

    $("input").on("blur", function() {
        detectChange(this);
    });

    $("input").on("keyup", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
            detectChange(this);
        }
    });

    $(".savecheck").change(function() {
            var stat = $(this).attr("id").replace("-save", "");
            updateSave(stat);
    });

    $(".skillcheck").change(function() {
            var skill = $(this).attr("id");
            var classes = $("#" + skill + "-bonus").attr('class').split(/\s+/);
            var stat = classes[2].replace("-skill", "");
            updateSkills(stat);
    });
  }
});

function detectChange(object) {
  var id = $(object).attr("id");
  if ($(object).hasClass("scales")) {
      scale(object);
  }

  if ($(object).hasClass("numbers")) {
      $(object).val($(object).val().replace(/[^0-9\-]/g, ""));
  }

  if ($(object).hasClass("stat-score")) {
      var stat = id.replace("-score", "");
      updateMod(stat);  
      updateSave(stat);
      updateSkills(stat);
  }

  if ($(object).hasClass("stat-mod")) {
      var stat = id.replace("-mod", "");
      updateSave(stat);
      updateSkills(stat);
  }

  if ($(object).hasClass("stand-score")) {
      updateStandMod(id.replace("-score", ""));
  }

  if (id == "name" || id == "Uname" || id == "Fname") {
      updateName(id);
  }

  if (id == "statflip") {
    return;
  }

  switch(id.replace("-score", "").replace("-mod", "")) {
      case "str":
          break;
      case "dex":
          updateInitiative();
          updateAC();
          break;
      case "con":
          updateAC();
          break;
      case "int":
          updateProfs();
          break;
      case "wis":
          updateInitiative();
          updateAC();
          break;
      case "cha":
          updateDC();
          break;
      case "Sdex":
          updateSAC();
          break;
      case "Scon":
          updateSAC();
          break
      case "Swis":
          updateSpeed();
          updateSAC();
          updateAtks();
          break;
      case "bonus":
          updateAllSkills();
          updateDC();
          break;
      case "level":
          updateBonus();
          updateFeats();
          break;
      case "ac":
          updateHAC();
          break;
      default:
          break;
  }
}

function saveScore(object) {
    var score = $(object).val();
    if (score == "")
        score = 0;
    scores[$(object).attr("id").replace("-score", "")] = parseInt(score);
}

function updateMod(stat) {
    var score = parseInt($("#" + stat + "-score").val());
    if (!isNaN(score)) {
        var mod = Math.floor((score-10)/2);
        if (mod > 0)
            $("#" + stat + "-mod").val("+" + mod);
        else
            $("#" + stat + "-mod").val(mod);
        updateStandScore(stat, score-scores[stat]);
    }
}

function updateStandScore(stat, diff) {
    var cls = $("#class").val();
    var multipliers = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};

    switch(cls) {
        case "pow":
            multipliers = {"str":4,"dex":3,"con":3,"int":1,"wis":4,"cha":2};
            break;
        case "rng":
            multipliers = {"str":3,"dex":3,"con":3,"int":6,"wis":3,"cha":3};
            break;
        case "rem":
            multipliers = {"str":3,"dex":2,"con":4,"int":5,"wis":3,"cha":2};
            break;
        case "abl":
            multipliers = {"str":1,"dex":3,"con":1,"int":4,"wis":3,"cha":5};
            break;
        case "enh":
            multipliers = {"str":3,"dex":3,"con":5,"int":5,"wis":3,"cha":3};
            break;
        case "rev":
            multipliers = {"str":3,"dex":4,"con":4,"int":7,"wis":3,"cha":2};
            break;
        case "ind":
            multipliers = {"str":3,"dex":3,"con":4,"int":0,"wis":3,"cha":3};
            break;
        case "hive":
            multipliers = {"str":3,"dex":2,"con":3,"int":10,"wis":3,"cha":2};
            break;
        //can't do act since each act has differnt mults/stats
        default:
            break;
    }

    if (cls != "oth" && cls != "Act") {
        diff *= multipliers[stat];
        target = $("#S" + stat + "-score");
        var val = parseInt(target.val());
        if (isNaN(val))
            val = 0;
        target.val(val + diff);
        updateStandMod("S" + stat);
    }
    updateDC();
    updateSpeed();
    updateSAC();
    updateAtks();
}

function updateStandMod(stat) {
    var score = $("#" + stat + "-score").val();
    if (score != "") {
        var mod = Math.floor((score/10));
        if (mod > 0)
            $("#" + stat + "-mod").val("+" + mod);
        else
            $("#" + stat + "-mod").val(mod);
    }
}

function updateInitiative() {
    var mod = parseInt($("#dex-mod").val()) + parseInt($("#wis-mod").val());
    if (isNaN(mod))
        mod = "";
    if (mod > 0)
        $("#init").val("+" + mod)
    else
        $("#init").val(mod);
}

function updateBonus() {
    var bonus = Math.floor(($("#level").val()-1)/4) + 2;
    if (bonus > 6)
        bonus = 6;
    if (bonus < 2)
        bonus = 2;
    $("#bonus").val(bonus);
    updateDC();
    updateAllSaves();
    updateAllSkills();
    updatePassive();
}

function updateAC() {
    var dex = parseInt($("#dex-mod").val()), con = parseInt($("#con-mod").val()), wis = parseInt($("#wis-mod").val());
    var ac = 10 + dex + con + wis - Math.min(dex, con, wis);
    if (isNaN(ac))
        ac = "";
    $("#ac").val(ac);
    updateHAC();
}

function updateSAC() {
    var pre = parseInt($("#Sdex-mod").val()), dur = parseInt($("#Scon-mod").val()), spd = parseInt($("#Swis-mod").val());
    var sac = 10 + pre + dur + spd - Math.min(pre, dur, spd);
    if (isNaN(sac))
        sac = "";
    $("#sac").val(sac);
}

function updateHAC() {
    var hac = parseInt($("#ac").val()) + 5;
    if (isNaN(hac))
        hac = "";
    $("#hac").val(hac);
}

function updateSave(stat) {
    var mod = parseInt($("#" + stat + "-mod").val());
    var bonus = parseInt($("#bonus").val());
    var val = "";

    if (!isNaN(mod) && !isNaN(bonus)) {
        val = mod;
        if ($("#" + stat + "-save").is(":checked"))
            val += bonus;
    }

    $("#" + stat + "-bonus").val(val);
}

function updateAllSaves() {
    updateSave("str");
    updateSave("dex");
    updateSave("con");
    updateSave("int");
    updateSave("wis");
    updateSave("cha");
}

function updateSkills(stat) {
    $("." + stat + "-skill").each(function() {
        var skill = $(this).attr("id").replace("-bonus", "");
        var mod = parseInt($("#" + stat + "-mod").val());
        var bonus = parseInt($("#bonus").val());
        var val = "";

        if (!isNaN(mod) && !isNaN(bonus)) {
            val = mod;
            var select = $("#" + skill).find(":selected").text();
            if (select == "P")
                val += bonus;
            else if (select == "E")
                val += bonus * 2;
            else if (select == "M")
                val += bonus * 3;
        }

        $(this).val(val);
    });

    if (stat == "wis")
        updatePassive();
}

function updateAllSkills() {
    updateSkills("str");
    updateSkills("dex");
    updateSkills("int");
    updateSkills("wis");
    updateSkills("cha");
}

function updateSpeed() {
    var speed  = parseInt($("#Swis-mod").val()) * 2;
    if (isNaN(speed))
        speed = "";
    if (speed < 10)
        speed = 10;
    $("#sspeed").val(speed);
}

function updateDC() {
    var dc = 8 + parseInt($("#bonus").val()) + parseInt($("#cha-mod").val());
    if (isNaN(dc))
        dc = "";
    $("#dc").val(dc);
}

function updatePassive() {
    var val = 10 + parseInt($("#perc-bonus").val());
    if (isNaN(val))
        val = "";
    $("#percep").val(val);
}

function updateProfs() {
    var mod = parseInt($("#int-mod").val());
    if (isNaN(mod))
        mod = 1;
    if (mod < 1)
        mod = 1;
    if ($("#int-score").val() != "")
        $("#skillcnt").html(" (+" + mod + ")");
    else
        $("#skillcnt").html("");
}

function updateAtks() {
    var score = Math.floor($("#Swis-score").val() / 50) + 1;
    if (isNaN(score))
        score = 1;
    $("#atks").val(score);
}

function updateFeats() {
    var level = $("#level").val();
    if (!isNaN(level)) {
        var feats = "";
        if (level > 19)
            feats = 6;
        else if (level < 1)
            feats = 2;
        else
            feats = Math.floor((level-1)/5) + 2;
        $("#featcnt").html(" (+" + feats + ")");
    }
    else
        $("#featcnt").html("");
}

function updateName(id) {
    if (id == "name") {
        $("#Uname").val($("#name").val());
        $("#Fname").val($("#name").val());
    }
    else if (id == "Uname") {
        $("#name").val($("#Uname").val());
        $("#Fname").val($("#Uname").val());
    }
    else {
        $("#Uname").val($("#Fname").val());
        $("#name").val($("#Fname").val());
    }
}