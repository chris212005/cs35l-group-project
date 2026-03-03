const express = require('express');
const app = express();
const authrouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');
const scheduleRouter = require('./controllers/scheduleController');

//Use auth controller routers
app.use(express.json());
app.use('/api/auth', authrouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/schedule', scheduleRouter);

module.exports = app;

