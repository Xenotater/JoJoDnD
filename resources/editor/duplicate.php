<?php
    if ($_POST["action"] == "dupe")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

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
                        $user = $fetch["username"];
                        $name = $mysqli->real_escape_string($fetch["name"]);
                        $img = $mysqli->real_escape_string($fetch["img"]);
                        $data = $mysqli->real_escape_string($fetch["data"]);

                        $mysqli->query("INSERT INTO characters (username, name, img, data) VALUES ('$user', '$name', '$img', '$data')");
                        if ($mysqli->error)
                            echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5><p>{$mysqli->error}</p>";
                        else
                            echo "<h5 id='response-text'>Your character was duplicated!</h5>"; 
                    }
                    else
                        echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>";
                    $result->close();
                }
                else
                    echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5>";
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