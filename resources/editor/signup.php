<?php
    if ($_POST["action"] == "signup")  {
        @$mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD"); /* @ prevents error from sending, custom error handle below */

        if($mysqli->connect_error) {
            echo "<h5 id='login-failure'>Couldn't connect to database, please contact the site administrator.</h5>";
        }
        else {
            $user = $mysqli->real_escape_string($_POST["user"]);
            $pass = md5($mysqli->real_escape_string($_POST["pass"]));
            $conf = md5($mysqli->real_escape_string($_POST["conf"]));

            if ($pass == $conf) {
                $result = $mysqli->query("SELECT id FROM users WHERE username = '$user'");

                if ($result) {
                    if ($result->num_rows == 0) {
                        $mysqli->query("INSERT INTO users (username, password) VALUES ('$user', '$pass')");

                        if ($mysqli->error)
                            echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5><p>{$mysqli->error}</p>";
                        else 
                            echo "<h5 id='login-success'>Account successfully created.</h5>"; 
                        $mysqli->close();
                    }
                    else
                        echo "<h5 id='login-failure'>Username already taken.</h5>";

                    $result->close();
                    $mysqli->close();
                }
                else
                    echo "<h5 id='login-failure'>Something went wrong, please contact the site administrator.</h5>";
            }
            else
                echo "<h5 id='login-failure'>Passwords do not match.</h5>";
        }
    }
    else
        header("Location: .");
    exit;
?>