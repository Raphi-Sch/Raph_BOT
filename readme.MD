# Raph_BOT

Raph_BOT is a twitch chat bot.

![Raph_BOT](./screenshot.png)

# Prerequisite : 

Linux package :
- Apache2 (or any web server)
- PHP 7.0 (or higher)
- MySQL / MariaDB
- NodeJS (v16)

NodeJS module: 
- socket.io : ^4.6.1
- tmi.js : 1.8.5
- node-fetch : ^3.3.1,
- gtts : ^0.2.1

# First time setup

### Backend
- Configure your web server so it uses the 'www' folder as document root. The virtual host must be HTTPS.
- Use raphbot_struct.sql and raphbot_data.sql to configure your database with the required tables
- Make sure the folder 'core' and 'www/src/audio' can be written by the web server.

### WebUI
- Move "config_UI.json" from the template folder to the root folder and rename it "config.json" (mv ./template/config_UI.json ./config.json)
- Open "config.json"
- Set your database config (host, user, password, database)
- Set "socket_port" (default is 3000)

### Core config
- Move "config_core.json" from the template folder to the root folder and rename it "config.json" (mv ./template/config_UI.json ./core/config.json)
- Open "config.json"
- Set "API_URL" with the complete URL to access the RaphBOT API
- Set "socket_port" (default is 3000), it need to match the port you set earlier

### Create auth token
- Log into RaphBOT WebUI (default user is 'admin' with password '0'), ignore all errors related to "API ERROR". You don't have any pair of client/token yet.
- Go to "Authentication". 
- Add two client, set usage to 'Core' for the first one and 'WebUI' for the seconds. 
- Use the renew button on both client to generate a token. Config files are automatically edited.
- Relog into the WebUI for the change to be effective.

### Configure bot
- Log into the dashboard
- Got to the "Configuration" tab and setup your twitch key, etc.

# Documentation

- [API Documentation](doc/api/readme.md)
- [Feature Documentation](doc/feature/readme.md)

# DISCLAIMER

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.