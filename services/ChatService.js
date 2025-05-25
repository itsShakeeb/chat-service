class ChatService {
  constructor({ messageRepository, logger = console }) {
    this.messageRepository = messageRepository || new InMemoryMessageRepository();
    this.logger = logger;
  }

  async handleMessage({ content, userId, connectionId, id, receiverId }) {
    const message = { content, userId, id, receiverId };

    // await this.messageRepository.save(connectionId, message);

    this.logger.log(`Message from ${userId}: ${content}`);

    return message;
  }

  async getMessages(connectionId) {
    return this.messageRepository.getMessages(connectionId);
  }
}

class InMemoryMessageRepository {
  constructor() {
    this.rooms = new Map();
  }

  async save(connectionId, message) {
    if (!this.rooms.has(connectionId)) {
      this.rooms.set(connectionId, []);
    }
    this.rooms.get(connectionId).push(message);
  }

  async getMessages(connectionId) {
    return this.rooms.get(connectionId) || [];
  }
}

module.exports = ChatService;
