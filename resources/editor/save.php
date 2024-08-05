<?php
    if ($_POST["action"] == "save")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

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
                $acts = $mysqli->real_escape_string($_POST["acts"]);

                if (strlen($img) + strlen($img2) + strlen($form) >= 536870912) {
                    echo "Character data is too large (0.5GB+). Please contact the site administrator if you believe this is an error.";
                    exit;
                }

                if ($name == "" || $img == "" || $img2 == "" || $form == "") {
                    echo "An error occurred, please contact the site administrator.";
                    exit;
                }

                if ($id == -1) {
                    $mysqli->query("INSERT INTO characters (username, name, img, img2, data, acts) VALUES ('$user', '$name', '$img', '$img2', '$form', '$acts')");

                    if ($mysqli->error)
                        echo "An error occurred, please contact the site administrator.";
                    else {
                        echo $mysqli->insert_id . "Your character was saved!</h5>"; //passing the new id back this way feels wrong
                    }
                }
                else {
                    if ($user == "admin")
                        $mysqli->query("UPDATE characters SET data = '$form', acts = '$acts', img = '$img', img2 = '$img2' WHERE id = '$id'");
                    else
                        $mysqli->query("UPDATE characters SET data = '$form', acts = '$acts', img = '$img', img2 = '$img2' WHERE username = '$user' AND id = '$id'");

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