# nodejs-project
Back end server demo for vue-project

# Installation 
Installation of npm is required - For windows : You may download it from https://nodejs.org/en/download/. For mac : You may run the following command : 'brew install node'.

# How to run the server
1) run 'npm install'
2) run 'node server.js'

# Features
The server uses express to act as the server and express-session to manage sessions by the user. Whenever a user tries to gain access to an unauthorized page, server will redirect the user to a page where the user has access, or if the user is not logged in, will be redirected to the login page. Whenever the user goes to the website, a session will be created in the SESSION collection in the MongoDB. Other information such as keywords that are searched by the user is also added in the session cookie in the collection.

# Limitations
1) Confidential info such as ddatabase credentials, server port, sare hardcoded in the js file, by right it should be put in the process environment
2) Due to time limitation, I did not write unit/integration testing js files
3) Design of the code can be improved if given more time
