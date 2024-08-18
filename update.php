<?php
  if ($_POST["action"] != "update") {
    header("Location: /");
    exit;
  }

  $version = $_POST["version"];
  $latest = "1.12.1.6";

  if ($version != $latest) {
    header("Clear-Site-Data: \"cache\"");
    echo "updated";
  }

  exit;
?>