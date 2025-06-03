<?php
if ($_POST["action"] == "move") {
    if (session_start() && !empty($_SESSION["loggedin"])) {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if (!$mysqli->connect_error) {
            $user = $_SESSION["loggedin"];
            $id = $_POST["id"];
            $foldName = $_POST["newFold"];
            $folder = $_POST["folder"];
            $isFold = $_POST["isFolder"];
            $goBack = $_POST["goBack"];

            if ($user == "admin") {
                echo "The admin may not use this operation.";
                exit;
            }

            if ($isFold == "true" && $id == "0") {
                echo "The root folder may not be moved.";
                exit;
            }

            if ($goBack == "true") {
                $result = $mysqli->query("SELECT parent_id FROM folders WHERE username = '$user' AND id = '$folder'");
                if ($result->num_rows == 1) {
                    $parent = $result->fetch_assoc()["parent_id"];

                    if ($isFold == "true") {
                        $result = $mysqli->query("SELECT name FROM folders WHERE id = '$id'");
                        $name = $result->fetch_assoc()["name"];
                        $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND name = '$name' AND parent_id = '$parent'");
                        if ($result->num_rows > 0) {
                            echo "A folder with that name already exists there.";
                        } else {
                            $mysqli->query("UPDATE folders SET parent_id = '$parent' WHERE username = '$user' AND id = '$id'");

                            if ($mysqli->error || $mysqli->affected_rows != 1)
                                echo "An error occurred, please contact the site administrator.";
                            else
                                echo "Your folder was moved!";
                        }
                    } else {
                        $mysqli->query("UPDATE characters SET folder_id = '$parent' WHERE username = '$user' AND id = '$id'");

                        if ($mysqli->error || $mysqli->affected_rows != 1)
                            echo "An error occurred, please contact the site administrator.";
                        else
                            echo "Your character was moved!";
                    }
                } else
                    echo "An error occurred, please contact the site administrator.";
                $result->close();
            } else {
                $result = $mysqli->query("SELECT id FROM folders WHERE name = '$foldName' AND username = '$user' AND parent_id = '$folder'");
                if ($result->num_rows == 0) {
                    $mysqli->query("INSERT INTO folders (name, username, parent_id) VALUES ('$foldName', '$user', '$folder')");
                    $newId = $mysqli->insert_id;
                } else
                    $newId = $result->fetch_assoc()["id"];
                $result->close();

                if ($isFold == "true") {
                    $result = $mysqli->query("SELECT name FROM folders WHERE id = '$id'");
                    $name = $result->fetch_assoc()["name"];
                    $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND name = '$name' AND parent_id = '$newId'");
                    if ($result->num_rows > 0) {
                        echo "A folder with that name already exists there.";
                    } else {
                        if ($newId == $id) {
                            $mysqli->query("INSERT INTO folders (name, username, parent_id) VALUES ('$foldName', '$user', '$folder')");
                            $newId = $mysqli->insert_id;
                        }

                        $mysqli->query("UPDATE folders SET parent_id = '$newId' WHERE username = '$user' AND id = '$id'");

                        if ($mysqli->error || $mysqli->affected_rows != 1)
                            echo "An error occurred, please contact the site administrator.";
                        else
                            echo "Your folder was moved!";
                    }
                    $result->close();
                } else {
                    $mysqli->query("UPDATE characters SET folder_id = '$newId' WHERE username = '$user' AND id = '$id'");

                    if ($mysqli->error || $mysqli->affected_rows != 1)
                        echo "An error occurred, please contact the site administrator.";
                    else
                        echo "Your character was moved!";
                }
            }
            $mysqli->close();
        } else
            echo "An error occurred, please contact the site administrator.";
    } else
        echo "You are not logged in.";
} else
    header("Location: /not_found");
exit;
