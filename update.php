<?php
  if ($_POST["action"] != "update") {
    header("Location: /");
    exit;
  }

  if (session_start() && $_SESSION["checkedUpdate"])
  exit;

  $_SESSION["checkedUpdate"] = true;

  $version = $_POST["version"];
  $latest = "1.13.0.1";

  if ($version != $latest) {
    header("Clear-Site-Data: \"cache\"");
    echo "updated";
  }

  exit;
?>