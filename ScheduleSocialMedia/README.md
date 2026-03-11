BruinCord:

A MERN-stack web application that lets users send and receive messages, view other peoples' weekly schedules, and view their profiles.

Tech stack:

MongoDB
Express
React
Node.js

## Cloning the repository

git clone https://github.com/chris212005/cs35l-group-project.git
cd cs35l-group-project

## Install Dependencies

Install frontend dependencies:

cd schedulesocialmedia
npm install

Install backend dependencies:

cd schedulesocialmedia/server
npm install

## How to run our app

First run the back end by opening a terminal 

cd cs35l-group-project

cd into schedulesocialmedia

cd into server

Once in the server folder run the command: npx nodemon server.js

This should starting running the backend, and you should see something like: 

"Listening to requests on PORT: 3000
DB Connection Successful"

Now run the front end by opening a separate terminal

cd cs35l-group-project

cd schedulesocialmedia

Run the command: npm run dev

This should give a link to the web application locally on your computer. Hold command and press this link and it should take you to the application.