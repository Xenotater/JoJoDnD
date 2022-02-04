window.jsPDF = window.jspdf.jsPDF;

$(document).ready(function () {
    $("input").on("keyup", function() {
        var id = $(this).attr("id");
        if (!$(this).hasClass("skill-bonus") && !$(this).hasClass("stat-mod") && id != "bonus" && id != "atks" && id != "insp") {
            var val = $(this).width() / $(this).val().length, upper = 12, lower = 8;
            if ($(this).attr("type") == "text") {
                upper = 16;
                lower = 12;
            }

            if (val > upper)
                $(this).css("font-size", "24px");
            else if (val < upper && val > lower)
                $(this).css("font-size", "16px");
            else
                $(this).css("font-size", "12px");
        }

        if ($(this).hasClass("numbers")) {
            $(this).val($(this).val().replace(/[^0-9\-]/g, ""));
        }

        if ($(this).hasClass("stat-score")) {
            var stat = id.replace("-score", "");
            updateMod(stat);  
            updateSave(stat);
            updateSkills(stat);
        }

        if ($(this).hasClass("stand-score")) {
            updateStandMod(id.replace("-score", ""));
        }

        switch(id) {
            case "str-score":
                break;
            case "dex-score":
                updateInitiative();
                updateAC();
                break;
            case "con-score":
                updateAC();
                break;
            case "int-score":
                updateProfs();
                break;
            case "wis-score":
                updateInitiative();
                updateAC();
                updatePassive();
                break;
            case "cha-score":
                updateDC();
                break;
            case "pre-score":
                updateSAC();
                break;
            case "dur-score":
                updateSAC();
                break
            case "spd-score":
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
            default:
                break;
        }
    });

    $(".savecheck").change(function () {
        var stat = $(this).attr("id").replace("-save", "");
        updateSave(stat);
    });

    $(".skillcheck").change(function() {
        var skill = $(this).attr("id");
        var classes = $("#" + skill + "-bonus").attr('class').split(/\s+/);
        var stat = classes[2].replace("-skill", "");
        updateSkills(stat);
    });

    $("#dl-btn").click(function() {
        var name;
        if ($("#name").val().length > 0)
            name = $("#name").val().replace(/ /g, "_");
        else
            name = "JoJo_Character_Sheet"
        generatePDF(name);
    });
});

function updateMod(stat) {
    var score = $("#" + stat + "-score").val()
    var mod = Math.floor((score-10)/2);
    if (mod > 0)
        $("#" + stat + "-mod").val("+" + mod);
    else
        $("#" + stat + "-mod").val(mod);
}

function updateStandMod(stat) {
    var score = $("#" + stat + "-score").val()
    var mod = Math.floor((score/10));
    if (mod > 0)
        $("#" + stat + "-mod").val("+" + mod);
    else
        $("#" + stat + "-mod").val(mod);
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
}

function updateSAC() {
    var pre = parseInt($("#pre-mod").val()), dur = parseInt($("#dur-mod").val()), spd = parseInt($("#spd-mod").val());
    var sac = 10 + pre + dur + spd - Math.min(pre, dur, spd);
    if (isNaN(sac))
        sac = "";
    $("#sac").val(sac);
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
}

function updateAllSkills() {
    updateSkills("str");
    updateSkills("dex");
    updateSkills("int");
    updateSkills("wis");
    updateSkills("cha");
}

function updateSpeed() {
    var speed  = parseInt($("#spd-mod").val()) * 2;
    if (isNaN(speed))
        speed = "";
    $("#sspeed").val(speed);
}

function updateDC() {
    var dc = 8 + parseInt($("#bonus").val()) + parseInt($("#cha-mod").val());
    if (isNaN(dc))
        dc = "";
    $("#dc").val(dc);
}

function updatePassive() {
    var mod = parseInt($("#wis-mod").val());
    var bonus = parseInt($("#bonus").val());
    var val = ""

    if (!isNaN(mod) && !isNaN(bonus))
        val = 10 + mod + bonus;
    
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
    var score = Math.floor($("#spd-score").val() / 50) + 1;
    if (isNaN(score))
        score = 1;
    $("#atks").val(score);
}

function updateFeats() {
    var level = $("#level").val();
    console.log(level);
    if (!isNaN(level)) {
        var feats = "";
        if (level > 19)
            feats = 6;
        else if (level < 1)
            feats = 2;
        else
            feats = Math.floor((level-1)/5) + 2;
        console.log(feats);
        $("#featcnt").html(" (+" + feats + ")");
    }
    else
        $("#featcnt").html("");
}

//PDF generation assisted by https://www.freakyjolly.com/html2canvas-multipage-pdf-tutorial/
function generatePDF(name) {
    var pdf;
    domtoimage.toPng(document.querySelector("#page1"),{ filter:filter }).then(function (imgData) {
        pdf = new jsPDF('p', 'in', 'letter');
        pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

        setTimeout(function() {
            domtoimage.toPng(document.querySelector("#page2")).then(function (imgData) {
                pdf.addPage('letter');
                pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

                setTimeout(function() {
                    domtoimage.toPng(document.querySelector("#page3")).then(function (imgData) {
                        pdf.addPage('letter');
                        pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
                
                        setTimeout(function() {
                            pdf.save(name + ".pdf");
                            var dl = "<a id='hidden-dl' href='JoJo-Character-Sheet.pdf' download>";
                            $("body").append(dl);
                            $("#hidden-dl").click();
                            $("#hidden-dl").remove();
                        }, 0);
                    });
                }, 0);
            });
        }, 0);
    });
}

//filter to enable checkboxes & selects from https://github.com/tsayen/dom-to-image/issues/117#issuecomment-299462325
function filter(node) {
    if(node.nodeType===1) { 
        if(node.tagName==="INPUT" && (""+node.type).toLowerCase() === "checkbox"){ 
        if(node.checked){
            node.setAttribute('checked', true);
        }else{
            node.removeAttribute('checked');
        }
        }
        else if(node.tagName==="SELECT" && node.selectedIdx!=-1){
            var options = node.childNodes; // Assumption!
            var optionCount = 0;
            var selectedIdx = node.selectedIndex;
            for(var i=0; i<options.length; i++){
                var option = options[i]; // Maybe not an option
                if(option.tagName==="OPTION"){
                if(optionCount === selectedIdx)
                {
                    options[i].setAttribute('selected', true);
                }
                else
                {
                    options[i].removeAttribute('selected');
                }
                optionCount++;
                }
            }
        }
    }
    return true;
}