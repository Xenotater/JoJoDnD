<?php
    if ($_POST["action"] == "check") {
        if (session_start() && !empty($_SESSION["loggedin"]))
            echo 1;
        else
            echo 0;
        exit;
    }
    elseif ($_POST["action"] == "login")  {
        @$mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD"); /* @ prevents error from sending, custom error handle below */

        if($mysqli->connect_error) {
            echo "<h5 id='login-failure'>Couldn't connect to database, please contact the site administrator.</h5>";
        }
        else {
            $user = $mysqli->real_escape_string($_POST["user"]);
            $pass = $mysqli->real_escape_string($_POST["pass"]);
            
            $result = $mysqli->query("SELECT id, email, password, oldpass FROM users WHERE username = '$user'");
            
            if ($result) {
                $match = $result->num_rows;
                $fetch = $result->fetch_assoc();

                $result->close();

                if ($match == 1)
                    {
                        $id = $fetch["id"];
                        $email = $fetch["email"];
                        $dbPass = $fetch["password"];
                        if ($fetch["oldpass"]) { //old, less secure password format
                            if (md5($pass) != $dbPass) {
                                echo "<h5 id='login-failure'>Invalid Credentials.</h5>";
                                $mysqli->close();
                                exit;
                            }
                            //update to new format
                            $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
                            $hash = hash("sha512", $pass . $salt) . $salt;
                            $mysqli->query("UPDATE users SET oldpass = '0', password = '$hash' WHERE id = '$id'");
                        }
                        else {
                            $salt = substr($dbPass, -4);
                            $hash = substr($dbPass, 0, -4);
                            if(hash("sha512", $pass . $salt) != $hash){
                                echo "<h5 id='login-failure'>Invalid Credentials.</h5>";
                                $mysqli->close();
                                exit;
                            }
                        }

                        if (!session_start()) {
                            echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5>";
                        }
                        $_SESSION["loggedin"] = $user;

                        $eFlag = 0;
                        if ($email)
                            $eFlag = 1;

                        echo "$eFlag<h5 id='login-success'>Login Successful!</h5>";
                        $mysqli->close();
                    }
                else
                    echo "<h5 id='login-failure'>Invalid Credentials.";
            }
            else
                echo "<h5 id='login-failure'>An error occurred, please contact the site administrator.</h5>";
        }
    }
    else
        header("Location: /not_found");
    exit;
?>