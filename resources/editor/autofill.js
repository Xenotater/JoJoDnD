var scores = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 };
var act = 1;
var charts = {};
var previousClass = "", previousActType = "";

$(document).ready(function () {
    if ($("#autofill").is(":checked")) {
        $(".stat-score").on("focus", function () {
            saveScore(this);
        });

        $("input").on("blur", function (e) {
            detectChange(this, e);
        });

        $("input").on("keyup", function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
                detectChange(this, e);
            }
        });

        $("select").on("change", function (e) {
            detectChange(this, e);
        });

        $(".savecheck").change(function () {
            let stat = $(this).attr("id").replace("-save", "");
            updateSave(stat);
        });

        $(".skillcheck").change(function () {
            updateAllSkills();
        });
    }

    $("#class").click(function() {
        previousClass = $(this).val();
    });

    $(".actType").click(function() {
        previousActType = $(this).val();
    })

    createChart("#sArrayChart", "stand");
    createChart("#act1ArrayChart", "act1");
    createChart("#act2ArrayChart", "act2");
    createChart("#act3ArrayChart", "act3");
    createChart("#act4ArrayChart", "act4");

    $(".bigBox, .lilBox").keyup(function() {
        if ($(this).hasClass("act1-score") || $(this).hasClass("act1-mod") || act === 1)
            updateChart("#act1ArrayChart", "act1");
        else if ($(this).hasClass("act2-score") || $(this).hasClass("act2-mod") || act === 3)
            updateChart("#act2ArrayChart", "act2");
        else if ($(this).hasClass("act3-score") || $(this).hasClass("act3-mod") || act === 2)
            updateChart("#act3ArrayChart", "act3");
        else if ($(this).hasClass("act4-score") || $(this).hasClass("act4-mod") || act === 4)
            updateChart("#act4ArrayChart", "act4");
        if ($(this).hasClass("stand-score") || $(this).hasClass("stand-mod"))
            updateChart("#sArrayChart", "stand")
    });

    
    $("#act-num").on("change", function() {
        if ($(this).val() > 4)
            $(this).val(4);
        if ($(this).val() < 0)
            $(this).val(0);
        if ($("#autofill").is(":checked")) {
            loadAct($(this).val());
            if (getChartData().every(item => item == 0))
                updateAllStandScores();
        }
    });
});

function detectChange(object, event) {
    //console.log(event);
    let id = $(object).attr("id");

    if ($(object).hasClass("scales")) {
        scale(object);
    }

    if (!$("#autofill").is(":checked"))
        return;

    if ($(object).hasClass("numbers")) {
        $(object).val($(object).val().replace(/[^0-9\-]/g, ""));
    }

    if ($(object).hasClass("stat-score")) {
        let stat = id.replace("-score", "");
        updateMod(stat);
        updateSave(stat);
        updateSkills(stat);
        saveScore(object);
    }

    if ($(object).hasClass("stat-mod")) {
        let stat = id.replace("-mod", "");
        updateSave(stat);
        updateSkills(stat);
        fixMod(object);
    }

    if ($(object).hasClass("stand-score")) {
        let stat = id.replace("S", "").replace("-score", "");
        updateStandMod(stat);
        if ($("#class").val() === "act"){
            $(`#act${act}-${stat}-score`).val($(object).val())
            updateActMod(`act${act}`, stat);
            updateChart(`#act${act}ArrayChart`, `act${act}`);
        }
    }

    if ($(object).hasClass("stand-mod")) {
        let stat = id.replace("S", "").replace("-mod", "");
        fixMod(object);
        if ($("#class").val() === "act")
            $(`#act${act}-${stat}-mod`).val($(object).val())
    }

    if (id == "name" || id == "Uname" || id == "Fname") {
        updateName(id);
    }

    if (id == "statflip") {
        return;
    }

    if (id == "class") {
        recalculateMultipliers();
    }

    if (id.match(/act\dType/)) {
        recalculateActMultipliers(id.replace("Type", "").replace("act", ""));
    }

    if (id === "act4Base") {
        recalculateAct4();
    }

    if (id.match(/act\dType/)) {
        let target = id.replace("Type", "");
        if (Array.from($(`.${target}-score`)).every(item => $(item).val() == ""))
            updateActAllScores(target.replace("act", ""));
    }

    if (object.classList.toString().match(/.*act\d-score.*/)) {
        data = id.replace("-score", "").split("-");
        updateActMod(data[0], data[1])
    }

    switch (id.replace("-score", "").replace("-mod", "")) {
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

function fixMod(object) {
    let val = $(object).val();
    if (val > 0)
        $(object).val("+" + val);
}

function saveScore(object) {
    let score = $(object).val();
    if (score == "")
        score = 0;
    scores[$(object).attr("id").replace("-score", "")] = parseInt(score);
}

function updateMod(stat) {
    let score = parseInt($("#" + stat + "-score").val());
    if (!isNaN(score)) {
        let mod = Math.floor((score - 10) / 2);
        if (mod > 0)
            $("#" + stat + "-mod").val("+" + mod);
        else
            $("#" + stat + "-mod").val(mod);
        updateStandScore(stat, score - scores[stat]);
    }
}

function updateStandScore(stat, diff) {
    let cls = $("#class").val();
    let multipliers = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 };

    switch (cls) {
        case "pow":
            multipliers = { "str": 4, "dex": 3, "con": 3, "int": 1, "wis": 4, "cha": 2 };
            break;
        case "rng":
            multipliers = { "str": 3, "dex": 3, "con": 3, "int": 10, "wis": 3, "cha": 3 };
            break;
        case "rmt":
            multipliers = { "str": 3, "dex": 2, "con": 4, "int": 5, "wis": 3, "cha": 2 };
            break;
        case "abl":
            multipliers = { "str": 1, "dex": 3, "con": 1, "int": 4, "wis": 3, "cha": 5 };
            break;
        case "enh":
            multipliers = { "str": 3, "dex": 3, "con": 5, "int": 5, "wis": 3, "cha": 3 };
            break;
        case "rev":
            multipliers = { "str": 4, "dex": 3, "con": 4, "int": 5, "wis": 3, "cha": 3 };
            break;
        case "ind":
            multipliers = { "str": 3, "dex": 3, "con": 4, "int": 0, "wis": 3, "cha": 3 };
            break;
        case "hive":
            multipliers = { "str": 3, "dex": 2, "con": 3, "int": 8, "wis": 3, "cha": 3 };
            break;
        case "act":
            break;
        default:
            break;
    }

    if (cls != "oth") {
        target = $("#S" + stat + "-score");
        let val = parseInt(target.val());
        if (isNaN(val))
            val = 0;
        target.val(val + diff * multipliers[stat]);
        updateStandMod(stat);
    }
    updateDC();
    updateSpeed();
    updateSAC();
    updateAtks();
    updateChart("#sArrayChart", "stand");
    
    if (cls === "act")
        updateAllActScore(stat, diff);
}

function updateAllActScore(stat, diff) {
    for (let i=1; i<5; i++) {
        updateActScore(i, stat, diff);
    }
    loadAct(act);
}

function updateActScore(num, stat, diff) {
    let multipliers = getActMultipliers(num);
    target = $(`#act${num}-${stat}-score`);
    let val = parseInt(target.val());
    if (isNaN(val))
        val = 0;
    target.val(val + diff * multipliers[stat]);
    if (target.val() == 0)
        target.val("");
    updateActMod(`act${num}`, stat);
    updateChart(`#act${num}ArrayChart`, `act${num}`);
}

function getActMultipliers(num) {
    let multipliers = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 };
    let type =$(`#act${num}Type`).val();

    switch (type) {
        case "close":
            multipliers = { "str": 3, "dex": 3, "con": 3, "int": 1, "wis": 4, "cha": 2 };
            break;
        case "long":
            multipliers = { "str": 3, "dex": 3, "con": 3, "int": 8, "wis": 3, "cha": 3 };
            break;
        case "ability":
            multipliers = { "str": 1, "dex": 2, "con": 1, "int": 3, "wis": 3, "cha": 5 };
            break;
        case "remote":
            multipliers = { "str": 3, "dex": 2, "con": 3, "int": 4, "wis": 3, "cha": 2 };
            break;
        default:
            break;
    }

    if (parseInt(num) === 4) {
        for (let key of Object.keys(multipliers))
            multipliers[key] *= 2;
    }

    return multipliers;
}

function updateStandMod(stat) {
    let score = $("#S" + stat + "-score").val();
    if (score != "") {
        let mod = Math.floor((score / 10));
        if (mod > 0)
            $("#S" + stat + "-mod").val("+" + mod);
        else
            $("#S" + stat + "-mod").val(mod);
    }
}

function updateInitiative() {
    let mod = parseInt($("#dex-mod").val()) + parseInt($("#wis-mod").val());
    if (isNaN(mod))
        mod = "";
    if (mod > 0)
        $("#init").val("+" + mod)
    else
        $("#init").val(mod);
}

function updateBonus() {
    let bonus = Math.floor(($("#level").val() - 1) / 4) + 2;
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
    let dex = parseInt($("#dex-mod").val()), con = parseInt($("#con-mod").val()), wis = parseInt($("#wis-mod").val());
    let ac = 10 + dex + con + wis - Math.min(dex, con, wis);
    if (isNaN(ac))
        ac = "";
    $("#ac").val(ac);
    updateHAC();
}

function updateSAC() {
    let pre = parseInt($("#Sdex-mod").val()), dur = parseInt($("#Scon-mod").val()), spd = parseInt($("#Swis-mod").val());
    let sac = 10 + pre + dur + spd;
    if (isNaN(sac))
        sac = "";
    $("#sac").val(sac);
}

function updateHAC() {
    let hac = parseInt($("#ac").val()) + parseInt($("#bonus").val());
    if (isNaN(hac))
        hac = "";
    $("#hac").val(hac);
}

function updateSave(stat) {
    let mod = parseInt($("#" + stat + "-mod").val());
    let bonus = parseInt($("#bonus").val());
    let val = "";

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
    $("." + stat + "-skill").each(function () {
        let skill = $(this).attr("id").replace(/-bonus[0-2]?/, "");
        let mod = parseInt($("#" + stat + "-mod").val());
        let bonus = parseInt($("#bonus").val());
        let val = "";

        if (!isNaN(mod) && !isNaN(bonus)) {
            val = mod;
            let select = $("#" + skill).find(":selected").text();
            if (select == translateText("P"))
                val += bonus;
            else if (select == translateText("E"))
                val += bonus * 2;
            else if (select == translateText("M"))
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
    updateSkills("con");
    updateSkills("int");
    updateSkills("wis");
    updateSkills("cha");
}

function updateSpeed() {
    let speed = parseInt($("#Swis-mod").val()) * 2;
    if (isNaN(speed))
        speed = "";
    if (speed < 10)
        speed = 10;
    $("#sspeed").val(speed);
}

function updateDC() {
    let dc = 8 + parseInt($("#bonus").val()) + parseInt($("#cha-mod").val());
    if (isNaN(dc))
        dc = "";
    $("#dc").val(dc);
}

function updatePassive() {
    let val = 10 + parseInt($("#perc-bonus").val());
    if (isNaN(val))
        val = "";
    $("#percep").val(val);
}

function updateProfs() {
    let mod = parseInt($("#int-mod").val());
    let bonus = parseInt($("#bonus").val());
    let total = 3 + mod + bonus;
    if (isNaN(total) || total < 1)
        $("#skillcnt").html("");
    else
        $("#skillcnt").html(" (+" + total + ")");
}

function updateAtks() {
    let score = Math.floor($("#Swis-score").val() / 50) + 1;
    if (isNaN(score))
        score = 1;
    $("#atks").val(score);
}

function updateFeats() {
    let level = $("#level").val();
    if (!isNaN(level)) {
        let feats = "";
        if (level > 20)
            feats = 6;
        else if (level < 1)
            feats = 2;
        else
            feats = Math.ceil(level / 4) + 1;
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

function loadAct(newAct) {
    act = newAct;
    $("#Sstr-score").val($(`#act${act}-str-score`).val());
    $("#Sdex-score").val($(`#act${act}-dex-score`).val());
    $("#Scon-score").val($(`#act${act}-con-score`).val());
    $("#Sint-score").val($(`#act${act}-int-score`).val());
    $("#Swis-score").val($(`#act${act}-wis-score`).val());
    $("#Scha-score").val($(`#act${act}-cha-score`).val());
    
    $("#Sstr-mod").val($(`#act${act}-str-mod`).val());
    $("#Sdex-mod").val($(`#act${act}-dex-mod`).val());
    $("#Scon-mod").val($(`#act${act}-con-mod`).val());
    $("#Sint-mod").val($(`#act${act}-int-mod`).val());
    $("#Swis-mod").val($(`#act${act}-wis-mod`).val());
    $("#Scha-mod").val($(`#act${act}-cha-mod`).val());
    
    updateChart("#sArrayChart", "stand");
}

function updateAllStandScores(mult = 1) {
    updateStandScore("str", scores.str * mult);
    updateStandScore("dex", scores.dex * mult);
    updateStandScore("con", scores.con * mult);
    updateStandScore("int", scores.int * mult);
    updateStandScore("wis", scores.wis * mult);
    updateStandScore("cha", scores.cha * mult);
}

function updateAllStandMods() {
    updateStandMod("str");
    updateStandMod("dex");
    updateStandMod("con");
    updateStandMod("int");
    updateStandMod("wis");
    updateStandMod("cha");
}

function saveScores() {
    saveScore($("#str-score"));
    saveScore($("#dex-score"));
    saveScore($("#con-score"));
    saveScore($("#int-score"));
    saveScore($("#wis-score"));
    saveScore($("#cha-score"));
}

function createChart(target, targetChart) {
    charts[targetChart] = new Chart($(target)[0], {
        type: 'radar',
        data: {
            labels: ['Power', 'Speed', 'Range', 'Durability', 'Precision', 'Potential'],
            datasets: [{
                data: [0,0,0,0,0,0],
                fill: true,
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                borderColor: 'rgba(255, 0, 0, 0.7)',
                pointBackgroundColor: 'rgba(255, 0, 0, 0.7)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 0, 0, 0.7)',
                pointRadius: 4
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    suggestedMax: 120,
                    ticks: {
                        beginAtZero: true,
                        stepSize: 20,
                        font: {
                            size: target.includes("act") ? 5 : 8
                        }
                    }
                }
            },
            plugins: {
                legend: {
                  display: false,
                }
            }
        }
    });
    updateChart(target, targetChart);
}

function updateChart(target, targetChart) {
    $(target).show();
    let data = target.includes("act") ? getActChartData(target.replace("ArrayChart", "")) : getChartData();
    let set = new Set(data);
    if (set.size == 1 && set.has(0)) {
        $(target).hide();
    }
    else {
        charts[targetChart].data.datasets[0].data = data;
        charts[targetChart].update();
    }
}

function getChartData() {
    let data = [];
    data.push(getIntVal($("#Sstr-score")));
    data.push(getIntVal($("#Swis-score")));
    data.push(getIntVal($("#Sint-score")));
    data.push(getIntVal($("#Scon-score")));
    data.push(getIntVal($("#Sdex-score")));
    data.push(getIntVal($("#Scha-score")));
    return data;
}

function getActChartData(num) {
    let data = [];
    data.push(getIntVal($(`${num}-str-score`)));
    data.push(getIntVal($(`${num}-wis-score`)));
    data.push(getIntVal($(`${num}-int-score`)));
    data.push(getIntVal($(`${num}-con-score`)));
    data.push(getIntVal($(`${num}-dex-score`)));
    data.push(getIntVal($(`${num}-cha-score`)));
    return data;
}

function getIntVal(elem) {
    let val = parseInt(elem.val());
    return isNaN(val) ? 0 : val;
}

function updateActMod(act, stat) {
    let target = $(`#${act}-${stat}-mod`);
    let score = getIntVal($(`#${act}-${stat}-score`));

    if (score == 0)
        target.val("");
    else
        target.val(Math.floor(score / 10));
    fixMod(target);
}

function updateActAllScores(num, mult = 1) {
    updateActScore(num, "str", scores.str * mult);
    updateActScore(num, "dex", scores.dex * mult);
    updateActScore(num, "con", scores.con * mult);
    updateActScore(num, "int", scores.int * mult);
    updateActScore(num, "wis", scores.wis * mult);
    updateActScore(num, "cha", scores.cha * mult);
}

function updateActAllMods(num) {
    updateActMod(`act${num}`, "str");
    updateActMod(`act${num}`, "dex");
    updateActMod(`act${num}`, "con");
    updateActMod(`act${num}`, "int");
    updateActMod(`act${num}`, "wis");
    updateActMod(`act${num}`, "cha");
}

function recalculateAct4() {  
    let base = $("#act4Base").val();
    $("#act4-str-score").val(parseInt($(`#${base}-str-score`).val()) * 2);
    $("#act4-dex-score").val(parseInt($(`#${base}-dex-score`).val()) * 2);
    $("#act4-con-score").val(parseInt($(`#${base}-con-score`).val()) * 2);
    $("#act4-int-score").val(parseInt($(`#${base}-int-score`).val()) * 2);
    $("#act4-wis-score").val(parseInt($(`#${base}-wis-score`).val()) * 2);
    $("#act4-cha-score").val(parseInt($(`#${base}-cha-score`).val()) * 2);
    updateActAllMods(4);
    updateChart("#act4ArrayChart", "act4");
}

function recalculateMultipliers() {
    let newClass = $("#class").val();
    if (newClass === "act")
        return;
    $("#class").val(previousClass);
    updateAllStandScores(-1);
    $("#class").val(newClass);
    updateAllStandScores();
}

function recalculateActMultipliers(num) {
    let newType = $(`#act${num}Type`).val();
    $(`#act${num}Type`).val(previousActType);
    updateActAllScores(num, -1);
    $(`#act${num}Type`).val(newType);
    updateActAllScores(num);
    recalculateAct4();
}