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

# Copy config files
echo -e "\nChecking config files :"
if [ -f "../core/config.json" ]; then
    echo -e "\t- Core config file already exist."
else 
    echo -e "\t- Copying core config file."
    cp ./config_core.json ../core/config.json
fi

if [ -f "../config.json" ]; then
    echo -e "\t- UI config file already exist."
else 
    echo -e "\t- Copying UI config file."
    cp ./config_UI.json ../config.json
fi

# Change writing right
echo -e "\nMaking audio folder writable"
chmod +w ../www/src/audio

echo -e "\nAutomatic setup done\nFollow the next instruction in the readme\nHave fun !"