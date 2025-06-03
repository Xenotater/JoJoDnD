<?php
if ($_POST["action"] == "new") {
    if (session_start() && !empty($_SESSION["loggedin"])) {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if (!$mysqli->connect_error) {
            $user = $_SESSION["loggedin"];
            $folder = $_POST["folder"];

            if ($user == "admin") {
                echo "The admin may not use this operation.";
                exit;
            }

            $copyFound = true;
            $count = 1;
            $name = "New Folder";
            while ($copyFound) {
                $result = $mysqli->query("SELECT id FROM folders WHERE username = '$user' AND parent_id = '$folder' AND name = '$name'");
                if ($result->num_rows == 0)
                    $copyFound = false;
                else
                    $name = "New Folder " . ++$count;
            }
            $result->close();

            $mysqli->query("INSERT INTO folders (name, username, parent_id) VALUES ('$name', '$user', '$folder')");

            if ($mysqli->error || $mysqli->affected_rows != 1)
                echo "An error occurred, please contact the site administrator.";

            $mysqli->close();
        } else
            echo "An error occurred, please contact the site administrator.";
    } else
        echo "You are not logged in.";
} else
    header("Location: /not_found");
exit;