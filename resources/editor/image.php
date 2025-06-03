<?php
    if ($_POST["action"] == "image")  {
        if (session_start() && !empty($_SESSION["loggedin"])) {
            $mysqli = new mysqli("localhost", getenv('DB_USER'), getenv('DB_PASS'), "JoJoDnD");

            if(!$mysqli->connect_error) {
                $user = $_SESSION["loggedin"];
                $id = $_POST["id"];
                
                $result = $mysqli->query("SELECT img FROM characters WHERE id = '$id'");
                if ($result->num_rows == 1) {
                  $img = $result->fetch_assoc()["img"];
                  if ($img != "" && $img != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")
                    echo $img;
                  else
                    echo "../Assets/.default.webp";
                }
                else
                  echo "../Assets/.default.webp";

                $result->close();
                $mysqli->close();
            }
        }
    }
    else
        header("Location: /not_found");
    exit;
?>