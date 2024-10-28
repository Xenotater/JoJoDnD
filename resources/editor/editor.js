window.jsPDF = window.jspdf.jsPDF;

$(document).ready(function () {
    applyLangSpecificStyles();

    $(".pageSelect").change(function() {
        let num = parseInt($(this).val().replace("p", ""));
        if ($("#class").val() !== "act" && num === 3)
            num += 1;
        togglePage(num);
        fixDivs();
    })

    $("#class").change(function() {
        if ($(this).val() == "multi") {
            $(this).css("display", "none");
            $("#multi").css("display", "inline-block");
            $("#multi").focus();
        }
        toggleAct($(this).val() == "act");
    });

    $("#multi").on("keyup", function(e) { //numerous ways to get back to the dropdown
        if ((e.key === "Backspace" || e.keyCode === 8 || e.key === "Enter" || e.keyCode === 13) && $(this).val() == "") {
            $(this).css("display", "none");
            $("#class").css("display", "inline-block");
            $("#class").val("oth");
        }
        else if (e.key === "Escape" || e.keyCode === 27) {
            $(this).val("");
            $(this).css("display", "none");
            $("#class").css("display", "inline-block");
            $("#class").val("oth");
        }
    });

    $("#multi").blur(function() { //numerous ways to get back to the dropdown
        if ($(this).val() == "") {
            $(this).css("display", "none");
            $("#class").css("display", "inline-block");
            $("#class").val("oth");
        }
    });

    $("#image").hover(() => {imgOn(true)}, () => {imgOff(true)});

    $("#upload, #edit").click(function() {
        $("#img-input").click();
        imgOff(true);
        imgOn(true);
    });

    $("#reset").click(function() {
        resetImg(true);
        imgOff(true);
        imgOn(true);
    });

    $("#sImage").hover(() => {imgOn(false)}, () => {imgOff(false)});

    $("#upload2, #edit2").click(function() {
        $("#img-input2").click();
    });

    $("#reset2").click(function() {
        resetImg(false);
        imgOff(false);
        imgOn(false);
    });

    //img upload render assisted by https://medium.com/@iamcodefoxx/how-to-upload-and-preview-an-image-with-javascript-749b92711b91
    $("#img-input").change(function() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let upload = reader.result;
            $("#char-img").attr("src", upload);
            $("#char-img").css("display", "unset");
            $("#image").css("background-color", "black");
            imgOff(true);
            imgOn(true);
        });
        reader.readAsDataURL(this.files[0]);
    });
    
    $("#img-input2").change(function() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let upload = reader.result;
            $("#stand-img").attr("src", upload);
            $("#stand-img").css("display", "unset");
            $("#sImage").css("background-color", "black");
            imgOff(false);
            imgOn(false);
        });
        reader.readAsDataURL(this.files[0]);
    });

    $("#dl-btn").click(function() {
        let name;
        if ($("#name").val().length > 0)
            name = $("#name").val().replace(/ /g, "_");
        else
            name = "JoJo_Character_Sheet"
        generatePDF(name);
    });

    $("#import-btn").click(function() {
        $("#import").click();
    });

    $("#import").change(function() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let data = JSON.parse(reader.result);
            importData(data);
        });
        reader.readAsText(this.files[0]);
    });

    $("#export-btn").click(function() {
        exportData("export");
    });

    $("#statflip").click(function() {
        flipStats(false);
    });
});

function applyLangSpecificStyles() {
    try {
        switch(getLanguage()) {
            case "uk":
                $("#act-num").css("left", "105px");
            case "en":
            default:
                return;
        }
    }
    catch {
        setTimeout(applyLangSpecificStyles, 3000); //maybe not a good idea but like... just wait a few seconds for nav.js to load?
    }
}

function pageOn(num) {
    return $(".pageSelect")[num-1].checked;
}

function anyPageOn(start, end) {
    for (let i=start; i<=end; i++) {
        if (pageOn(i))
            return true;
    }
    return false;
}

function imgOn(isMain) {
    let imgId = "#char-img", idAdd = "";
    if (!isMain) {
        imgId = "#stand-img";
        idAdd = "2";
    }

    if ($(imgId).attr("src") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
        $("#upload" + idAdd).css("display", "unset");
    else {
        $("#edit" + idAdd).css("display", "unset");
        $("#reset" + idAdd).css("display", "unset");
    }
    $("#blur" + idAdd).css("display", "unset");
}

function imgOff(isMain) {
    let idAdd = "";
    if (!isMain) {
        idAdd = "2";
    }

    $(".img-icon" + idAdd).css("display", "none");
    $("#blur" + idAdd).css("display", "none");
}

function resetImg(isMain) {
    let imgId = "#char-img", idAdd = "i";
    if (!isMain) {
        imgId = "#stand-img";
        idAdd = "sI";
    }

    $(imgId).attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=");
    $(imgId).css("display", "none");
    $("#" + idAdd + "mage").css("background-color", "white");
}

//PDF generation assisted by https://www.freakyjolly.com/html2canvas-multipage-pdf-tutorial/
async function generatePDF (name) {
    let pdf = new jsPDF('p', 'in', 'letter');
    let totalPages = $(".pageSelect").length;
    let firstPageFilled = false;

    for (let p=0; p<totalPages; p++) {
        if (pageOn(p+1)) {
            if (p === 2 && $("#class").val() !== 'act')
                p = 3;
            if (firstPageFilled)
                pdf.addPage('letter');
            let img = await domtoimage.toPng($(".page")[p],{ filter:filter });
            pdf.addImage(img, 'PNG', 0, 0, 8.5, 11);
            firstPageFilled = true;
        }
    }

    if (firstPageFilled)
        pdf.save(name + '.pdf');
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
            let options = node.childNodes; // Assumption!
            let optionCount = 0;
            let selectedIdx = node.selectedIndex;
            for(let i=0; i<options.length; i++){
                let option = options[i]; // Maybe not an option
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
    let data = {};
    data["form"] = JSON.stringify($("#pages").serializeArray());
    data["img"] = $("#char-img").attr("src");
    data["img2"] = $("#stand-img").attr("src");
    let file = new Blob([JSON.stringify(data)], {type: "text/plain"});

    let name;
    if ($("#name").val().length > 0)
        name = $("#name").val().replace(/ /g, "_").toLowerCase();
    else
        name = "character"

    if (mode == "export")
        saveAs(file, name + "_data.json");
    else if (mode == "save")
        return [name, data["form"], data["img"], data["img2"]];
}

//thanks to kflorence for creating a deserialize plugin https://stackoverflow.com/a/8918929
function importData(data) {
    let previousClass = $("#class").val(); //need to know if the last class was act for page displays

    $("#multi").val(""); //ensure older data w/o this field still load properly
    $("#pages")[0].reset();
    $("#pages").deserialize(JSON.parse(data["form"]));
    
    if (data["acts"]) {
        let actScores = JSON.parse(data["acts"]);
        for (let act=0; act<4; act++) {
            $(`#act${act+1}-str-score`).val(actScores[act][0]);
            $(`#act${act+1}-dex-score`).val(actScores[act][1]);
            $(`#act${act+1}-con-score`).val(actScores[act][2]);
            $(`#act${act+1}-int-score`).val(actScores[act][3]);
            $(`#act${act+1}-wis-score`).val(actScores[act][4]);
            $(`#act${act+1}-cha-score`).val(actScores[act][5]);
            updateActAllMods(act+1);
        }
    }
    saveScores();
    
    if ($("#autofill").is(":checked"))
        updateAllSkills(); //ensure new fields get filled out
    updateProfs(); //this should always display

    $("#char-img").attr("src", data["img"]);
    if ($("#char-img").attr("src") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=") {
        $("#char-img").css("display", "none");
        $("#image").css("background-color", "white");
    }
    else {
        $("#char-img").css("display", "unset");
        $("#image").css("background-color", "black");
    }

    if (data["img2"] == "") //ensure older data w/o this field still load properly
        data["img2"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

    $("#stand-img").attr("src", data["img2"]);
    if ($("#stand-img").attr("src") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=") {
        $("#stand-img").css("display", "none");
        $("#sImage").css("background-color", "white");
    }
    else {
        $("#stand-img").css("display", "unset");
        $("#sImage").css("background-color", "black");
    }

    $(".scales").each(function() {
        scale(this);
    });

    if ($("#multi").val() != "") {
        $("#class").css("display", "none");
        $("#multi").css("display", "inline-block");
    }
    else {
        $("#multi").css("display", "none");
        $("#class").css("display", "inline-block");
    }

    if ($("#class").val() === "act") {
        toggleAct(true);
        loadAct(1);
    }
    else if (previousClass === "act") {
        toggleAct(false);
    }

    checkMeta();
    updateChart("#sArrayChart", "stand");
    updateChart("#act1ArrayChart", "act1");
    updateChart("#act2ArrayChart", "act2");
    updateChart("#act3ArrayChart", "act3");
    updateChart("#act4ArrayChart", "act4");
    showAllPages();
}

function scale(object) {
    let val = $(object).width() / $(object).val().length, upper = 12, lower = 8;
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

function shouldScale(object) {
    const disallowedIds = ["desc"];
    const disallowedClasses = ["skillstat", "skilllbl"];
    const disallowedParentIds = ["stats"];

    if (disallowedIds.includes(object?.id) || disallowedParentIds.includes(object.parentElement?.id))
        return false;

    let isAllowed = true;
    object.classList.forEach(cls => {if (disallowedClasses.includes(cls)) isAllowed = false;});
    return isAllowed;
}

function flipStats(initial) {
    let mod = [0,0,0,0,0,0];
    let score = [0,0,0,0,0,0];
    let targets = ["stat", "stand", "act1", "act2", "act3", "act4"];

    for (let t=0; t<targets.length; t++) {
        $(`.${targets[t]}-mod`).each(function(i) {
            $(this).attr("id", $(this).attr("id").replace("mod", "temp"));
            $(this).attr("name", $(this).attr("id").replace("mod", "temp"));
            $(this).removeClass(`${targets[t]}-mod`);
            $(this).addClass(`${targets[t]}-temp`);
            mod[i] = $(this).val();
        });
        $(`.${targets[t]}-score`).each(function(i) {
            $(this).attr("id", $(this).attr("id").replace("score", "mod"));
            $(this).attr("name", $(this).attr("id").replace("score", "mod"));
            $(this).removeClass(`${targets[t]}-score`);
            $(this).addClass(`${targets[t]}-mod`);
            score[i] = $(this).val();
            $(this).val(mod[i]);
        });
        $(`.${targets[t]}-temp`).each(function(i) {
            $(this).attr("id", $(this).attr("id").replace("temp", "score"));
            $(this).attr("name", $(this).attr("id").replace("temp", "score"));
            $(this).removeClass(`${targets[t]}-temp`);
            $(this).addClass(`${targets[t]}-score`);
            $(this).val(score[i]);
        });
    
    };

    if (!initial) {
        let meta = parseInt($("#meta").val());
        if (meta % 2)
            meta--;
        else
            meta++;
        $("#meta").val(meta);
    }
}

function togglePage(num, force = false) {
    let page = $(`#page${num}`);
    if (force)
        page.toggle();
    else {
        let isPageOn = pageOn(num);
        if ($("#class").val() !== "act") { //this is gross and I don't like it but I've dug this hole
            if (num === 4)
                isPageOn = pageOn(3);
            else if (num === 3)
                isPageOn = pageOn(4);
        }
        isPageOn ? page.show() : page.hide();
    }
}

function fixDivs() {
    let total = $(".pageSelect").length;

    for (let i=1; i<total; i++) {
        if (pageOn(i) && anyPageOn(i+1, total))
            $("#div" + i).show();
        else
            $("#div" + i).hide();
    }
}

function showAllPages() {
    let total = $(".pageSelect").length;

    for (let i=1; i<=total; i++) {
        $(`#p${i}`)[0].checked = true;
        if ($("#class").val() != "act" && i === 4)
            $(`#p${i}`)[0].checked = false;
        togglePage(i);
    }

    fixDivs();
}

function toggleAct(enabled) {
    let totalPages = $(".pageSelect").length;
    if (enabled) {
        $("#p4selector").show();
        $(".pageSelect")[3].checked = $(".pageSelect")[2].checked;
        $(".pageSelect")[2].checked = true;
        $("#page3").show();
        if (anyPageOn(1, 2))
            $("#div2").show();
        if (anyPageOn(4, totalPages))
            $("#div3").show();
        $("#act-num").show();
    }
    else {
        $("#p4selector").hide();
        $(".pageSelect")[2].checked = $(".pageSelect")[3].checked;
        $(".pageSelect")[3].checked = false;
        $("#page3").hide();
        $("#div3").hide();
        $("#act-num").hide();
    }
}

function checkMeta() {
    if (parseInt($("#meta").val()) % 2) {
        $("#statflip")[0].checked = true;
        if ($("#str-mod").hasClass("bigBox"))
            flipStats(true);
    }
    if(!(parseInt($("#meta").val()) % 2)) {
        $("#statflip")[0].checked = false;
        if ($("#str-mod").hasClass("lilBox"))
            flipStats(true);
    }
}