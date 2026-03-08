const express = require('express');
const app = express();
const authrouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');
const scheduleRouter = require('./controllers/scheduleController');


//Use auth controller routers
app.use(express.json());
const server = require("http").createServer(app);

const io = require("socket.io")(server, {cors: {
    origin: "http://localhost:5173", 
    methods: ['GET', 'POST']
}})
app.use('/api/auth', authrouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/schedule', scheduleRouter);

//TEST SOCKET CONNECTION FROM CLIENT
io.on("connection", socket => {
    socket.on("join-room", userid => {
        socket.join(userid);
        
    })

    socket.on("send-message", (message) => {
        console.log(message);
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit("receive-message", message )

    })

    socket.on("clear-unread-messages", data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit("message-count-cleared", data)
    })

})

module.exports = server;

