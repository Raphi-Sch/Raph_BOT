<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <span class="navbar-brand" href="#" id="bot_name_nav"></span>
        </div>
        <div id='navbar' class='collapse navbar-collapse'>
            <ul class='nav navbar-nav navbar-right'>
                <li id='dock'><a href="dock.php">Stream Dock</a></li>
                <li id='update'><a href='update.php'><span class='glyphicon glyphicon-check'></span> Update</a></li>
                <li id='compte'><a href='password.php'><span class='glyphicon glyphicon-user'></span> <?php echo $_SESSION['username']; ?></a></li>
                <li><a href='logout.php'><span class='glyphicon glyphicon-log-in'></span> Log out</a></li>
            </ul>
        </div>
    </div>
</nav>