<?php
    if ($_POST["action"] == "rename")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

            if(!$mysqli->connect_error) {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];
                $name = $mysqli->real_escape_string($_POST["name"]);

                if ($user == "admin")
                    $mysqli->query("UPDATE characters SET name = '$name' WHERE id = '$id'");
                else
                    $mysqli->query("UPDATE characters SET name = '$name' WHERE username = '$user' AND id = '$id'");

                if ($mysqli->error)
                    echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5><p>{$mysqli->error}</p>";
                else
                    echo "<h5 id='response-text'>Your character was renamed!</h5>"; 
            }
            else
                echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>";
        }
    }
    exit;
?>