<?php
    if ($_POST["action"] == "rename")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

            if(!$mysqli->connect_error) {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];
                $name = $mysqli->real_escape_string($_POST["name"]);

                if ($user == "admin")
                    $mysqli->query("UPDATE characters SET name = '$name' WHERE id = '$id'");
                else
                    $mysqli->query("UPDATE characters SET name = '$name' WHERE username = '$user' AND id = '$id'");

                if ($mysqli->error)
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your character was renamed!";
                $mysqli->close();
            }
            else
                echo "An error occurred, please contact the site administrator.";
        }
        else
            echo "You are not logged in.</h5>";
    }
    else
        header("Location: /not_found");
    exit;
?>