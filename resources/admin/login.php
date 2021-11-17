<?php
    if (!session_start()) {
        echo "<h5 id='login-failure'>Couldn't Verify Session, Please Contact the Site Admin.</h5>";
    }

    if ($_POST["action"] == "login") 
        if (($_POST["user"] == "test" && $_POST["pass"] == "pass") || ($_POST["user"] == "dio" && $_POST["pass"] == "oiltanker4u"))
            {
                $_SESSION["loggedin"] = $_POST["user"];
                echo "<h5 id='login-success'>Login Successful.</h5>";
            }
    else
        echo "<h5 id='login-failure'>Invalid Credentials.</h5>";
    exit;
?>