const schema = require('./../schema.js');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    const { commandName, options } = interaction;

    if (
      commandName == 'setjoinchannel' &&
      interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      let channelData = client.channels.cache.get(
        options.getString('channelid')
      );
      if (
        channelData != undefined &&
        channelData.type == ChannelType.GuildVoice
      ) {
        const guildDb = await schema.findOne({
          guildId: interaction.guildId,
        });

        if (guildDb && guildDb.guildId == interaction.guildId) {
          await schema.updateOne(
            {
              guildId: interaction.guildId,
            },
            {
              joinChannel: options.getString('channelid'),
            }
          );
        } else {
          await new schema({
            guildId: interaction.guildId,
            joinChannel: options.getString('channelid'),
          }).save();
        }

        interaction.reply({
          content: 'Join Channel was set.',
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: 'Not a Voice Channel Id',
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: 'You need to be Admin to use this command.',
        ephemeral: true,
      });
    }
  },
};
