#!/bin/bash
echo "Raph_BOT automatic setup"

# Apache2
echo "Configuring Apache2 ..."
if [ -f "/etc/apache2/sites-enabled/raph_bot.conf" ]; then
    echo -e "\t- Site config file already exist."
else 
    sudo cp raph_bot_virtualhost.conf /etc/apache2/sites-available/raph_bot.conf
    sudo nano /etc/apache2/sites-available/raph_bot.conf
    sudo a2ensite raph_bot.conf
    sudo systemctl reload apache2
fi

# Log File
echo -e "\nCreating log files :"

echo -e "\t- debug.log"
touch ../core/debug.log
sudo chmod +w ../core/debug.log

echo -e "\t- lastest.log"
touch ../core/lastest.log
sudo chmod +w ../core/lastest.log

echo -e "\t- activity.log"
touch ../www/src/activity.log
sudo chmod +w ../www/src/activity.log

# Copy config files
echo -e "\nChecking config files :"
if [ -f "../core/config.json" ]; then
    echo -e "\t- Core config file already exist."
else 
    echo -e "\t- Copying core config."
    cp ./config_core.json ../core/config.json
    echo -e "\t- Editing core config."
    nano ../core/config.json
fi

if [ -f "../config.json" ]; then
    echo -e "\t- UI config file already exist."
else 
    echo -e "\t- Copying UI config."
    cp ./config_UI.json ../config.json
    echo -e "\t- Editing UI config."
    nano ../config.json
fi

# Change writing right
echo -e "\nMaking audio folder writable"
sudo chmod +w ../www/src/audio

# TTS Audio
echo -e "\nCreating TTS file"
touch ../www/src/audio/tts.mp3
sudo chmod +w ../www/src/audio/tts.mp3

# NPM modules
echo -e "\nInstalling NPM Modules"
npm install --prefix ../core/

# Done
echo -e "\nAutomatic setup done\nFollow the next instruction in the readme\nHave fun !"