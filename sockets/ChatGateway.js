class ChatGateway {
  constructor(io, chatService) {
    this.io = io;
    this.chatService = chatService;
    this.connectionId = ''

    this.setupMiddleware();
    this.setupListeners();
  }

  generateRoomId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

  setupMiddleware() {
    this.io.use((socket, next) => {
      try {
        const { userId } = socket.handshake.auth;
        console.log({userId});
        
        if (!userId) {
          return next(new Error("Missing userId"));
        }

        next();
      } catch (error) {
        next(error);
      }
    });
  }

  setupListeners() {
    this.io.on("connection", (socket) => {
      const { userId } = socket.handshake.auth;
      this.chatService.logger.log(`User connected: ${userId}`);

      socket.on('join', async (payload) => {
        const { receiverId } = payload
        this.connectionId = this.generateRoomId(userId, receiverId)
        socket.join(this.connectionId)
        this.chatService.logger.log(`User joined: ${userId}`);
        // const messages = await this.chatService.getMessages(this.connectionId)
        const messages = []
        this.io.to(this.connectionId).emit("chat", messages);
      })
  
      socket.on("chat", async (payload) => {
        const message = await this.chatService.handleMessage({
          ...payload,
          userId,
          connectionId: this.connectionId
        });

        this.io.to(this.connectionId).emit("chat", message);
      });

      socket.on("disconnect", () => {
        this.chatService.logger.log(`User disconnected: ${userId}`);
      });
    });
  }
}

module.exports = ChatGateway;
