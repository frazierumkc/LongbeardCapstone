# Longbeard Crew

Team members: Dylan Frazier, Thomas Reilly, David Forson, Salman Mirza

Instructions to run:

Download and extract zip file

Open main project folder in command terminal and run the following commands (to install dependencies):

```
npm install axios

npm init -y

npm install express mysql2 cors

npm install --save-dev jest supertest

npx create-react-app folder_name
```

Move all files inside "frontend" folder to new react folder "folder_name" (or whatever other name you chose for it).

Using a MySQL server tool of your choice, build the database from the "Dump20250509.sql" file in the Database folder (Tested with MySQL Workbench 8.0 CE).

Open backend folder in command terminal and enter

```
node server.js
```

Open frontend folder in command terminal and enter 

```
npm start
```

Unit tests can be run with

```
npm test
```

If you get a "cannot be loaded because running scripts is diasbled on this system" error, open another command terminal from the start menu (lookup "cmd"), navigate to folder with "cd" command, and try again.
