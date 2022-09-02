window.jsPDF = window.jspdf.jsPDF;
var pages = [true,true,true];
var scores = {"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0};
var loggedIn = false;
var charID = -1;

$(document).ready(function () {
    checkLoggedIn();

    $(".pageSelect").change(function() {
        var num = parseInt($(this).val().replace("p", ""));

        if (pages[num-1]) {
            $("#page"+num).hide();
            pages[num-1] = false;
        }
        else {
            $("#page"+num).show();
            pages[num-1] = true;
        }

        if (pages[0] && (pages[1] || pages[2]))
            $("#div1").show();
        else
            $("#div1").hide();
        if (pages[1] && pages[2])
            $("#div2").show();
        else
            $("#div2").hide();
    })

    $("input").on("blur", function() {
        detectChange(this);
    });

    $("input").on("keyup", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
            detectChange(this);
        }
    });

    $(".stat-score").on("focus"), function() {
        if ($("#autofill").is(":checked")) {
            saveScore(this);
        }
    }

    $(".stat-score").on("keyup", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
            if ($("#autofill").is(":checked")) {
                saveScore(this);
            }
        }
    });

    $(".savecheck").change(function() {
        if ($("#autofill").is(":checked")) {
            var stat = $(this).attr("id").replace("-save", "");
            updateSave(stat);
        }
    });

    $(".skillcheck").change(function() {
        if ($("#autofill").is(":checked")) {
            var skill = $(this).attr("id");
            var classes = $("#" + skill + "-bonus").attr('class').split(/\s+/);
            var stat = classes[2].replace("-skill", "");
            updateSkills(stat);
        }
    });

    $("#image").hover(imgOn, imgOff);

    $("#upload").click(function() {
        $("#img-input").click();
        imgOff();
        imgOn();
    });

    $("#edit").click(function() {
        $("#img-input").click();
        imgOff();
        imgOn();
    });

    $("#reset").click(function() {
        $("#char-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=");
        $("#char-img").css("display", "none");
        $("#image").css("background-color", "white");
        imgOff();
        imgOn();
    });

    //img upload render assisted by https://medium.com/@iamcodefoxx/how-to-upload-and-preview-an-image-with-javascript-749b92711b91
    $("#img-input").change(function () {
        var reader = new FileReader();
        reader.addEventListener("load", () => {
            var upload = reader.result;
            $("#char-img").attr("src", upload);
            $("#char-img").css("display", "unset");
            $("#image").css("background-color", "black");
        });
        reader.readAsDataURL(this.files[0]);
    });

    $("#dl-btn").click(function() {
        var name;
        if ($("#name").val().length > 0)
            name = $("#name").val().replace(/ /g, "_");
        else
            name = "JoJo_Character_Sheet"
        generatePDF(name);
    });

    $("#import-btn").click(function() {
        $("#import").click();
    });

    $("#import").change(function () {
        var reader = new FileReader();
        reader.addEventListener("load", () => {
            var data = JSON.parse(reader.result);
            importData(data);
        });
        reader.readAsText(this.files[0]);
    });

    $("#export-btn").click(function() {
        exportData("export");
    });

    $("#load").click(function() {
        popLoad();
    });

    $("body").on("click", "#closeLoad", function() {
        $("#popLoad").remove();
    });

    $("body").on("click", "#closeSignIn", function() {
        $("#popSignIn").remove();
    });

    $("body").on("click", "#login", function () {
        if (loggedIn) {
            logOut();
        }
        else
            popLogIn();
    });

    $("body").on("click", "#toSignUp", function () {
        $("#popSignIn").remove();
        popSignUp();
    });
    
    $("body").on("click", "#toSignIn", function () {
        $("#popSignIn").remove();
        popLogIn();
    });

    $("#signUp").on("click", "", function () {
        alert("This Feature Isn't Ready Yet.");
        //signUp();
    });

    $("body").on("click", "#signIn", function () {
        alert("This Feature Isn't Ready Yet.");
        //logIn();
    });

    $("body").on("click", "#save", function () {
        if (!loggedIn)
            popLogIn();
        else {
            saveChar();
        }
    });

    $("body").on("click", ".charCard", function() {
        var id = $(this).attr("id").replace("char", "");
        loadCharacter(id);
    });
});

function checkLoggedIn() {
    $.post("login.php", {action: "check"}, function(data) {
        loggedIn = data;
    });
}

function popLoad() {
    var newText = "<div id='popLoad' class='center'>";
    newText += "<div class='content center' id='load-window'>";
    newText += "<div id='charHead'><i id='login' class='bi bi-door-"
    if (loggedIn)
        newText += "closed";
    else
        newText += "open";
    newText += "'></i>";
    newText += "<input type='search' id='search' placeholder='Search'>";
    newText += "<i id='closeLoad' class='bi bi-x-lg'></i></div>";
    //newText += "<div class='divider'></div>";
    newText += "<div data-simplebar id='simple'><div id='characters'></div></div>";
    newText += "</div></div>"
    $("body").append(newText);
    updateCharacters();
}

function updateCharacters() {
    $("#characters").empty();
    $.post("characters.php", {action: "chars"}, function(data) {
        $("#characters").append(data);
    });
}

function logOut() {
    $.post("logout.php", function(data) {
        loggedIn = false;
        $("#popLoad").remove();
        popLoad();
    });
}

function popLogIn() {
    var newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<div id='form'><h2>Sign In</h2>";
    newText += "<form id='login-form'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<input type='submit' value='Login' id='signIn'>"
    newText += "<br><a id='toSignUp'>Create Account</a>";
    newText += "</form></div></div></div>";
    $("body").append(newText);
}

function popSignUp() {
    var newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<div id='form'><h2>Sign Up</h2>";
    newText += "<form id='signUp-form'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<label for='conf'>Confirm Password:</label><br><input type='password' id='conf' name='conf' required><br>";
    newText += "<input type='submit' value='Submit' id='signUp'>"
    newText += "<br><a id='toSignIn'>Back</a>";
    newText += "</form></div></div></div>";
    $("body").append(newText);
}

function logIn() {
    var user = $("#user").val(), pass = $("#pass").val();
    if (user != "" && pass != "")
        $.post("login.php", {action: "login", user: user, pass: pass}, function(data) {
            if(data == "<h5 id='login-success'>Login Successful.</h5>")
                loggedIn = true;
            $("#login-failure").remove();
            $("#signIn-window").append(data);
            $("#popSignIn").remove();
            $("#login").removeClass("bi-door-open");
            $("#login").addClass("bi-door-closed");
            updateCharacters();
        });
}

function signUp() {
    var user = $("#user").val(), pass = $("#pass").val(), conf = $("#conf").val();
    if (user != "" && pass != "")
        $.post("signup.php", {action: "signup", user: user, pass: pass, conf: conf}, function(data) {
            if(data == "<h5 id='login-success'>Account successfully created.</h5>") {
                $("#popSignIn").remove();
                popLogIn();
            }
            $("#login-failure").remove();
            $("#signIn-window").append(data);
        });
}

function detectChange(object) {
    if ($("#autofill").is(":checked")) {
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
    var pre = parseInt($("#pre-mod").val()), dur = parseInt($("#dur-mod").val()), spd = parseInt($("#spd-mod").val());
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
    var score = Math.floor($("#spd-score").val() / 50) + 1;
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

function imgOn() {
    if ($("#char-img").attr("src") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
        $("#upload").css("display", "unset");
    else {
        $("#edit").css("display", "unset");
        $("#reset").css("display", "unset");
    }
    $("#blur").css("display", "unset");
}

function imgOff() {
    $(".img-icon").css("display", "none");
    $("#blur").css("display", "none");
}

//PDF generation assisted by https://www.freakyjolly.com/html2canvas-multipage-pdf-tutorial/
function generatePDF(name) {
    var pdf;
    var p1 = $("#p1").is(":checked"), p2 = $("#p2").is(":checked"), p3 = $("#p3").is(":checked");
    domtoimage.toPng(document.querySelector("#page1"),{ filter:filter }).then(function (imgData) {
        pdf = new jsPDF('p', 'in', 'letter');
        if (p1)
            pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

        setTimeout(function() {
            domtoimage.toPng(document.querySelector("#page2")).then(function (imgData) {
                if (p1 && p2)
                    pdf.addPage('letter');
                if (p2)
                    pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

                setTimeout(function() {
                    domtoimage.toPng(document.querySelector("#page3")).then(function (imgData) {
                        if ((p1 || p2) && p3)
                            pdf.addPage('letter');
                        if (p3)
                            pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
                
                        setTimeout(function() {
                            pdf.save(name + ".pdf");
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

function exportData(mode) {
    var data = {};
    data["form"] = JSON.stringify($("#pages").serializeArray());
    data["img"] = $("#char-img").attr("src");
    var file = new Blob([JSON.stringify(data)], {type: "text/plain"});

    var name;
    if ($("#name").val().length > 0)
        name = $("#name").val().replace(/ /g, "_").toLowerCase();
    else
        name = "character"

    if (mode == "export")
        saveAs(file, name + "_data.json");
    else if (mode == "save")
        return [name, data["form"], data["img"]];
}

//thanks to kflorence for creating a deserialize plugin https://stackoverflow.com/a/8918929
function importData(data) {
    $("#pages").deserialize(JSON.parse(data["form"]));
    $("#char-img").attr("src", data["img"]);
    if ($("#char-img").attr("src") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=") {
        $("#char-img").css("display", "none");
        $("#image").css("background-color", "white");
    }
    else {
        $("#char-img").css("display", "unset");
        $("#image").css("background-color", "black");
    }
    $(".scales").each(function() {
        scale(this);
    });
}

function scale(object) {
    var val = $(object).width() / $(object).val().length, upper = 12, lower = 8;
    if ($(object).attr("type") == "text") {
        upper = 16;
        lower = 12;
    }

    if (val > upper)
        $(object).css("font-size", "24px");
    else if (val < upper && val > lower)
        $(object).css("font-size", "16px");
    else
        $(object).css("font-size", "12px");
}

function respond(text) {
    $("#response").remove();
    $("body").append("<div id='response'>" + text + "</div>");
    if ($("#response-text").html().indexOf("!") != -1) {
        $("#response").addClass("success");
    }
    else
        $("#response").addClass("failure");
    setTimeout(function() {
        $("#response").fadeOut(500, function() {
            $("#response").remove();
        });
    }, 3000);
}

function saveChar() {
    var result = exportData("save");
    $.post("save.php", {action: "save", name: result[0], form: result[1], img: result[2]}, function(data) {
        respond(data);
        updateCharacters();
    });
}

function loadCharacter(id) {
    $.post("load.php", {action: "load", id: id}, function(data) {
        if (data) {
            file = {};
            file["form"] = data.split("-------")[1];
            file["img"] = data.split("-------")[0];
            importData(file);
            $("#popLoad").remove();
            respond("<h5 id='response-text'>Your character was loaded!</h5>");
        }
        else
            respond("<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>");
    });
}