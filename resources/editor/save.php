<?php
    if ($_POST["action"] == "save")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = mysqli_init();
            $mysqli->real_connect("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD", null, null, MYSQLI_CLIENT_FOUND_ROWS);

            if($mysqli->connect_error) {
                echo "An error occurred, please contact the site administrator.";
            }
            else {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];
                $name = $mysqli->real_escape_string($_POST["name"]);
                $img = $mysqli->real_escape_string($_POST["img"]);
                $img2 = $mysqli->real_escape_string($_POST["img2"]);
                $form = $mysqli->real_escape_string($_POST["form"]);
                $folder = $_POST["folder"];

                if (strlen($img) + strlen($img2) + strlen($form) >= 536870912) {
                    echo "Character data is too large (0.5GB+). Please contact the site administrator if you believe this is an error.";
                    exit;
                }

                if ($name == "" || $img == "" || $img2 == "" || $form == "" || $folder == "") {
                    echo "An error occurred, please contact the site administrator.";
                    exit;
                }

                if ($folder != "0" && $user != "admin") {
                    $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND id = '$folder'");
                    if ($result->num_rows != 1) {
                        echo "You do not own this folder, your character will be saved to the main folder. ";
                        $folder = "0";
                    }
                    $result->close();
                }

                if ($id == -1) {
                    $mysqli->query("INSERT INTO characters (username, name, img, img2, data, folder_id) VALUES ('$user', '$name', '$img', '$img2', '$form',  '$folder')");

                    if ($mysqli->error)
                        echo "An error occurred, please contact the site administrator.";
                    else {
                        echo "Your character was saved!" . $mysqli->insert_id; //passing the new id back this way feels wrong
                    }
                }
                else {
                    if ($user == "admin")
                        $mysqli->query("UPDATE characters SET data = '$form', img = '$img', img2 = '$img2' WHERE id = '$id'");
                    else
                        $mysqli->query("UPDATE characters SET data = '$form', img = '$img', img2 = '$img2', folder_id = '$folder' WHERE username = '$user' AND id = '$id'");

                    if ($mysqli->affected_rows < 1)
                        $mysqli->query("INSERT INTO characters (id, username, name, img, img2, data, folder_id) VALUES ('$id', '$user', '$name', '$img', '$img2', '$form', '$folder')");

                    if ($mysqli->error)
                        echo "An error occurred, please contact the site administrator.";
                    else 
                        echo "Your character was saved!"; 
                }
                $mysqli->close();
            }
        }
        else
            echo "You are not logged in.";   
    }
    else
        header("Location: /not_found");
    exit;
?>