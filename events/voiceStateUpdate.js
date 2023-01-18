const schema = require('./../schema.js');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {
    const guildDb = await schema.findOne({
      guildId: newState.guild.id,
    });
    let guildInfos = client.channels.cache.get(guildDb.joinChannel);
    if (!guildDb.parentId) {
      await schema.updateOne(
        {
          guildId: guildInfos.guildId,
        },
        {
          parentId: guildInfos.parentId,
        }
      );
    }
    //console.log(client.channels.cache.get('CHANNEL ID HERE').delete());

    // if channelId is ***
    if (newState.channelId == guildDb.joinChannel) {
      //creating channel
      let channelUserName = oldState.member.nickname
        ? oldState.member.nickname
        : oldState.member.user.username;
      oldState.guild.channels
        .create({
          name: `${channelUserName}\'s channel`,
          type: ChannelType.GuildVoice, //voice channel (channel type)
          parent: guildInfos.parentId, // id from category
          permissionOverwrites: [
            //permission for user who joined the create channel
            {
              id: oldState.member.user.id, // id from user
              allow: [
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.MoveMembers,
              ], //allow to edit channel
            },
            {
              id: client.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        }) //move to created channel
        .then(
          (e) => (
            oldState.member.voice.setChannel(e.id),
            schema.updateOne(
              {
                guildId: guildInfos.guildId,
              },
              { $push: { createdChannels: { $each: [e.id] } } }
            )
          )
        );
    }
    /*
    guildDb.createdChannels.forEach(async (e) => {
      if (oldState.channelId == e) {
        //channel empty
        if (oldState.channel.members.size == 0) {
          //channel empty
          //delting channel
          oldState.channel.delete();
          //deleting channel id from array
          await schema.updateOne(
            {
              guildId: guildInfos.guildId,
            },
            { $pull: { createdChannels: { $in: [e] } } }
          );
        }
      }
    });
*/
    guildDb.createdChannels.forEach(async (e) => {
      if (oldState.channel && oldState.channelId == e) {
        //channel empty
        if (oldState.channel.members.size == 0) {
          //channel empty
          //delting channel
          oldState.channel.delete();
          //deleting channel id from array
          await schema.updateOne(
            {
              guildId: guildInfos.guildId,
            },
            { $pull: { createdChannels: { $in: [e] } } }
          ); //if update is success then delete
        }
      } else if (!oldState.channelId) {
        await schema.updateOne(
          {
            guildId: guildInfos.guildId,
          },
          { $pull: { createdChannels: { $in: [e] } } }
        );
      }
    });
  },
};
