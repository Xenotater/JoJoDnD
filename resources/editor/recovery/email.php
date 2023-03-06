<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require '../../Assets/Composer/vendor/autoload.php';

    if ($_POST["action"] == "send")  {
        $user = $_POST["user"];
        $code = $_POST["code"];
        //email code from https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-using-smtp-php.html
        $sender = 'no-reply@recovery.jojodnd.com';
        $senderName = 'JoJo D&D';
        $recipient = $_POST["recipient"];
        $usernameSmtp = getenv('SMTP_USER');
        $passwordSmtp = getenv('SMTP_PASS');
        $host = 'email-smtp.us-east-1.amazonaws.com';
        $port = 587;

        $subject = "Account Recovery";

        $bodyText = "$user, reset your JoJo D&D editor password using the link below.\r\n";
        $bodyText .= "https://www.jojodnd.com/resources/editor/recovery/?code=" . $code . "\r\n\n";
        $bodyText .= "If you did not request a password reset, please ignore this email. Do not share your recovery link with anyone. Your recovery link is valid for 1 hour.";

        $bodyHtml = "<h2>$user, reset your JoJo D&D editor password using the link below.</h2>";
        $bodyHtml .= "https://www.jojodnd.com/resources/editor/recovery/?code=" . $code . "<br><br>";
        $bodyHtml .= "<small><i>If you did not request a password reset, please ignore this email. Do not share your recovery link with anyone. Your recovery link is valid for 1 hour.</i></small>";

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
            echo "An error occurred, please contact the site administrator.<br>$e->errorMessage()";
            exit;
        } catch (Exception $e) {
            echo "Response not submitted.<br>$mail->ErrorInfo";
            exit;
        }
        echo "Email sent!";
    }
    exit;
?>