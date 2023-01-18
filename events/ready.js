const { ApplicationCommandOptionType } = require('discord.js');
const config = require('./../config.json');
const mongoose = require('mongoose');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in`);
    await mongoose.connect(config.mongoURI),
      {
        keepAlive: true,
      };

    let myCommands;
    myCommands = client.application.commands; //global slash commands

    myCommands.create({
      name: 'setjoinchannel',
      description: 'Sets a Join Channel',
      options: [
        {
          name: 'channelid',
          description: 'Channel ID from Join Channel',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    /*
    myCommands.create({
      name: 'createrolebutton',
      description: 'Creates new Roles with Buttons',
      options: [
        {
          name: 'rolename',
          description: 'Role you want to create',
          required: true,
          type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        },
      ],
    });
    */
  },
};
