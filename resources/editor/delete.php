<?php
    if ($_POST["action"] == "del")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

            if(!$mysqli->connect_error) {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];

                if ($user == "admin")
                    $mysqli->query("DELETE FROM characters WHERE id = '$id'");
                else
                    $mysqli->query("DELETE FROM characters WHERE username = '$user' AND id = '$id'");

                if ($mysqli->error)
                    echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5><p>{$mysqli->error}</p>";
                else
                    echo "<h5 id='response-text'>Your character was deleted!</h5>"; 
                $mysqli->close();
            }
            else
                echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>";
        }
        else
            echo "<h5 id='response-text'>You are not logged in.</h5>";
    }
    else
        header("Location: /not_found");
    exit;
?>