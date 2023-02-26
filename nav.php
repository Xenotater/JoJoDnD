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
        <meta name="description" content="Navagation bar for all pages.">
    </head>
    <body>
        <!-- navbar icons modified from https://freeicons.io/ -->
        <!-- expandable navbar code modified from https://www.w3schools.com/bootstrap4/bootstrap_navbar.asp -->
        <nav class="navbar navbar-expand-custom">
            <div class="container-fluid">
                <div class="navigator" id="home">
                    <a href="/" class="nav-link nomargin">
                        <img src="/Assets/icon.webp" id="home-logo" alt="home_link">
                    </a>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsible">
                    <span class="bi bi-list"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="collapsible">
                    <ul class="navbar-nav">
                        <li class="nav-item navigator" id="rules">
                            <a class="nav-link" href="/rules">
                                <img src="/Assets/list.webp" class="img-fluid barImg" alt="rules_link">
                                <br class="nav-text-break">
                                Rules
                            </a>
                        </li>
                        <li class="nav-item navigator" id="passions">
                            <a class="nav-link" href="/passions">
                                <img src="/Assets/pencil.webp" class="img-fluid barImg" alt="passions_link">
                                <br class="nav-text-break">
                                Passions
                            </a>
                        </li>
                        <li class="nav-item navigator" id="races">
                            <a class="nav-link" href="/races">
                                <img src="/Assets/person.webp" class="img-fluid barImg" alt="races_link">
                                <br class="nav-text-break">
                                Races
                            </a>
                        </li>
                        <li class="nav-item navigator" id="classes">
                            <a class="nav-link" href="/classes">
                                <img src="/Assets/muscle.webp" class="img-fluid barImg" alt="classes_link">
                                <br class="nav-text-break">
                                Classes
                            </a>
                        </li>
                        <li class="nav-item navigator" id="abilities">
                            <a class="nav-link" href="/abilities">
                                <img src="/Assets/stars.webp" class="img-fluid barImg" alt="abilities_link">
                                <br class="nav-text-break">
                                Abilities
                            </a>
                        </li>
                        <li class="nav-item navigator" id="feats">
                            <a class="nav-link" href="/feats">
                                <img src="/Assets/ribbon.webp" class="img-fluid barImg" alt="feats_link">
                                <br class="nav-text-break">
                                Feats
                            </a>
                        </li>
                        <li class="nav-item navigator" id="weapons">
                            <a class="nav-link" href="/weapons">
                                <img src="/Assets/swords.webp" class="img-fluid barImg" alt="weapons_link">
                                <br class="nav-text-break">
                                Weapons
                            </a>
                        </li>
                        <li class="nav-item navigator" id="artifacts">
                            <a class="nav-link" href="/artifacts">
                                <img src="/Assets/exclamation.webp" class="img-fluid barImg" alt="artifacts_link">
                                <br class="nav-text-break">
                                Artifacts
                            </a>
                        </li>
                        <li class="nav-item navigator" id="resources">
                            <a class="nav-link" href="/resources">
                                <img src="/Assets/pages.webp" class="img-fluid barImg" alt="resources_link">
                                <br class="nav-text-break">
                                Resources
                            </a>
                        </li>
                    </ul>
                  </div>
            </div>
        </nav>
        <div id="filler"></div>
        <?php
        if ($_POST["ads"] == "true") {
            echo
                '<div class="header-ad">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4282768297104356"
                crossorigin="anonymous"></script>
                    <!-- In-Page Ad -->
                    <ins class="adsbygoogle"
                        style="display:block"
                        data-ad-client="ca-pub-4282768297104356"
                        data-ad-slot="7014054509"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                    <script>
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>';
        }
        ?>
    </body>
</html>
