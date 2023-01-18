const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  joinChannel: {
    type: String,
    required: true,
  },
  parentId: String,
  createdChannels: [String],
});

module.exports = mongoose.model("guildid", schema, "guildid");
