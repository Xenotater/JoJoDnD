<?php
  if ($_POST["action"] == "code")  {
    $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");
    $email = $mysqli->real_escape_string($_POST["email"]);

    if($mysqli->connect_error) {
      echo "Couldn't connect to database, please contact the site administrator.<br>{$mysqli->connect_error}";
      exit;
    }

    $result = $mysqli->query("SELECT username FROM users WHERE email='$email'");
    if ($mysqli->error) {
      echo "Couldn't authenticate, please contact the site administrator.<br>{$mysqli->error}";
      $mysqli->close();
      exit;
    }
    if ($result->num_rows == 0) {
      echo "No account with that email exists.";
      $mysqli->close();
      $result->close();
      exit;
    }
    
    $user = $result->fetch_assoc()["username"];
    $result->close();
    
    $mysqli->query("DELETE FROM recovery WHERE TIMESTAMPADD(HOUR, 1, created) < CURRENT_TIMESTAMP;"); //invalidate old codes before adding new ones

    $unique = false;
    $c = 0;
    while(!$unique && $c < 100) {
      $unique = true;
      $code = bin2hex(random_bytes(20));

      try {
        $mysqli->query("INSERT INTO recovery (user, code) VALUES ('$user', '$code')");
      }
      catch (mysqli_sql_exception $e) {
        if ($e->getCode() == 1062) {
          $unique = false;
          $c++;
        }
        else
          echo "An error occurred, please contanct the site administrator.<br>{$e}";
      }
    }

    $mysqli->close();

    if ($c == 100)
      echo "Could not generate a recovery code, please contact the site administrator.";

    echo $user . "|" . $code;
  }
  exit;
?>