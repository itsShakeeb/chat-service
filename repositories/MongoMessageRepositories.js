const MessageModel = require("../models/messageSessionModel");

class MongoMessageRepository {
  async save(connectionId, message) {
    return await MessageModel.create({ connectionId, ...message });
  }

  async getMessages(connectionId) {
    return await MessageModel.find({ connectionId }).sort({ createdAt: 1 });
  }
}

module.exports = MongoMessageRepository;