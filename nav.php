<?php
    $path = "";
    if ($_POST["home"] == true)
        $path = "../"
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Template</title>
        <meta charset="utf-8">
    </head>
    <body>
    <div class="container-fluid" id="disclaim">
            <small>This site's construction is in progress! Expect missing pages/information.</small>
        </div>

        <!-- navbar icons modified from https://freeicons.io/ -->
        <nav class="navbar navbar-expand-custom sticky-top">
            <div class="container-fluid">
                <div id="home-link">
                    <img src="Assets/icon.png" id="home-logo">
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsible">
                    <span class="bi bi-list"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="collapsible">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <p class="nav-link" id="rules">
                                <img src="Assets/list.png" class="img-fluid barImg">
                                <br>
                                Rules
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="passions">
                                <img src="Assets/pencil.png" class="img-fluid barImg">
                                <br>
                                Passions
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="races">
                                <img src="Assets/person.png" class="img-fluid barImg">
                                <br>
                                Races
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="classes">
                                <img src="Assets/muscle.png" class="img-fluid barImg">
                                <br>
                                Classes
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="abilities">
                                <img src="Assets/stars.png" class="img-fluid barImg">
                                <br>
                                Abilities
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="feats">
                                <img src="Assets/ribbon.png" class="img-fluid barImg">
                                <br>
                                Feats
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="weapons">
                                <img src="Assets/swords.png" class="img-fluid barImg">
                                <br>
                                Weapons
                            </p>
                        </li>
                        <li class="nav-item">
                            <p class="nav-link" id="artifacts">
                                <img src="Assets/exclamation.png" class="img-fluid barImg">
                                <br>
                                Artifacts
                            </p>
                        </li>
                    </ul>
                  </div>
            </div>
        </nav>
    </body>
</html>
