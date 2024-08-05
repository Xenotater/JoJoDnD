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
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your character was deleted!"; 
                $mysqli->close();
            }
            else
                echo "An error occurred, please contact the site administrator.";
        }
        else
            echo "You are not logged in.";
    }
    else
        header("Location: /not_found");
    exit;
?>