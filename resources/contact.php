<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require 'Assets/Composer/vendor/autoload.php';

    if ($_POST["action"] == "send")  {
        $mysqli = new mysqli("localhost", "kyler", "dbadmin", "JoJoDnD");

        if($mysqli->connect_error) {
            echo "<h5 id='response-text'>Couldn't connect to database, please contact the site administrator.</h5>";
        }
        else {
            $name = $mysqli->real_escape_string($_POST["name"]);
            $subject = $mysqli->real_escape_string($_POST["subject"]);
            $email = $mysqli->real_escape_string($_POST["email"]);
            $comment = $mysqli->real_escape_string($_POST["comment"]);
            $comment = str_replace("\\n", "<br>", $comment);

            //email code from https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-using-smtp-php.html
            $sender = 'no-reply@contact.jojodnd.com';
            $senderName = 'JoJoD&D.com';
            $recipient = 'jojosdnd@gmail.com';
            $usernameSmtp = 'AKIA3EDAMVZZ5AC4OHTG';
            $passwordSmtp = 'BE4DRvVPrTkOEEsQCXyfuo+7zO0a0D2UpXsWB/j89Nf9';
            $host = 'email-smtp.us-east-1.amazonaws.com';
            $port = 587;

            $bodyText = "Contact from \"" . $name . "\"";
            if (!empty($email))
                $bodyText .= " with return address \"" . $email . "\"";
            $bodyText .= "\r\n" . $comment;

            $bodyHtml = "<h2>Contact from \"" . $name . "\"";
            if (!empty($email))
                $bodyHtml .= " with return address \"" . $email . "\"";
            $bodyHtml .= "</h2><p>" . $comment . "</p>";

            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->setFrom($sender, $senderName);
                $mail->Username   = $usernameSmtp;
                $mail->Password   = $passwordSmtp;
                $mail->Host       = $host;
                $mail->Port       = $port;
                $mail->SMTPAuth   = true;
                $mail->SMTPSecure = 'tls';

                $mail->addAddress($recipient);

                $mail->isHTML(true);
                $mail->Subject    = $subject;
                $mail->Body       = $bodyHtml;
                $mail->AltBody    = $bodyText;
                $mail->Send();
            } catch (phpmailerException $e) {
                echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5><p>{$e->errorMessage()}</p>";
            } catch (Exception $e) {
                echo "<h5 id='response-text'>Response not submitted.</h5><p>{$mail->ErrorInfo}</p>";
            }
        }

        $mysqli->query("INSERT INTO contactData (name, email, subject, comment) VALUES ('$name', '$email', '$subject', '$comment')");

        if ($mysqli->error)
            echo "<h5 id='response-text'>An error occurred, please contact the site administrator.</h5><p>{$mysqli->error}</p>";
        else 
            echo "<h5 id='response-text'>Your response was submitted!</h5>"; 
        $mysqli->close();
    }
    else
        header("Location: ../");
    exit;
?>