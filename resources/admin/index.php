<!-- admin page to view contacts -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Admin</title>
        <meta charset="utf-8">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
        <link href="https://cdn.jsdelivr.net/gh/coliff/bootstrap-rfs/bootstrap-rfs.css" rel="stylesheet">

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
            if (empty($_SESSION["loggedin"])) {
                header("Location: ../index.html");
                exit;
            }
        ?>
    </body>
</html>