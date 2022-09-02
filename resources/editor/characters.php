<?php
    if ($_POST["action"] != "chars") 
    {
        header("Location: /not_found");
        exit;
    }
?>
<!DOCTYPE html>
<!-- admin page to view contacts through mysql -->
<html lang="en">
    <head>
        <title>Characters | JoJo D&D</title>
        <meta charset="utf-8">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
        <link href="https://cdn.jsdelivr.net/gh/coliff/bootstrap-rfs/bootstrap-rfs.css" rel="stylesheet">

        <link rel="stylesheet" href="/jojodnd.css">
        <link rel="stylesheet" href="characters.css">

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="characters.js"></script>
    </head>
    <body>
        <?php
            if (!session_start() || empty($_SESSION["loggedin"])) {
                echo "<h1 id='err'>Log in to save and load characters.</h1>";
                exit;
            }
            else {
                $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

                if($mysqli->connect_error) {
                    echo "<h5 id='err'>Couldn't connect to database, please contact the site administrator.</h5>";
                    exit;
                }
                else {
                    $result = $mysqli->query("SELECT * FROM characters");
                    $characters = array();
                    while ($row = $result->fetch_assoc()) {
                        $characters[] = array("ID"=>$row["id"], "Username"=>$row["username"], "Name"=>$row["name"], "Image"=>$row["img"], "Data"=>$row["data"]);
                    }
                    $result->close();
			        $mysqli->close();
                }
                echo "<h1 id='greeting'>Welcome " . $_SESSION["loggedin"] . "</h1>";
            }
        ?>
        <div id='chars'>
            <?php
                for ($i = 0; $i < count($characters); $i++) {
                    $id = $characters[$i]["ID"];
                    echo "<div class='loadChar' id='char" . $id . "'>";
                    echo "<p>Name: " . $characters[$i]["Name"] . ", Username: " . $characters[$i]["Username"] . "<p><img class='charImg' src='" . $characters[$i]["Image"] . "' alt='charImg'>";
                    echo "</div>";
                }
            ?>
        </div>
    </body>
</html>