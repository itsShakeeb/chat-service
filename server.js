const http = require('http')
const { Server } = require('socket.io')
const express = require('express');
const PORT = process.env.PORT || 5003

const app = express();
const ChatService = require('./services/ChatService');
const ChatGateway = require('./sockets/ChatGateway');
const db = require('./config/db');
const MongoMessageRepository = require('./repositories/MongoMessageRepositories');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is UP"
    })
})

const chatService = new ChatService({
    logger: console,
    messageRepository: new MongoMessageRepository()
});
new ChatGateway(io, chatService);



db.then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((err) => {
    console.log("Database connection failed", err);
})
