#!/bin/bash
function pause(){
 read -s -n 1 -p "Press any key to continue ..."
 echo ""
}

echo "Raph_BOT first time setup"
pause

# Log File
echo -e "\nCreating log files"
touch ../core/debug.log
chmod +w ../core/debug.log
touch ../core/lastest.log
chmod +w ../core/lastest.log
touch ../www/activity.log
chmod +w ../www/activity.log

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
chmod +w ../www/src/audio

# NPM modules
echo -e "\nInstalling NPM Modules"
npm install --prefix ../core/

# Done
echo -e "\nAutomatic setup done\nFollow the next instruction in the readme\nHave fun !"