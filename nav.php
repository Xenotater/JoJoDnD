<?php
    if ($_POST["action"] != "nav") 
    {
        header("Location: /");
        exit;
    }
?>
<!-- common navbar file -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Navbar</title>
        <meta charset="utf-8">
    </head>
    <body>
        <!-- navbar icons modified from https://freeicons.io/ -->
        <!-- expandable navbar code modified from https://www.w3schools.com/bootstrap4/bootstrap_navbar.asp -->
        <nav class="navbar navbar-expand-custom sticky-top">
            <div class="container-fluid">
                <div class="navigator" id="home">
                    <a href="/" class="nav-link nomargin">
                        <img src="/Assets/icon.png" id="home-logo">
                    </a>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsible">
                    <span class="bi bi-list"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="collapsible">
                    <ul class="navbar-nav">
                        <li class="nav-item navigator" id="rules">
                            <a class="nav-link" href="/rules">
                                <img src="/Assets/list.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Rules
                            </a>
                        </li>
                        <li class="nav-item navigator" id="passions">
                            <a class="nav-link" href="/passions">
                                <img src="/Assets/pencil.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Passions
                            </a>
                        </li>
                        <li class="nav-item navigator" id="races">
                            <a class="nav-link" href="/races">
                                <img src="/Assets/person.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Races
                            </a>
                        </li>
                        <li class="nav-item navigator" id="classes">
                            <a class="nav-link" href="/classes">
                                <img src="/Assets/muscle.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Classes
                            </a>
                        </li>
                        <li class="nav-item navigator" id="abilities">
                            <a class="nav-link" href="/abilities">
                                <img src="/Assets/stars.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Abilities
                            </a>
                        </li>
                        <li class="nav-item navigator" id="feats">
                            <a class="nav-link" href="/feats">
                                <img src="/Assets/ribbon.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Feats
                            </a>
                        </li>
                        <li class="nav-item navigator" id="weapons">
                            <a class="nav-link" href="/weapons">
                                <img src="/Assets/swords.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Weapons
                            </a>
                        </li>
                        <li class="nav-item navigator" id="artifacts">
                            <a class="nav-link" href="/artifacts">
                                <img src="/Assets/exclamation.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Artifacts
                            </a>
                        </li>
                        <li class="nav-item navigator" id="resources">
                            <a class="nav-link" href="/resources">
                                <img src="/Assets/gear.png" class="img-fluid barImg">
                                <br class="nav-text-break">
                                Resources
                            </a>
                        </li>
                    </ul>
                  </div>
            </div>
        </nav>
    </body>
</html>
