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

NodeJS module: 
- socket.io : ^4.6.1
- tmi.js : 1.8.5
- node-fetch : ^3.3.1,
- gtts : ^0.2.1

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

# Documentation

- [API Documentation](doc/api/readme.md)
- [Feature Documentation](doc/feature/readme.md)

# DISCLAIMER

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.