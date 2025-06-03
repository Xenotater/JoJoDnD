<?php
if ($_POST["action"] == "dupe") {
    if (session_start() && !empty($_SESSION["loggedin"])) {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if (!$mysqli->connect_error) {
            $user = $_SESSION["loggedin"];
            $id = $_POST["id"];
            $folder = $_POST["folder"];
            $isFold = $_POST["isFolder"];

            if ($isFold == "true" && $id == "0") {
                echo "The root folder may not be duplicated.";
                exit;
            }

            if ($isFold == "true") {
                function dupeFold($foldId, $user, $parent, $mysqli)
                {
                    $result = $mysqli->query("SELECT username, name FROM folders WHERE username = '$user' AND id = '$foldId'");
                    if ($result->num_rows == 1) {
                        $row = $result->fetch_assoc();
                        $name = $row["name"];

                        $copyFound = true;
                        while ($copyFound) {
                            $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND parent_id = '$parent' AND name = '$name'");
                            if ($result->num_rows == 0)
                                $copyFound = false;
                            else
                                $name = $name . "-copy";
                        }

                        $mysqli->query("INSERT INTO folders (username, name, parent_id) VALUES ('$user', '$name', '$parent')");
                        $newId = $mysqli->insert_id;

                        $result = $mysqli->query("SELECT name, img, img2, data, acts FROM characters WHERE username = '$user' AND folder_id = '$foldId'");
                        while ($row = $result->fetch_assoc()) {
                            $name = $row["name"];
                            $img = $row["img"];
                            $img2 = $row["img2"];
                            $data = $row["data"];
                            $acts = $row["acts"];
                            $mysqli->query("INSERT INTO characters (username, name, img, img2, data, acts, folder_id) VALUES ('$user', '$name', '$img', '$img2', '$data', '$acts', '$newId')");
                        }

                        $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND parent_id = '$foldId'");
                        while ($row = $result->fetch_assoc()) {
                            $id = $row["id"];
                            dupeFold($id, $user, $newId, $mysqli);
                        }
                    }
                    $result->close();
                }
                dupeFold($id, $user, $folder, $mysqli);

                if ($mysqli->error)
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your folder was duplicated!";
            } else {
                if ($user == "admin")
                    $mysqli->query("INSERT INTO characters (username, name, img, img2, data, acts, folder_id) SELECT username, name, img, img2, data, acts, folder_id FROM characters WHERE id = '$id'");
                else
                    $mysqli->query("INSERT INTO characters (username, name, img, img2, data, acts, folder_id) SELECT username, name, img, img2, data, acts, folder_id FROM characters WHERE username = '$user' AND id = '$id'");

                if ($mysqli->error)
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your character was duplicated!";
            }
            $mysqli->close();
        } else
            echo "An error occurred, please contact the site administrator.";
    } else
        echo "You are not logged in.";
} else
    header("Location: /not_found");
exit;
