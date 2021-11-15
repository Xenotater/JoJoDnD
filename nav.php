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
                <div class="navigator" id="home">
                    <img src="Assets/icon.png" id="home-logo">
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsible">
                    <span class="bi bi-list"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="collapsible">
                    <ul class="navbar-nav">
                        <li class="nav-item navigator" id="rules">
                            <p class="nav-link">
                                <img src="Assets/list.png" class="img-fluid barImg">
                                <br>
                                Rules
                            </p>
                        </li>
                        <li class="nav-item navigator" id="passions">
                            <p class="nav-link">
                                <img src="Assets/pencil.png" class="img-fluid barImg">
                                <br>
                                Passions
                            </p>
                        </li>
                        <li class="nav-item navigator" id="races">
                            <p class="nav-link">
                                <img src="Assets/person.png" class="img-fluid barImg">
                                <br>
                                Races
                            </p>
                        </li>
                        <li class="nav-item navigator" id="classes">
                            <p class="nav-link">
                                <img src="Assets/muscle.png" class="img-fluid barImg">
                                <br>
                                Classes
                            </p>
                        </li>
                        <li class="nav-item navigator" id="abilities">
                            <p class="nav-link">
                                <img src="Assets/stars.png" class="img-fluid barImg">
                                <br>
                                Abilities
                            </p>
                        </li>
                        <li class="nav-item navigator" id="feats">
                            <p class="nav-link">
                                <img src="Assets/ribbon.png" class="img-fluid barImg">
                                <br>
                                Feats
                            </p>
                        </li>
                        <li class="nav-item navigator" id="weapons">
                            <p class="nav-link">
                                <img src="Assets/swords.png" class="img-fluid barImg">
                                <br>
                                Weapons
                            </p>
                        </li>
                        <li class="nav-item navigator" id="artifacts">
                            <p class="nav-link">
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
