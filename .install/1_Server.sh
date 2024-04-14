#!/bin/bash
function pause(){
 read -s -n 1 -p "Press any key to continue ..."
 echo ""
}

echo "Web server installation"
pause

echo "Searching for update ..."
sudo apt update && sudo apt -y upgrade

echo "Installing Apache2 ..."
sudo apt install apache2-utils apache2 -y

echo "Configuring Apache2 ..."
sudo a2enmod headers
sudo a2enmod ssl
sudo a2enmod rewrite

echo "Enabling Apache2 service ..."
sudo systemctl enable apache2

echo "Installing MariaDB ..."
sudo apt install mariadb-server -y

echo "Enabling MariaDB service ..."
sudo systemctl enable mariadb
sudo mariadb-secure-installation

echo "Installing PHP ..."
sudo apt install php libapache2-mod-php php-cli php-fpm php-json php-pdo php-mysql php-zip php-gd  php-mbstring php-curl php-xml php-pear php-bcmath -y

echo "Installing PHPMyAdmin ..."
sudo apt install phpmyadmin -y

echo "Installing NodeJS ..."
sudo apt install nodejs -y

echo "Installing NPM ..."
sudo apt install npm -y