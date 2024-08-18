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
            $folder = $_POST["folder"];

            $count = 0;

            if ($user == "admin") {
                $result = $mysqli->query("SELECT COUNT(id) as count FROM characters WHERE name LIKE '%$query%' OR username LIKE '%$query%'");
                $count += intval($result->fetch_assoc()["count"]);
            }
            else {
                $result = $mysqli->query("SELECT COUNT(id) as count FROM characters WHERE username = '$user' AND name LIKE '%$query%' AND folder_id = $folder");
                $count += intval($result->fetch_assoc()["count"]);
                $result = $mysqli->query("SELECT COUNT(id) as count FROM folders WHERE username = '$user' AND name LIKE '%$query%' AND parent_id = '$folder'");
                $count += intval($result->fetch_assoc()["count"]);
            }
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
            $folder = $_POST["folder"];
            $folders = array();
            $characters = array();

            if (empty($_POST["search"]))
                $query = "%";
            else
                $query = $_POST["search"];

            $limit = 11;
            $f_offset = $_POST["f_offset"];
            $c_offset = $_POST["c_offset"];

            if ($user != "admin") {
                $result = $mysqli->query("SELECT id, name FROM folders WHERE username = '$user'AND name LIKE '%$query%' AND parent_id = '$folder' LIMIT $limit OFFSET $f_offset");
                while ($row = $result->fetch_assoc())
                    $folders[] = array("ID"=>$row["id"], "Name"=>$row["name"]);
                $limit -= count($folders);
            }

            if ($user == "admin")
                $result = $mysqli->query("SELECT id, username, name, img FROM characters WHERE name LIKE '%$query%' OR username LIKE '%$query%' LIMIT 11 OFFSET " . $c_offset);
            else if ($limit > 0)
                $result = $mysqli->query("SELECT id, username, name, img FROM characters WHERE username = '$user' AND name LIKE '%$query%' AND folder_id = $folder LIMIT $limit OFFSET " . $c_offset);
            while ($row = $result->fetch_assoc()) {
                $characters[] = array("ID"=>$row["id"], "Username"=>$row["username"], "Name"=>$row["name"], "Image"=>$row["img"]);
            }
            $result->close();
            $mysqli->close();
        }
    }
    ?>
        <h1 id='greeting'><?php echo htmlspecialchars($user); ?>'s Saved Characters</h1>
        <p id='folderpath'></p>
        <div id='chars'>
        <?php for ($i = 0; $i < count($folders); $i++) { $id = $folders[$i]["ID"] ?>
            <div class='charCard folder' id='fold<?php echo $id; ?>'>
                <i class='bi bi-three-dots-vertical' id='fold-opt<?php echo $id; ?>'></i><div class='drop' id='fold-drop<?php echo $id; ?>'>
                <a href='#'>Rename</a><a href='#'>Move</a><a href='#'>Duplicate</a><a href='#'>Delete</a></div>
                <div class='foldLoadBox'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-fill charImg folderImg" viewBox="0 0 16 16">
                        <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z"/>
                    </svg>
                    <p class='charName'><?php echo $folders[$i]["Name"]; ?></p>
                </div>
            </div>
        <?php } ?>
        <?php for ($i = 0; $i < count($characters); $i++) {
            $id = htmlspecialchars($characters[$i]["ID"]); ?>
            <div class='charCard character' id='char<?php echo $id; ?>'>
            <i class='bi bi-three-dots-vertical' id='opt<?php echo $id; ?>'></i><div class='drop' id='drop<?php echo $id; ?>'>
            <a href='#'>Rename</a><a href='#'>Move</a><a href='#'>Duplicate</a><a href='#'>Delete</a></div>
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