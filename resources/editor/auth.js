var loggedIn = 0;
var charID = -1;

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
      var id = $(this).parent().attr("id").replace("char", "");
      loadChar(id);
  });

  $("body").on("keyup", "#search", function() {
    query = $("#search").val();
    search(query);
  });

  $("body").on("click", ".bi-three-dots-vertical", function() {
      $("#drop" + $(this).attr("id").replace("opt", "")).css("display", "unset");
  });

  $(document).mouseup(function(e) {
      if (!$(".drop").is(e.target) && $(".drop").has(e.target).length === 0) 
          $(".drop").css("display", "none");
  });

  $("body").on("click", ".drop", function(e) {
      var id = $(this).parent().attr("id").replace("char", "");
      switch(e.target.textContent) {
          case "Rename":
              popRename(id);
              break;
          case "Duplicate":
              dupe(id);
              break;
          case "Delete":
              popDel(id);
              break;
          default:
              break;
      }
  });

  $("body").on("click", ".renameBtn", function() {
      rename($(this).attr("id").replace("rename", ""));
  });

  $("body").on("click", ".delBtn", function() {
      del($(this).attr("id").replace("del", ""));
  });

  $("body").on("click", "#newChar", function() {
      $("#popLoad").remove();
      $("#pages")[0].reset();
      resetImg();
      charID = -1;
      respond("<h5 id='response-text'>New character created!</h5>");
  });
});

function checkLoggedIn() {
    $.post("login.php", {action: "check"}, function(data) {
        loggedIn = parseInt(data);
        if (!loggedIn)
            $("#login").html('<i class="bi bi-door-open"></i><br>Login');
        else
            $("#login").html('<i class="bi bi-door-closed"></i><br>Logout');
    });
}

function popLoad() {
    checkLoggedIn();
    var newText = "<div id='popLoad' class='center'>";
    newText += "<div class='content center' id='load-window'>";
    newText += "<div id='charHead'>"
    newText += "<input type='search' id='search' placeholder='Search'>";
    newText += "<i id='closeLoad' class='bi bi-x-lg'></i></div>";
    newText += "<div data-simplebar id='simple'><div id='characters'></div></div>";
    newText += "</div></div>"
    $("body").append(newText);
    updateCharacters();
}

function updateCharacters() {
    $("#characters").empty();
    $.post("characters.php", {action: "chars"}, function(data) {
        $("#characters").empty();
        $("#characters").append(data);
        $("#char" + charID).addClass("curChar");
    });
    $("#characters").append("<div class='loading'></div>");
}

function logOut() {
    $.post("logout.php", {action: "logout"}, function(data) {
        loggedIn = 0;
        $("#login").html('<i class="bi bi-door-open"></i><br>Login');
    });
}

function popLogIn() {
    var newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<h2>Sign In</h2>";
    newText += "<form id='login-form' onsubmit='return false'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<input type='submit' value='Login' id='signIn'>"
    newText += "<br><a id='toSignUp'>Create Account</a>";
    newText += "</form></div></div>";
    $("body").append(newText);
}

function popSignUp() {
    var newText = "<div id='popSignIn' class='center'>";
    newText += "<div class='content' id='signIn-window'>";
    newText += "<i id='closeSignIn' class='bi bi-x-lg'></i>";
    newText += "<h2>Sign Up</h2>";
    newText += "<form id='signUp-form' onsubmit='return false'>";
    newText += "<label for='user'>Username:</label><br><input type='text' id='user' name='user' required><br>";
    newText += "<label for='pass'>Password:</label><br><input type='password' id='pass' name='pass' required><br>";
    newText += "<label for='conf'>Confirm Password:</label><br><input type='password' id='conf' name='conf' required><br>";
    newText += "<input type='submit' value='Submit' id='signUp'>"
    newText += "<br><a id='toSignIn'>Back</a>";
    newText += "</form></div></div>";
    $("body").append(newText);
}

function logIn() {
    var user = $("#user").val(), pass = $("#pass").val();
    if (user != "" && pass != "")
        $.post("login.php", {action: "login", user: user, pass: pass}, function(data) {
            if(data == "<h5 id='login-success'>Login Successful.</h5>") {
                loggedIn = 1;
                $("#popSignIn").remove();
                $("#login").html('<i class="bi bi-door-closed"></i><br>Logout');
            }
            $("#login-failure").remove();
            $("#signIn-window").append(data);
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
    $.post("save.php", {action: "save", id: charID, name: result[0], form: result[1], img: result[2]}, function(data) {
        if (data.match(/^[0-9]+/))
            charID = parseInt(data.match(/^[0-9]+/)[0]);
        respond(data.replace(/^[0-9]+/, ""));
        updateCharacters();
    });
}

function loadChar(id) {
    $.post("load.php", {action: "load", id: id}, function(data) {
        if (data) {
            file = {};
            file["form"] = data.split("-------")[1];
            file["img"] = data.split("-------")[0];
            importData(file);
            $("#popLoad").remove();
            charID = id;
            respond("<h5 id='response-text'>Your character was loaded!</h5>");
        }
        else
            respond("<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>");
    });
}

function search(query) {
    var not = false;
    
    if (query.match(/^NOT */)) {
        not = true;
        query = query.replace(/^NOT */, "");
    }

    var chars = $("#chars").children();

    for (i=0;i<chars.length;i++) { //reset search
        var info = chars[i].textContent.toLowerCase().replace("renameduplicatedelete", "");
        $(chars[i]).css("display", "block");
    }

    for (i=0;i<chars.length;i++) { //new search
        var info = chars[i].textContent.toLowerCase().replace("renameduplicatedelete", "");
        if ((!info.includes(query.toLowerCase()) && !not) || (info.includes(query.toLowerCase()) && not))
            $(chars[i]).css("display", "none");
    }
}

function popRename(id) {
    $(".drop").css("display", "none");
    var newText = "<div id='popConf' class='center'>";
    newText += "<div class='content' id='confirm-window'>";
    newText += "<i id='closeConf' class='bi bi-x-lg'></i>";
    newText += "<h2>New Name</h2>";
    newText += "<input type='text' id='newName'>";
    newText += "<button class='renameBtn' id='rename" + id + "'>Rename</button>"
    newText += "</div></div></div>";
    $("body").append(newText);
    $("#newName").val($($("#char" + id).children()[2]).children()[1].textContent);
}

function popDel(id) {
    $(".drop").css("display", "none");
    var newText = "<div id='popConf' class='center'>";
    newText += "<div class='content' id='confirm-window'>";
    newText += "<i id='closeConf' class='bi bi-x-lg'></i>";
    newText += "<h2>Delete this Character?</h2><p>This CANNOT be undone. Type \"Delete\" below to confirm.</p>";
    newText += "<input type='text' id='confDel'>";
    newText += "<button class='delBtn' id='del" + id + "'>Confirm</button>"
    newText += "</div></div></div>"; 
    $("body").append(newText);
}

function rename(id) {
    var newName = $("#newName").val();
    $.post("rename.php", {action: "rename", id: id, name: newName}, function(data) {
        $("#popConf").remove();
        respond(data);
        updateCharacters();
    });
}

function dupe(id) {
    $.post("duplicate.php", {action: "dupe", id: id}, function(data) {
        respond(data);
        updateCharacters();
    });
}

function del(id) {
    if ($("#confDel").val() == "Delete") {
        $.post("delete.php", {action: "del", id: id}, function(data) {
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