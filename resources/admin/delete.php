<?php
    if ($_POST["action"] == "del") {
        $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h1 id='err'>Couldn't connect to database, please contact the site administrator.</h1>";
        }
        else {
            $id = $_POST["id"];

            $mysqli->query("DELETE FROM contactData WHERE id=$id");

            if ($mysqli->error)
                echo "<h1 id='err'>An error occurred, please contact the site administrator.</h1><p>{$mysqli->error}</p>";
            $mysqli->close();
        }
    }
    else
        header("Location: ../");
    exit;
?>