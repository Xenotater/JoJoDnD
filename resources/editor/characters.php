<?php
    if ($_POST["action"] != "chars") 
    {
        header("Location: /not_found");
        exit;
    }

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
    }
    ?>
        <h1 id='greeting'><?php echo $user; ?>'s Saved Characters</h1>
        <div id='chars'>
        <?php for ($i = 0; $i < count($characters); $i++) {
            $id = $characters[$i]["ID"]; ?>
            <div class='charCard' id='char<?php echo $id; ?>'>
            <i class='bi bi-three-dots-vertical' id='opt<?php echo $id; ?>'></i><div class='drop' id='drop<?php echo $id; ?>'>
            <a href='#'>Rename</a><a href='#'>Duplicate</a><a href='#'>Delete</a></div>
            <div class='loadBox'>
            <?php if ($characters[$i]["Image"] == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
                $characters[$i]["Image"] = "../Assets/default.png";
            if ($user == "admin") { ?>
                <img class='charImgA' src='<?php echo $characters[$i]["Image"]; ?>' alt='charImg'>
                <p class='charInfo'><?php echo $characters[$i]["Username"]; ?><br><?php echo $characters[$i]["Name"]; ?></p>
            <?php }
            else { ?>
                <img class='charImg' src='<?php echo $characters[$i]["Image"]; ?>' alt='charImg'>
                <p class='charName'><?php echo $characters[$i]["Name"]; ?></p>
            <?php } ?>
            </div></div>
        <?php } ?>
        <div class='center' id='newChar'><h2><b><i class='bi bi-plus-square'></i></b></h2></div></div>