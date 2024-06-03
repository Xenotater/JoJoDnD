<?php
    //ini_set('display_errors', 'on');      //for debugging
    //error_reporting(E_ALL);
    if ($_POST["action"] != "chars" && $_POST["action"] != "count") 
    {
        header("Location: /not_found");
        exit;
    }

    if (!session_start() || empty($_SESSION["loggedin"])) {
        echo "<h1 id='err'>Log in to save and load characters.</h1>";
        exit;
    }
    else if ($_POST["action"] == "count") {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h5 id='err'>Couldn't connect to database, please contact the site administrator.</h5>";
            exit;
        }
        else {
            $user = $_SESSION["loggedin"];
            $query = $_POST["search"];

            if ($user == "admin")
                $result = $mysqli->query("SELECT COUNT(id) as count FROM characters WHERE name LIKE '%$query%' OR username LIKE '%$query%'");
            else
                $result = $mysqli->query("SELECT COUNT(id) as count FROM characters WHERE username = '$user' AND name LIKE '%$query%'");
            $count = $result->fetch_assoc()["count"];
            $result->close();
            $mysqli->close();
            echo $count;
        }
        exit;
    }
    else {
        $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h5 id='err'>Couldn't connect to database, please contact the site administrator.</h5>";
            exit;
        }
        else {
            $user = $_SESSION["loggedin"];
            $characters = array();

            if (empty($_POST["search"]))
                $query = "%";
            else
                $query = $_POST["search"];

            if ($user == "admin")
                $result = $mysqli->query("SELECT id, username, name, img FROM characters WHERE name LIKE '%$query%' OR username LIKE '%$query%' LIMIT 11 OFFSET " . $_POST["offset"]);
            else
                $result = $mysqli->query("SELECT id, username, name, img FROM characters WHERE username = '$user' AND name LIKE '%$query%' LIMIT 11 OFFSET " . $_POST["offset"]);
            while ($row = $result->fetch_assoc()) {
                $characters[] = array("ID"=>$row["id"], "Username"=>$row["username"], "Name"=>$row["name"], "Image"=>$row["img"]);
            }
            $result->close();
            $mysqli->close();
        }
    }
    ?>
        <h1 id='greeting'><?php echo htmlspecialchars($user); ?>'s Saved Characters</h1>
        <div id='chars'>
        <?php for ($i = 0; $i < count($characters); $i++) {
            $id = htmlspecialchars($characters[$i]["ID"]); ?>
            <div class='charCard' id='char<?php echo $id; ?>'>
            <i class='bi bi-three-dots-vertical' id='opt<?php echo $id; ?>'></i><div class='drop' id='drop<?php echo $id; ?>'>
            <a href='#'>Rename</a><a href='#'>Duplicate</a><a href='#'>Delete</a></div>
            <div class='loadBox'>
            <?php if ($characters[$i]["Image"] == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
                $characters[$i]["Image"] = "../Assets/.default.webp";
            if ($user == "admin") { ?>
                <img class='charImgA' src='<?php echo htmlspecialchars($characters[$i]["Image"]); ?>' alt='charImg'>
                <p class='charInfo'><?php echo htmlspecialchars($characters[$i]["Username"]); ?><br><?php echo htmlspecialchars($characters[$i]["Name"]); ?></p>
            <?php }
            else { ?>
                <img class='charImg' src='<?php echo htmlspecialchars($characters[$i]["Image"]); ?>' alt='charImg'>
                <p class='charName'><?php echo htmlspecialchars($characters[$i]["Name"]); ?></p>
            <?php } ?>
            </div></div>
        <?php } ?>
        <div class='center' id='newChar'><h2><b><i class='bi bi-plus-square'></i></b></h2></div></div>