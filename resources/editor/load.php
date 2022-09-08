<?php
    if ($_POST["action"] == "load")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

            if(!$mysqli->connect_error) {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];

                if ($user == "admin")
                    $result = $mysqli->query("SELECT * FROM characters WHERE id = '$id'");
                else
                    $result = $mysqli->query("SELECT * FROM characters WHERE username = '$user' AND id = '$id'");

                if ($result) {
                    if ($result->num_rows == 1) {
                        $fetch = $result->fetch_assoc();
                        echo $fetch["img"] . "-------" . $fetch["data"];
                    }              
                    $result->close();
                }
                $mysqli->close();
            }
        }
    }
    else
        header("Location: /not_found");
    exit;
?>