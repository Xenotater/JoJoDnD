$(document).ready(function () {
    let langParam = new URL(window.location.href).searchParams.get("lang");

    if (langParam != null)
        setLangCookie(langParam);
    else if (document.cookie.includes("lang"))
        setLangParam();
    else {
        updateLang("en");
    }

    $(document).on("change", "#lang-select-input", function() {
        updateLang($(this).val());
    });

    getNav();
    translatePage();
});

function getNav() {
    let data = "", path = window.location.pathname;
    $.post("/nav.php", { action: "nav", ads: isAdEnabled(path), langs: getAvailableLangs(path) }, function (data) {
        $("#header").append(data);
        var id = "#" + window.location.pathname.replace(/\//g, "");
        if (id == "#")
            id += "home";
        $(id).addClass("current-nav");
        $("#lang-select-input").val(getLanguage());
    });
}

function isAdEnabled(path) {
    return !(path.includes("recovery") || path.includes("privacy"))
}

function translatePage() {
    const lang = getLanguage(), path = window.location.pathname;
    if (lang != "en" && getAvailableLangs(path).includes(lang)) {
        $.getJSON(path + "/translations/" + lang + ".json", function (translation) {
            document.querySelectorAll('*').forEach(element => {
                const key = element.dataset?.translationKey;
                const newText = translation[key ? key : $(element).text()];
                if (newText) {
                    $(element).text(newText);
                    if (element.tagName.match("H[1-3]"))
                        fixScaleBig($(element));
                    else if (element.tagName != "P")
                        fixScale($(element));
                }
            });
        });
    }
}

function fixScaleBig(element) {
    let val = element.parent().width() / element.text().length, upper = 24, medium = 20, lower = 16;
    console.log(element.text() + ": " + val);

    if (val > upper)
        element.css("font-size", "40px");
    else if (val < upper && val > medium)
        element.css("font-size", "32px");
    else if (val < medium && val > lower)
        element.css("font-size", "28px");
    else
        element.css("font-size", "24px");
}

function fixScale(element) {
    var val = $(element).parent().width() / $(element).text().length, upper = 7, lower = 5;
    console.log(element.text() + ": " + val);

    if (shouldScale)
        if (!shouldScale(element[0]))
            return;

    if (element.attr("for") == "dc")
        console.log(val);

    if (val > upper)
        $(element).css("font-size", "12px");
    else if (val < upper && val > lower)
        $(element).css("font-size", "10px");
    else {
        $(element).css("font-size", "8px");
        $(element).css("font-weight", "bold");
    }
}

function isTextInputTag(tagName) {
    const textInputs = ["input", "textarea"]
}

function updateLang(lang) {
    setLangCookie(lang);
    setLangParam();
    window.location.reload();
}

function setLangCookie(lang) {
    document.cookie = "lang=" + lang;
}

function setLangParam() {
    let search = window.location.search.replace(/^\?/, "").replace(/&?lang=[a-z]{2}/, "");
    if (search.length > 0)
        search += "&";
    window.history.replaceState(null, "", '?' + search + 'lang=' + getLanguage());
}

function getLanguage() {
    let cookies = document.cookie.split(";");
    if (cookies.length > 0) {
        let langCookie = cookies.find(cookie => cookie.includes("lang"));
        if (langCookie.length > 0)
            return langCookie.split("=")[1];
    }
    return "en";
}

function getAvailableLangs(path) {
    if (path.includes("editor"))
        return ["uk"];
    return [];
}