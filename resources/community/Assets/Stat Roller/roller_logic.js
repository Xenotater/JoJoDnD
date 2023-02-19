$(document).ready(function() {
  let method = "Manual";
  let prevStats = {"pow":NaN,"pre":NaN,"dur":NaN,"rng":NaN,"spd":NaN,"se":NaN};

  $("#dl-btn").click(function() {
    download();
  });

  $(".method-select").click(function() {
    method = $(this).val();
    if (method === "Manual") {
      $(".statbox").prop("disabled", false);
      $("#roll-stats").prop("disabled", true);
    }
    else {
      $(".statbox").prop("disabled", true);
      $("#roll-stats").prop("disabled", false);
    }
  });

  $("#roll-stats").click(function() {
    rollStats(method);
  });

  $("#rand-type").click(function() {
    $("#" + rollType())[0].click();
  });

  $("#get-sstats").click(function() {
    pullStats();
  });

  $("#min").change(function() {
    let lvl = $(this).val();
    $("#max").prop("min", lvl);
    if (lvl > $("#max").val())
      $("#max").val(lvl);
  });

  $("#roll-points").click(function() {
    let min = $("#min").val();
    let max = $("#max").val();
    $("#points").val(rollPoints(min, max));
  });

  $("#avg-points").click(function() {
    let min = $("#min").val();
    let max = $("#max").val();
    $("#points").val(avgPoints(min, max));
  });

  $("#copy-points").click(function() {
    $("#rpoints").val($("#points").val());
  });

  $("#copy-sstats").click(function() {
    pullSStats(prevStats);
  });

  $(".newsstatbox").change(function() {
    calcRPoints($(this), prevStats);
  });

  $("#distribute").click(function() {
    distributePoints(prevStats);
  });

  $("#reset-sstats").click(function() {
    resetSStats(prevStats);
  });
});

function download() {
  if (window.location.host === "www.jojodnd.com") {
    $("#file")[0].click();
  }
  else
    alert("You're already using the offline version!");
}

function rollStats(method) {
  let stats = [0,0,0,0,0,0];
  switch (method) {
    case "3d6":
      for (let i=0; i<6; i++) {
        stats[i] = roll(3,6);
      }
      break;
    case "4d6":
      for (let i=0; i<6; i++) {
        let rolls = [0,0,0,0];
        for (let j=0; j<4; j++) {
          rolls[j] = roll(1,6);
          stats[i] += rolls[j];
        }
        stats[i] -= Math.min(...rolls);
      }
      break;
    case "Standard Array":
      let standard = [8,10,12,13,14,15]
      for (let i=0; i<6; i++) {
        let index = randInt(standard.length);
        stats[i] = standard.splice(index, 1)[0];
      }
      break;
    case "Point Buy":
      stats = [8,8,8,8,8,8]
      let points = 27;
        while (points > 0) {
          let index = randInt(6);
          if (stats[index] < 15) {
            let newPoints = -1;
            let increase = 0;
            let maxIncrease = 15 - stats[index];

            while (newPoints < 0) {
              newPoints = points;
              increase = randInt(maxIncrease) + 1;

              if (stats[index] + increase < 14)
                newPoints -= increase;
              else if (stats[index] + increase == 14)
                newPoints -= 7;
              else
                newPoints -= 9;

              if (newPoints < 0)
                maxIncrease--;
              if (maxIncrease == 0) {
                increase = 0;
                newPoints = points;
                break;
              }
            }
            stats[index] += increase;
            points = newPoints;
          }
        }
      break;
    default:
      break;
  }
  setStats(stats);
}

function roll(num, die) {
  let val = 0;
  for (let i=0; i<num; i++)
    val += randInt(die) + 1;
  return val;
}

function randInt(max) {
  return Math.floor(Math.random() * max)
}

function setStats(stats) {
  $(".statbox").each(function(i) {$(this).val(stats[i])});
}

function rollType() {
  let rolled = roll(1,100);
  if (rolled < 36)
    return "pow";
  else if (rolled < 50)
    return "rgd";
  else if (rolled < 70)
    return "enh";
  else if (rolled < 80)
    return "rem";
  else if (rolled < 90)
    return "abl";
  else if (rolled < 94)
    return "ind";
  else if (rolled < 98)
    return "hive";
  else if (rolled < 100)
    return "rev";
  else
    return "act";
}

function getStats() {
  let Stats = [0,0,0,0,0,0];
  for (let i=0; i<6; i++)
    Stats[i] = parseInt($(".statbox").eq(i).val());
  return Stats;
}

function pullStats() {
  let stats = getStats();
  let mults = getMults($(".type:checked").val());
  for (let i=0; i<6; i++)
    $(".sstatbox").eq(i).val(stats[i] * mults[i]);
}

function getMults(type) {
  switch(type) {
    case "Power":
      return [4,3,3,1,4,2];
    case "Ranged":
      return [3,3,3,6,3,3];
    case "Remote":
      return [3,2,4,5,3,2];
    case "Ability":
      return [1,3,1,4,3,5];
    case "Enhancement":
      return [3,3,5,5,3,3];
    case "Revenge":
      return [3,4,4,7,3,2];
    case "Independent":
      return [3,3,4,0,3,3];
    case "Hive":
      return [3,2,3,10,3,2];
    //can't do act since each act has differnt mults/stats
    default:
      return [0,0,0,0,0,0];
  }
}

function rollPoints(lvl, max) {
  let points = 0;
  let dice = 2;
  if ($(".type:checked").val() === "Revenge")
    dice = 3;

  while (lvl++ < max)
    points += roll(dice, 4) + lvl;
  
  return points;
}

function avgPoints(lvl, max) {
  let points = 0;
  let avg = 5; //avg of 2d4
  if ($(".type:checked").val() === "Revenge")
    avg = 8; //avg of 3d4 rounded up

  while (lvl++ < max)
    points += avg + lvl;

  return points;
}

function getSStats() {
  let SStats = [0,0,0,0,0,0];
  for (let i=0; i<6; i++)
    SStats[i] = parseInt($(".sstatbox").eq(i).val());
  return SStats;
}

function getNewSStats() {
  let SStats = [0,0,0,0,0,0];
  for (let i=0; i<6; i++)
    SStats[i] = parseInt($(".newsstatbox").eq(i).val());
  return SStats;
}

function pullSStats(prev) {
  let current = getNewSStats();
  let currentVal = 0;
  let original = getSStats();
  let oringalVal = 0;

  for (let i=0; i<6; i++) {
    if (isNaN(current[i]))
      current[i] = original[i];
    currentVal += current[i];
    oringalVal += original[i];
    $(".newsstatbox").eq(i).val(original[i]);
  }

  if ($("#rpoints").val() != "")
    $("#rpoints").val(parseInt($("#rpoints").val()) + (currentVal - oringalVal));

  setPrevStats(prev);
}

function setPrevStats(prev) {
  prev["pow"] = parseInt($("#new-pow").val());
  prev["pre"] = parseInt($("#new-pre").val());
  prev["dur"] = parseInt($("#new-dur").val());
  prev["rng"] = parseInt($("#new-rng").val());
  prev["spd"] = parseInt($("#new-spd").val());
  prev["se"] = parseInt($("#new-se").val());
}

function calcRPoints(changed, prev) {
  let stat = changed.attr("id").replace("new-", "");
  if (!isNaN(prev[stat])) {
    $("#rpoints").val(parseInt($("#rpoints").val()) - (parseInt(changed.val()) - prev[stat]));
  }
  prev[stat] = changed.val();
}

function distributePoints(prev) {
  if ($("#rpoints") != "") {
    let points = parseInt($("#rpoints").val());
    while (points > 0) {
      switch(randInt(6)) {
        case 0:
          $("#new-pow").val(parseInt($("#new-pow").val()) + 1);
          points--;
          break;
        case 1:
          $("#new-pre").val(parseInt($("#new-pre").val()) + 1);
          points--;
          break;
        case 2:
          $("#new-dur").val(parseInt($("#new-dur").val()) + 1);
          points--;
          break;
        case 3:
          $("#new-rng").val(parseInt($("#new-rng").val()) + 1);
          points--;
          break;
        case 4:
          $("#new-spd").val(parseInt($("#new-spd").val()) + 1);
          points--;
          break;
        case 5:
          $("#new-se").val(parseInt($("#new-se").val()) + 1);
          points--;
          break;
      }
    }
    setPrevStats(prev);
    $("#rpoints").val(0);
  }
}

function resetSStats(prev) {
  let points = 0;
  let stats = getNewSStats();
  prev = {"pow":NaN,"pre":NaN,"dur":NaN,"rng":NaN,"spd":NaN,"se":NaN};
  for (let i=0; i<6; i++) {
    if (isNaN(stats[i]))
      stats[i] = 0;
    points += stats[i];
    $(".newsstatbox").eq(i).val(0);
  }
  let rpoints = parseInt($("#rpoints").val());
  if (isNaN(rpoints))
    rpoints = 0;
  $("#rpoints").val(rpoints + points)
}