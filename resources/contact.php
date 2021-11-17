<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Contact</title>
        <meta charset="utf-8">

        <link rel="stylesheet" href="resources.css">
    </head>
    <body>
        <?php
        //email code from https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-using-smtp-php.html
        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\Exception;
        require 'Assets/vendor/autoload.php';

        $sender = 'no-reply@contact.jojodnd.com';
        $senderName = 'JoJoD&D.com';
        $recipient = 'jojosdnd@gmail.com';
        $usernameSmtp = 'AKIA3EDAMVZZ5AC4OHTG';
        $passwordSmtp = 'BE4DRvVPrTkOEEsQCXyfuo+7zO0a0D2UpXsWB/j89Nf9';
        $host = 'email-smtp.us-east-1.amazonaws.com';
        $port = 587;

        $subject = $_GET["subject"];

        $bodyText = "Contact from \"" . $_GET["name"] . "\"";
        if (!empty($_GET["email"]))
            $bodyText .= " with return address \"" . $_GET["email"] . "\"";
        $bodyText .= "\r\n" . $_GET["comment"];

        $bodyHtml = "<h2>Contact from \"" . $_GET["name"] . "\"";
        if (!empty($_GET["email"]))
            $bodyHtml .= " with return address \"" . $_GET["email"] . "\"";
        $bodyHtml .= "</h2><p>" . $_GET["comment"] . "</p>";

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
            echo "<h5 id='response-text'>Your response was submitted!<h5>" , PHP_EOL;
        } catch (phpmailerException $e) {
            echo "<h5 id='response-text'>An error occurred.<h5><p>{$e->errorMessage()}</p>", PHP_EOL;
        } catch (Exception $e) {
            echo "<h5 id='response-text'>Response not submitted.<h5><p>{$mail->ErrorInfo}</p>", PHP_EOL;
        }
        ?>
    </body>
</html>