<?php
    if ($_POST["action"] == "login")  {
        @$mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD"); /* @ prevents error from sending, custom error handle below */

        if($mysqli->connect_error) {
            echo "<h5 id='login-failure'>Couldn't connect to database, please contact the site administrator.</h5>";
        }
        else {
            $user = $mysqli->real_escape_string($_POST["user"]);
            $pass = md5($mysqli->real_escape_string($_POST["pass"]));

            $result = $mysqli->query("SELECT id FROM admins WHERE username = '$user' AND password = '$pass'");
            
            if ($result) {
                $match = $result->num_rows;

                $result->close();
			    $mysqli->close();

                if ($match == 1)
                    {
                        if (!session_start()) {
                            echo "<h5 id='login-failure'>Couldn't verify session, please contact the site administrator.</h5>";
                        }
                        $_SESSION["loggedin"] = $user;
                        echo "<h5 id='login-success'>Login Successful.</h5>";
                    }
                else
                    echo "<h5 id='login-failure'>Invalid Credentials.";
            }
            else
                echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5>";
        }
    }
    else
        header("Location: .");
    exit;
?>