<?php
if ($_POST["action"] == "del") {
    if (session_start() && !empty($_SESSION["loggedin"])) {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if (!$mysqli->connect_error) {
            $user = $_SESSION["loggedin"];
            $id = $_POST["id"];
            $folder = $_POST["folder"];
            $isFold = $_POST["isFolder"];

            if ($isFold == "true" && $id == "0") {
                echo "The root folder may not be deleted.";
                exit;
            }

            if ($isFold == "true") {
                function delFold($foldId, $user, $mysqli)
                {
                    $mysqli->query("DELETE FROM folders WHERE username = '$user' AND id = '$foldId'");
                    $mysqli->query("DELETE FROM characters WHERE username = '$user' AND folder_id = '$foldId'");

                    $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND parent_id = '$foldId'");
                    while ($row = $result->fetch_assoc()) {
                        $id = $row["id"];
                        delFold($id, $user, $mysqli);
                    }

                    $result->close();
                }
                delFold($id, $user, $mysqli);

                if ($mysqli->error)
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your folder was deleted!";
            } else {
                if ($user == "admin")
                    $mysqli->query("DELETE FROM characters WHERE id = '$id'");
                else
                    $mysqli->query("DELETE FROM characters WHERE username = '$user' AND id = '$id'");

                if ($mysqli->error)
                    echo "An error occurred, please contact the site administrator.";
                else
                    echo "Your character was deleted!";
            }
            $mysqli->close();
        } else
            echo "An error occurred, please contact the site administrator.";
    } else
        echo "You are not logged in.";
} else
    header("Location: /not_found");
exit;
