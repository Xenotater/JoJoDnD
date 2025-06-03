var loggedIn = 0;
var charID = -1, charFolder = "0", folder = "0";
var offsetF = [0], offsetC = [0];
var folderpath = [{name: "Main", id: "0"}];
var images = {};
var query = "";

$(document).ready(function () {
    checkLoggedIn();

    $("#load").click(function() {
        popLoad();
    });

    $("body").on("click", "#closeLoad", function() {
        $("#popLoad").remove();
    });

    $("body").on("click", "#closeSignIn", function() {
        $("#popSignIn").remove();
    });

    $("body").on("click", "#closeConf", function() {
        $("#popConf").remove();
    });
    
    $("body").on("click", "#closeEmail", function() {
        $("#popEmail").remove();
    });

    $("body").on("click", "#login", function() {
        if (loggedIn) {
            logOut();
        }
        else
            popLogIn();
    });

    $("body").on("click", "#toSignUp", function() {
        $("#popSignIn").remove();
        popSignUp();
    });

    $("body").on("click", "#toSignIn", function() {
        $("#popSignIn").remove();
        popLogIn();
    });

    $("body").on("click", "#signUp", function() {
        signUp();
    });

    $("body").on("click", "#signIn", function() {
        logIn();
    });

    $("body").on("click", "#save", function() {
        if (!loggedIn)
            popLogIn();
        else {
            saveChar();
        }
    });

    $("body").on("click", ".loadBox", function() {
        let id = $(this).parent().attr("id").replace("char", "");
        loadChar(id);
    });
    
    $("body").on("click", ".foldLoadBox", function() {
        let id = $(this).parent().attr("id").replace("fold", "");
        let name = $("#fold" + id + " .charName").text();
        folder = id;
        folderpath.push({name: name, id: id});
        updateCharacters();
    });

    $("body").on("click", "#folderBack", function() {
        folder = folderpath.at(-2).id;
        folderpath.splice(-1);
        updateCharacters();
    });

    $("body").on("click", ".pathLink", function() {
        let id = $(this).attr("id").replace("path", "");
        folder = id;
        folderpath = folderpath.splice(0, folderpath.findIndex(info => info.id === id) + 1);
        updateCharacters();
    });

    $("body").on("search", "#search", function() {
        query = $("#search").val();
        offsetF = [0];
        offsetC = [0];
        updateCharacters();
    });

    $("body").on("click", ".bi-three-dots-vertical", function () {
        if ($(this).attr("id").includes("fold"))
            $("#fold-drop" + $(this).attr("id").replace("fold-opt", "")).css("display", "unset");
        else
            $("#drop" + $(this).attr("id").replace("opt", "")).css("display", "unset");
    });

    $(document).mouseup(function (e) {
        if (!$(".contextMenu").is(e.target) && $(".contextMenu").has(e.target).length === 0)
            $(".contextMenu").css("display", "none");
    });

    $("body").on("click", ".drop", function (e) {
        let isFolder = $(this).attr("id").includes("fold");
        let id = $(this).attr("id").replace(/^(fold-)?drop/, "");
        switch (e.target.textContent) {
            case "Rename":
                popRename(id, isFolder);
                break;
            case "Duplicate":
                dupe(id, isFolder);
                break;
            case "Delete":
                popDel(id, isFolder);
                break;
            case "Move": 
                popMove(id, isFolder);
                break;
            default:
                break;
        }
    });

    $("body").on("click", ".renameBtn", function() {
        let isFolder = $(this).attr("id").includes("fold");
        rename($(this).attr("id").replace(/^rename-(fold|char)/, ""), isFolder);
    });

    $("body").on("click", ".delBtn", function() {
        let isFolder = $(this).attr("id").includes("fold");
        del($(this).attr("id").replace(/^del-(fold|char)/, ""), isFolder);
    });

    $("body").on("click", ".moveBtn", function() {
        let isFolder = $(this).attr("id").includes("fold");
        move($(this).attr("id").replace(/^move-(fold|char)/, ""), isFolder, false);
    });

    $("body").on("click", ".moveBackBtn", function() {
        if (!$(this).attr("disabled")) {
            let isFolder = $(this).attr("id").includes("fold");
            move($(this).attr("id").replace(/^moveBack-(fold|char)/, ""), isFolder, true);
        }
    });

    $("body").on("click", "#newItem", function() {
        $("#newItemMenu").css("display", "unset");
    });

    $("body").on("click", "#newChar", function() {
        $("#popLoad").remove();
        $("#pages")[0].reset();
        resetImg(true);
        resetImg(false);
        charID = -1;
        charFolder = folder;
        respond("New character created!");
    });

    $("body").on("click", "#newFold", function() {
        $.post("newFold.php", {action: "new", folder: folder}, function(data) {
            if (data)
                respond(data);
            updateCharacters();
        });
    });

    $("body").on("mouseenter", ".arrow", function() {
        if ($(this).hasClass("bi-arrow-left-square")) {
            $(this).removeClass("bi-arrow-left-square");
            $(this).addClass("bi-arrow-left-square-fill");
        }
        else {
            $(this).removeClass("bi-arrow-right-square");
            $(this).addClass("bi-arrow-right-square-fill");
        }
    });

    $("body").on("mouseleave", ".arrow", function() {
        if ($(this).hasClass("bi-arrow-left-square-fill")) {
            $(this).removeClass("bi-arrow-left-square-fill");
            $(this).addClass("bi-arrow-left-square");
        }
        else {
            $(this).removeClass("bi-arrow-right-square-fill");
            $(this).addClass("bi-arrow-right-square");
        }
    });

    $("body").on("click", ".arrow", function() {
        let folderCount = $(".folder").length, charCount = $(".character").length;

        if ($(this).attr("id") == "prevPage") {
            offsetC.splice(-1);
            offsetF.splice(-1);
        }
        else {
            offsetC.push(offsetC.at(-1) + charCount);
            offsetF.push(offsetF.at(-1) + folderCount);
        }
        
        if (offsetC.length < 0 || offsetC.at(-1) < 0)
            offsetC = [0];

        if (offsetF.length < 0 || offsetF.at(-1) < 0)
            offsetF = [0];

        updateCharacters();
    });

    $("body").on("click", "#email-btn", function() {
        updateEmail();
    });
});

function checkLoggedIn() {
    $.post("login.php", { action: "check" }, function(data) {
        loggedIn = parseInt(data);
        if (!loggedIn)
            $("#login").html('<i class="bi bi-door-open"></i><br><span data-translation-key="loginBtn" id="loginText">Login</span>');
        else
            $("#login").html('<i class="bi bi-door-closed"></i><br><span data-translation-key="logoutBtn" id="loginText">Logout</span>');
        translateElement($("#loginText")[0]);
    });
}

function postTranslate() {
    console.log("done");
    translateElement($("#loginText")[0]); //just in case of a race condition issue
}

function popLoad() {
    checkLoggedIn();
    let newText = "<div id='popLoad' class='center'>";
    newText += "<div class='content center' id='load-window'>";
    newText += "<div id='charHead'>";
    newText += "<input type='search' id='search' placeholder='Search'>";
    newText += "<i id='closeLoad' class='bi bi-x-lg'></i></div>";
    newText += "<div data-simplebar id='simple'><div id='characters'></div></div>";
    newText += "<div id='charFoot'>";
    newText += "<i id='prevPage' class='bi bi-arrow-left-square arrow'></i><i id='nextPage'class='bi bi-arrow-right-square arrow'></i>"
    newText += "<span id='pageCount'></span>"
    newText += "</div></div></div>"
    $("body").append(newText);
    updateCharacters();
}

function updateCharacters() {
    $("#characters").empty();
    $.post("characters.php", { action: "chars", search: query, folder: folder, f_offset: offsetF.at(-1), c_offset: offsetC.at(-1) }, function(data) {
        $("#characters").empty();
        $("#characters").append(data);
        $("#char" + charID).addClass("curChar");

        if (loggedIn) {
            let totalOffset = offsetF.at(-1) + offsetC.at(-1);

            $.post("characters.php", { action: "count", search: query, folder: folder }, function(count) {
                count = parseInt(count);
                let current = Math.floor(totalOffset/11) + 1, max = Math.floor(count/11) + 1;
                if (count != 0 && count % 11 == 0)
                    max--;

                $("#pageCount").html(current + " / " + max);

                if (count >= 11 && count - totalOffset > 11)
                    $("#nextPage").css("display", "inline-block");
                else
                    $("#nextPage").css("display", "none")
                        
                if (totalOffset >= 11)
                    $("#prevPage").css("display", "inline-block");
                else
                    $("#prevPage").css("display", "none");

                if (getLanguage() != "en") {
                    let greeting = $("#greeting"); user = greeting.text().split("'")[0];
                    greeting.text(translateText("greeting").replace("{name}", user));
                }

                if(folderpath.length > 1)
                    updateFolderpath();
                else
                    $("#folderpath").hide();
            });
            $("#load-window .simplebar-content-wrapper").animate({scrollTop: 0}, 200)
            translateElement($("#err")[0]);
            updateCardImages();
        }
    });
    $("#characters").append("<div class='loading'></div>");
    translateElement($("#search")[0]);
    if (query)
        $("#search").val(query);
}

function updateFolderpath() {
    $("#folderpath").empty();
    $("#folderpath").append("<i id='folderBack' class='bi bi-arrow-left-circle'></i>");
    folderpath.forEach((info) => {
        $("#folderpath").append("<span><a href='#' class='pathLink' id='path" + info.id + "'>" + info.name + "</a>/</span>");
    });
    last = $("#folderpath").children().last();
    last.text(last.text().slice(0, -1))
    $("#folderpath").show();
}

function updateCardImages() {
    $(".character").each(function (i, char) {
        let id = $(char).attr("id").replace("char", "");
        
        if (images[id] != undefined) {
            $("#char" + id + " img").attr("src", images[id])
        }
        else {
            $.post("image.php", { action: "image", id: id }, function (data) {
                $("#char" + id + " img").attr("src", data);
                images[id] = data;
            });
        }
    });
}

function logOut() {
    $.post("logout.php", { action: "logout" }, function(data) {
        window.location.reload();
    });
}

function popLogIn() {
    let newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<h2>Sign In</h2>";
    newText += "<form id='login-form' onsubmit='return false'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<button type='submit' id='signIn'>Login</button>"
    newText += "<br><a id='toSignUp'>Create Account</a><br class='linkbreak'><a href='recovery' target='_blank'>Account Recovery";
    newText += "</form></div></div>";
    $("body").append(newText);
    translateElement($("#popSignIn")[0]);
}

function popSignUp() {
    let newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<h2>Sign Up</h2>";
    newText += "<form id='signUp-form' onsubmit='return false'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='email'>Email:</label><br><input type='email' id='email' name='email' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<label for='conf'>Confirm Password:</label><br><input type='password' id='conf' name='conf' required><br>";
    newText += "<button type='submit' id='signUp'>Create</button>"
    newText += "<br><a id='toSignIn'>Back</a>";
    newText += "</form></div></div>";
    $("body").append(newText);
    translateElement($("#popSignIn")[0]);
}

function logIn() {
    let user = $("#user").val(), pass = $("#pass").val();
    if ($("#login-form")[0].checkValidity())
        $.post("login.php", { action: "login", user: user, pass: pass }, function(data) {
            let eFlag = 1;
            if (data.includes("Login Successful!")) {
                eFlag = parseInt(data[0]);
                loggedIn = 1;
                $("#popSignIn").remove();
                $("#login").html('<i class="bi bi-door-closed"></i><br><span data-translation-key="logoutBtn" id="loginText">Logout</span>');
                translateElement($("#loginText")[0]);
                respond("Login Successful!");
            }
            else {
                $("#login-failure").remove();
                $("#signIn-window").append(translateText(data));
                translateElement($("#login-failure"));
            }
            if(!eFlag)
                promptEmail();
        });
}

function signUp() {
    let user = $("#user").val(), email = $("#email").val(), pass = $("#pass").val(), conf = $("#conf").val();
    if ($("#signUp-form")[0].checkValidity())
        $.post("signup.php", { action: "signup", user: user, email: email, pass: pass, conf: conf }, function(data) {
            if (data == "<h5 id='login-success'>Account Created!</h5>") {
                $("#popSignIn").remove();
                respond("Account Created!");
                popLogIn();
            }
            else {
                $("#login-failure").remove();
                $("#signIn-window").append(data);
                translateElement($("#login-failure"));
            }
        });
}

function respond(text) {
    $("#response").remove();
    $("body").append("<div id='response'><h5 id='response-text'>" + text + "</h5></div>");
    if (text.includes("!")) {
        $("#response").addClass("success");
    }
    else
        $("#response").addClass("failure");
    setTimeout(function () {
        $("#response").fadeOut(500, function() {
            $("#response").remove();
        });
    }, 3000);
    if (getLanguage() != "en")
        translateElement($("#response-text")[0]);
}

function saveChar() {
    checkLoggedIn();

    let result = exportData("save");    
    $.post("save.php", { action: "save", id: charID, name: result[0], form: result[1], img: result[2], img2: result[3], folder: charFolder }, function(data) {
        if (loggedIn) {
            if (data.match(/[0-9]+$/))
                charID = parseInt(data.match(/[0-9]+$/)[0]);
            if (data.includes("You do not own this folder")) {
                folder = 0;
                folderpath.splice(1, Infinity);
            }
            if (data.includes("!") && result[3] != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
                images[charID] = result[3];
        }
        respond(data.replace(/[0-9]+$/, ""));
    });
}

function loadChar(id) {
    $.post("load.php", { action: "load", id: id }, function(data) {
        if (data) {
            let file = JSON.parse(data);
            importData(file);
            $("#popLoad").remove();
            charID = id;
            charFolder = folder;
            respond("Your character was loaded!");
        }
        else
            respond("An error occurred, please contact the site administrator.");
    });
}

function search(query) {
    let not = false;

    if (query.match(/^NOT */)) {
        not = true;
        query = query.replace(/^NOT */, "");
    }

    let chars = $("#chars").children();

    for (i = 0; i < chars.length; i++) { //reset search
        let info = chars[i].textContent.toLowerCase().replace("renameduplicatedelete", "");
        $(chars[i]).css("display", "block");
    }

    for (i = 0; i < chars.length; i++) { //new search
        let info = chars[i].textContent.toLowerCase().replace("renameduplicatedelete", "");
        if ((!info.includes(query.toLowerCase()) && !not) || (info.includes(query.toLowerCase()) && not))
            $(chars[i]).css("display", "none");
    }
}

function popRename(id, isFold) {
    $(".drop").css("display", "none");
    let newText = "<div id='popConf' class='center'>";
    newText += "<div class='content' id='confirm-window'>";
    newText += "<i id='closeConf' class='bi bi-x-lg'></i>";
    newText += "<h2>New" + (isFold ? " Folder" : " Character") + " Name</h2>";
    newText += "<input type='text' id='newName'>";
    newText += "<button class='renameBtn' id='rename" + (isFold ? "-fold" : "-char") + id + "'>Rename</button>";
    newText += "</div></div></div>";
    $("body").append(newText);
    $("#newName").val($($((isFold ? "#fold" : "#char") + id).children()[2]).children()[1].textContent);
    translateElement($("#popConf")[0]);
}

function popDel(id, isFold) {
    $(".drop").css("display", "none");
    let newText = "<div id='popConf' class='center'>";
    newText += "<div class='content' id='confirm-window'>";
    newText += "<i id='closeConf' class='bi bi-x-lg'></i>";
    if (isFold)
        newText += "<h2>Delete this folder?</h2><p data-translation-key='deleteFoldDesc'>Anything inside will also be deleted. This CANNOT be undone. Type \"Delete\" below to confirm.</p>";
    else
        newText += "<h2>Delete this character?</h2><p data-translation-key='deleteDesc'>This CANNOT be undone. Type \"Delete\" below to confirm.</p>";
    newText += "<input type='text' id='confDel'>";
    newText += "<button class='delBtn' id='del" + (isFold ? "-fold" : "-char")+ id + "'>Confirm</button>";
    newText += "</div></div></div>";
    $("body").append(newText);
    translateElement($("#popConf")[0]);
}

function popMove(id, isFold) {
    $(".drop").css("display", "none");
    let newText = "<div id='popConf' class='center'>";
    newText += "<div class='content' id='confirm-window'>";
    newText += "<i id='closeConf' class='bi bi-x-lg'></i>";
    newText += "<h2>Move " + (isFold ? "Folder" : "Character") + "</h2>";
    newText += "<p data-translation-key='moveDesc'>Enter the name of the folder to move to. If the folder doesn't exist, one will be created here. Alternatively, you may choose to move it up 1 folder.</p>";
    newText += "<input type='text' id='newLocation'>";
    newText += "<button class='moveBackBtn' id='moveBack" + (isFold ? "-fold": "-char") + id + "'" + (folder == "0" ? " disabled" : "") + ">Move Up</button>";
    newText += "<button class='moveBtn' id='move" + (isFold ? "-fold" : "-char") + id + "'>Move</button>";
    newText += "</div></div></div>";
    $("body").append(newText);
    translateElement($("#popConf")[0]);
}

function rename(id, isFold) {
    let newName = $("#newName").val();
    $.post("rename.php", { action: "rename", id: id, name: newName, isFolder: isFold }, function(data) {
        $("#popConf").remove();
        respond(data);
        updateCharacters();
    });
}

function dupe(id, isFold) {
    $.post("duplicate.php", { action: "dupe", id: id, folder: folder, isFolder: isFold }, function(data) {
        respond(data);
        updateCharacters();
    });
}

function move(id, isFold, goBack) {
    let newFold = $("#newLocation").val();
    $.post("move.php", { action: "move", newFold: newFold, id: id, folder: folder, isFolder: isFold, goBack: goBack }, function(data) {
        $("#popConf").remove();
        respond(data);
        updateCharacters();
    });
}

function del(id, isFold) {
    if ($("#confDel").val() == "Delete") {
        $.post("delete.php", { action: "del", id: id, isFolder: isFold }, function(data) {
            $("#popConf").remove();
            respond(data);
            updateCharacters();
        });
    }
    else {
        $("#del-failure").remove();
        $("#confirm-window").append("<p id='del-failure'>Type \"Delete\" to confirm.</p>");
    }
}

function promptEmail() {
    let newText = "<div id='popEmail' class='center'>";
    newText += "<div class='content' id='email-window'>";
    newText += "<i id='closeEmail' class='bi bi-x-lg'></i>";
    newText += "<h2>Enter Your Email</h2>";
    newText += "<p data-translation-key='emailDesc'>This isn't mandatory for current users, but we need your email to authenticate you if you ever need to reset your password.</p>";
    newText += "<form id='email-form' onsubmit='return false'>";
    newText += "<label for='email'>Email:</label><br><input type='email' id='email' name='email' required><br>";
    newText += "<button type='submit' id='email-btn'>Submit</button>";
    newText += "</form></div></div>";
    $("body").append(newText);
    translateElement($("#popEmail")[0]);
}

function updateEmail() {
    let email = $("#email").val();
    if ($("#email-form")[0].checkValidity())
        $.post("signup.php", {action: "email", email: email}, function(data) {
            if (data == "<h5 id='login-success'>Email Updated!</h5>") {
                $("#popEmail").remove();
                respond("Email Updated!");
            }
            else {
                $("#login-failure").remove();
                $("#email-window").append(data);
                translateElement($("#login-failure"));
            }
        });
}