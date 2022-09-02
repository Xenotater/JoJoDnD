<!DOCTYPE html>
<!-- admin page to view contacts through mysql -->
<html lang="en">
    <head>
        <title>Admin | JoJo D&D</title>
        <meta charset="utf-8">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
        <link href="https://cdn.jsdelivr.net/gh/coliff/bootstrap-rfs/bootstrap-rfs.css" rel="stylesheet">

        <link rel="stylesheet" href="/jojodnd.css">
        <link rel="stylesheet" href="admin.css">

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="admin.js"></script>
    </head>
    <body>
        <button id="back"><i class="bi bi-box-arrow-left"></i></i> Back to Site</button>
        <?php
            if (!session_start() || $_GET["err"] == true) {
                echo "<h1 id='err'>Couldn't Verify Session, Please Contact the Site Admin.</h1>";
            }
            else {
                if (empty($_SESSION["loggedin"])) {
                    header("Location: logout.php");
                    exit;
                }
                $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

                if($mysqli->connect_error) {
                    echo "<h5 id='err'>Couldn't connect to database, please contact the site administrator.</h5>";
                }
                else {
                    $result = $mysqli->query("SELECT * FROM contactData");
                    $contacts = array();
                    while ($row = $result->fetch_assoc()) {
                        $contacts[] = array("ID"=>$row["id"],"Name"=>$row["name"],"Email"=>$row["email"],"Subject"=>$row["subject"],"Comment"=>$row["comment"]);
                    }
                    $result->close();
			        $mysqli->close();
                }
            }
        ?>
        <table class="table table-primary table-striped" id="contacts">
            <thead>
                <tr id='welcome'>
                    <th colspan='5'>
                        <?php echo "Welcome " . $_SESSION["loggedin"]; ?>
                    </th>
                </tr>
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                        Subject
                    </th>
                    <th colspan='2'>
                        Comment
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php 
                    for ($i = 0; $i < count($contacts); $i++) {
                        echo "<tr class='contact' id='contact" . $contacts[$i]["ID"] . "'>";
                        foreach($contacts[$i] as $c => $c_val) {
                            if ($c != "ID")
                                echo "<td>$c_val</td>";
                        }
                        echo "<td class='delete'><i class='bi bi-trash'></i></td>";
                        echo "</tr>";
                    }
                ?>
            </tbody>
        </table>
    </body>
</html>