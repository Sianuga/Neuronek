const {  ActionRowBuilder,ButtonBuilder, ButtonStyle, SlashCommandBuilder, GuildChannelTypes } = require('discord.js');

class Meeting {

    static isMeeting = false;

    constructor() {
        this.isMeeting = false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meeting')
        .setDescription('Manage meeting'),
    async execute(interaction) {

        const startMeeting = new ButtonBuilder()
            .setCustomId('startMeeting')
            .setLabel('Start meeting')
            .setStyle(ButtonStyle.Primary);

        const finishMeeting = new ButtonBuilder()
            .setCustomId('finishMeeting')
            .setLabel('Finish meeting')
            .setStyle(ButtonStyle.Danger);

        const currentMembers = new ButtonBuilder()
            .setCustomId('currentMembers')
            .setLabel('Current members')
            .setStyle(ButtonStyle.Secondary);


        const startingRow = new ActionRowBuilder()
            .addComponents(startMeeting, finishMeeting, currentMembers);

        const meetingRow = new ActionRowBuilder()
            .addComponents(finishMeeting, currentMembers);



        const action = await interaction.reply({
            content: `Tell me what you want to do with the meeting.`,
            components: Meeting.isMeeting?[meetingRow]:[startingRow],
            ephemeral: true,
        });

        const filter = i => i.user.id === interaction.user.id;

        const collector = action.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'startMeeting') {
                await i.update({ content: 'Meeting started.', components: [meetingRow],ephemeral: true });
                Meeting.isMeeting = true;
            } else if (i.customId === 'finishMeeting') {
                await i.update({ content: 'Meeting finished.', components: [] ,ephemeral: true});
                Meeting.isMeeting = false;
            } else if (i.customId === 'currentMembers') {


                let voiceChannels = i.message.client.channels.cache.filter(channel => channel.type === "voice")
                    .map(channel => channel.name)
                    .join(', ');



                await i.update({ content: 'Current members are: '+voiceChannels, components: [meetingRow] ,ephemeral: true});
            }
        })



    },


}
