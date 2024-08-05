<?php
  if ($_POST["action"] == "reset")  {
    $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");
    $code = $mysqli->real_escape_string($_POST["code"]);
    $pass = $mysqli->real_escape_string($_POST["password"]);

    if($mysqli->connect_error) {
      echo "<h4>Couldn't connect to database, please contact the site administrator.</h4><p>{$mysqli->connect_error}</p>";
      exit;
    }

    $mysqli->query("DELETE FROM recovery WHERE TIMESTAMPADD(HOUR, 1, created) < CURRENT_TIMESTAMP;"); //invalidate old codes before checking

    $result = $mysqli->query("SELECT user FROM recovery WHERE code='$code'");
    if ($mysqli->error) {
      echo "<h4>Couldn't authenticate, please contact the site administrator.</h4><p>{$mysqli->error}</p>";
      $mysqli->close();
      exit;
    }
    if ($result->num_rows != 1) {
      echo "<h4 data-translation-key='promptTitle4'>Your recovery link was invalid or expired.</h4><p data-translation-key='promptDesc4'>Reload this page and try generating another, or contact the site administrator if you think this is an error.</p>";
      $mysqli->close();
      $result->close();
      exit;
    }

    $user = $result->fetch_assoc()["user"];
    $result->close();

    $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
    $hash = hash("sha512", $pass . $salt) . $salt;

    $mysqli->query("UPDATE users SET password='$hash' WHERE username='$user'");
    if ($mysqli->error)
      echo "<h4>Couldn't update password, please contact the site administrator.</h4><p>{$mysqli->error}</p>";
    else {
      echo "<h4 data-translation-key='promptTitle3'>Password successfully reset.</h4><p data-translation-key='promptDesc3'>You may now return to the editor and log in again. If you continue to have issues logging in, please contact the site administrator.</p>";
      $mysqli->query("DELETE FROM recovery WHERE code='$code'");
    }

    $mysqli->close();
    exit;
  }
?>