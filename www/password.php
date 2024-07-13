<?php
session_start();
require_once 'src/php/header.php';

$username = $_SESSION['username'];

// SQL : Infos utilisateur
$user = db_query($db, "SELECT * FROM users WHERE username = ?", "s", $_SESSION['username']);

// MDP Actuel
if (isset($_SESSION["pass-reset"]) && $_SESSION["pass-reset"]) {
    $bouton_retour = "";
    $mdp_actuel = '<input class="form-control" type="password" disabled>';
} else {
    $bouton_retour = "<button type='button' class='btn btn-info' onclick='location.href=\"dashboard.php\"'><span class='glyphicon glyphicon-arrow-left'></span> Back</button>";
    $mdp_actuel = '<input name="current_pass" class="form-control"  type="password">';
}


// Execution si appel du script par POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // MDP Actuel incorrect
    $row = db_query($db, "SELECT `password` FROM users WHERE username = ?", "s", $username);

    if (password_verify($_POST['current_pass'], $row['password']) || (isset($_SESSION["pass-reset"]) && $_SESSION["pass-reset"])) {

        // Mots de passe et confirmation identique
        if ($_POST['new_pass'] == $_POST['new_pass_confirm']) {
            $hash = password_hash($_POST['new_pass'], PASSWORD_DEFAULT);

            // SQL : Requete du Pass de l'utilisateur
            db_query_no_result($db, "UPDATE `users` SET `password` = ? WHERE username = ?", "ss", [$hash, $username]);

            $_SESSION["pass-reset"] = false;
            $_SESSION["pass-change"] = false;

            header('Location: ./index.php');
            exit();
        } else {
            $_SESSION["alert"] = ["error", "Les mots de passe ne sont pas identiques", false];
            header('Location: ./password.php');
            exit();
        }
    } else {
        $_SESSION["alert"] = ["error", "Le mot de passe actuel est incorrect", false];
        header('Location: ./password.php');
        exit();
    }
}

?>


<!DOCTYPE html>
<html lang="fr">

<head>
    <?php include_once 'src/html/header.html'; ?>
    <title id='bot_name'>Password - </title>
</head>

<body>
    <!-- Global area -->
    <br />
    <div class="container">
        <form class="form-horizontal" method="post">
            <fieldset>

                <!-- Form Name -->
                <div class="center">
                    <h1 class="page-header"><b>Change password</b></h1>
                </div>

                <!-- username -->
                <div class="form-group">
                    <label class="col-md-4 control-label">Username</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-tag"></i></span>
                            <input class="form-control" type="text" value="<?php echo $user['username']; ?>" readonly>
                        </div>
                    </div>
                </div>

                <!-- Password -->
                <div class="form-group">
                    <label class="col-md-4 control-label">Current password</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <?php echo $mdp_actuel; ?>
                        </div>
                    </div>
                </div>

                <!-- New password -->
                <div class="form-group">
                    <label class="col-md-4 control-label">New password</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input name="new_pass" class="form-control" type="password" minlength="8" required>
                        </div>
                    </div>
                </div>

                <!-- New password confirm-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Confirm new password</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input name="new_pass_confirm" class="form-control" type="password" minlength="8" required>
                        </div>
                    </div>
                </div>

                <!-- Button -->
                <div class="form-group">
                    <label class="col-md-4 control-label"></label>
                    <div class="col-md-4"><br>
                        <div class="center">
                            <?php echo $bouton_retour; ?>
                            <button type="submit" class="btn btn-success">Save</button>
                            <div class="center">
                    </div>
                </div>

            </fieldset>
        </form>
    </div>

    <!-- Placed at the end of the document so the pages load faster -->
    <?php require_once('../src/php/alert.php'); ?>
    <script src="src/js/common.js"></script>

</body>

</html>