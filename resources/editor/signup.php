<?php
    if ($_POST["action"] == "signup")  {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h5 id='login-failure'>Couldn't connect to database, please contact the site administrator.</h5>";
        }
        else {
            $user = $mysqli->real_escape_string($_POST["user"]);
            $email = $mysqli->real_escape_string($_POST["email"]);
            $pass = $mysqli->real_escape_string($_POST["pass"]);
            $conf = $mysqli->real_escape_string($_POST["conf"]);

            if (strlen($user) >= 256) {
                echo "<h5 id='login-failure'>Username too long (> 255 chars).</h5>";
                exit;
            }
            if (strlen($pass) >= 256) {
                echo "<h5 id='login-failure'>Password too long (> 255 chars).</h5>";
                exit;
            }

            if ($pass == $conf) {
                $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
                $hash = hash("sha512", $pass . $salt) . $salt;
                
                try {
                    $mysqli->query("INSERT INTO users (username, email, password, oldpass) VALUES ('$user', '$email', '$hash', '0')");
                }
                catch (mysqli_sql_exception $e) {
                    if ($e->getCode() == 1062)
                        echo "<h5 id='login-failure'>An account with this username or email already exists.</h5>";
                    else
                        echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5><p>{$e}</p>";
                
                    $mysqli->close();
                    exit;
                }
                
                echo "<h5 id='login-success'>Account Created!</h5>"; 
                $mysqli->close();
            }
            else
                echo "<h5 id='login-failure'>Passwords do not match.</h5>";
        }
    }
    else if ($_POST["action"] == "email")  {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h5 id='login-failure'>Couldn't connect to database, please contact the site administrator.</h5>";
            exit;
        }

        $email = $mysqli->real_escape_string($_POST["email"]);
        session_start();
        $user = $_SESSION["loggedin"];

        try {
            $mysqli->query("UPDATE users SET email='$email' WHERE username='$user'");
        }
        catch (mysqli_sql_exception $e) {
            if ($e->getCode() == 1062)
                echo "<h5 id='login-failure'>An account with this email already exists.</h5>";
            else
                echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5><p>{$e}</p>";
        
            $mysqli->close();
            exit;
        }

        echo "<h5 id='login-success'>Email Updated!</h5>"; 
        $mysqli->close();
    }
    else
        header("Location: /not_found");
    exit;
?>