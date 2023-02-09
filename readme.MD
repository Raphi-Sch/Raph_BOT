# Raph_BOT

Raph_BOT is a twitch chat bot.

![Raph_BOT](./screenshot.png)

# Prerequisite : 

Linux package :
- Apache2 (or any web server)
- PHP 7.0 (or higher)
- MySQL / MariaDB
- NodeJS (v16)
- Screen

NodeJS module (and tested, package.json provided): 
- console-stamp@3.0.3
- socket.io@2.4.1
- tmi.js@1.8.5

# First time setup (Debian based distro)

In the folder "template" :
- Move "config.json" from the template folder to the root folder (mv ./template/config.json ./config.json)
- Setup your database config (user, password, database) and port in the file "config.json"
- Use raphbot_struct.sql and raphbot_data.sql to configure your database with the required tables
- Configure your web server so it uses the 'www' folder as document root
- Make sure the folder 'core' can be written by the web server (needed for log files)

# Configure bot
- Log into the dashboard, default user is 'admin' with password '0'
- Got to the "Configuration" tab and setup your twitch key, etc.

# DISCLAIMER

This software is provided "as is", which mean :
- No guarantee it work
- Security is not guaranted
- No support provided
