$(document).ready(function () {
  let url = new URL(window.location.href);
  let code = url.searchParams.get("code");

  if (code)
    displayReset();
  else
    displayPrompt();

  $("body").on('click', '#submit-btn', function() {
    $("#response").html("");
    sendCode($("#email").val());
  });

  $("body").on('click', '#reset-btn', function() {
    $("#response").html("");
    reset($("#pass").val(), $("#conf").val(), code);
  });
});

function displayPrompt() {
  let newText = "<h4>Enter your email below.</h4>";
  newText += "<p>If we have an account in our system that matches your info, we'll send you a link to reset your password.</p>";
  newText += "<form id='email-form' onsubmit='return false'>";
  newText += "<input type='email' name='email' id='email' placeholder='diobrando@wryyyyy.com' style='width:80%;height:40px;margin-bottom:20px;' required>";
  newText += "<br><input type='submit' id='submit-btn' value='Submit' style='width:125px;height:50px;font-size:24px;'></form>";
  $("#display").prepend(newText);
}

async function sendCode(email) {
  if ($("#email-form")[0].checkValidity()) {
    let response = await generateCode(email);
    if (response.includes("|")) {
      let user = response.split("|")[0];
      let code = response.split("|")[1];
      $.post("email.php", {action: "send", recipient: email, user: user, code: code }, function(data) {
          if (data.includes("!"))
            $("#response").html("<p style='color:green;margin-top:12px;margin-bottom:0;'>" + data + "</p>")
          else
            $("#response").html("<p style='color:darkred;margin-top:12px;margin-bottom:0;'>" + data + "</p>")
      });
    }
    else
      $("#response").html("<p style='color:darkred;margin-top:12px;margin-bottom:0;'>" + response + "</p>")
  }
}

async function generateCode(e) {
  let response = "";
  await $.post("generate.php", {action: "code", email: e}, function(data) {
    response = data;
  });
  return response;
}

function displayReset() {
  let newText = "<h4>Enter your new password and confirm it below.</h4>";
  newText += "<p>Your password will be reset and you'll be able to go back to the editor and log in.</p>";
  newText += "<form id='reset-form' onsubmit='return false'>";
  newText += "<input type='password' name='pass' id='pass' placeholder='New Password' style='width:80%;height:40px;margin-bottom:20px;' required>";
  newText += "<br><input type='password' name='conf' id='conf' placeholder='Confirm Password' style='width:80%;height:40px;margin-bottom:20px;' required>";
  newText += "<br><input type='submit' id='reset-btn' value='Reset Password' style='width:200px;height:50px;font-size:24px;'></form>";
  $("#display").prepend(newText);
}

function reset(pass, conf, code) {
  if ($("#reset-form")[0].checkValidity()) {
    if (pass == conf) {
      $.post("reset.php", {action: "reset", code: code, password: pass}, function(data) {
        $("#display").html(data);
        window.history.replaceState(null, document.title, window.location.origin + window.location.pathname);
      })
      $("#characters").append("<div class='loading'></div>");
    }
    else
      $("#response").html("<p style='color:darkred;margin-top:12px;margin-bottom:0;'>Passwords do not match.</p>");
    }
}