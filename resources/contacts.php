<?php
    if ($_POST["user"] == "test" && $_POST["pass"] == "pass")
        echo "<h2>Login Successful.</h2>";
    else
        echo "<h2>Invalid Credentials.</h2>";
?>