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
                    $user = $_SESSION["loggedin"];
                    if ($user == "admin")
                        $result = $mysqli->query("SELECT * FROM characters");
                    else
                        $result = $mysqli->query("SELECT * FROM characters WHERE username = '$user'");
                    $characters = array();
                    while ($row = $result->fetch_assoc()) {
                        $characters[] = array("ID"=>$row["id"], "Username"=>$row["username"], "Name"=>$row["name"], "Image"=>$row["img"], "Data"=>$row["data"]);
                    }
                    $result->close();
			        $mysqli->close();
                }
                echo "<h1 id='greeting'>" . $user . "'s Saved Characters</h1>";
            }
        ?>
        <div id='chars'>
            <?php
                for ($i = 0; $i < count($characters); $i++) {
                    $id = $characters[$i]["ID"];
                    echo "<div class='charCard' id='char" . $id . "'>";
                    echo "<i class='bi bi-three-dots-vertical' id='opt" . $id . "'></i><div class='drop' id='drop" . $id . "'>";
                    echo "<a href='#'>Rename</a><a href='#'>Duplicate</a><a href='#'>Delete</a></div>";
                    echo "<div class='loadBox'>";
                    if ($characters[$i]["Image"] == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
                        $characters[$i]["Image"] = "../Assets/default.png";
                    if ($user == "admin") {
                        echo "<img class='charImgA' src='" . $characters[$i]["Image"] . "' alt='charImg'>";
                        echo "<p class='charInfo'>" . $characters[$i]["Username"] . "<br>" . $characters[$i]["Name"] . "</p>";
                    }
                    else {
                        echo "<img class='charImg' src='" . $characters[$i]["Image"] . "' alt='charImg'>";
                        echo "<span class='charName'>". $characters[$i]["Name"] . "</span>";
                    }
                    echo "</div></div>";
                }
                echo "<div class='center' id='newChar'><h2><b><i class='bi bi-plus-square'></i></b></h2></div>";
            ?>
        </div>
    </body>
</html>