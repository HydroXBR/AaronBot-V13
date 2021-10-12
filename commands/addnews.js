const { MessageEmbed, Permissions } = require('discord.js');

exports.int = async(client, interaction) => {
  const options = interaction.options['_hoistedOptions'];
  const channelc = client.channels.cache.get("853491913193029682");
  const canal = interaction.options['_hoistedOptions'][0].value;
  const options2 = interaction.options['_hoistedOptions'][1].value;

  if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({content: `Ops! Você precisa ser um **Administrador** para usar este comando!`, ephemeral: true});

  const newsEmbed = new MessageEmbed()
    .setTitle("Solicitação - news - Slash Commands")
    .setColor("#00FFFF")
    .addField("Autor da solicitação", `${interaction.user.username + `#` + interaction.user.discriminator} - <@${interaction.user.id}>`)
    .addField("Servidor", `${client.guilds.cache.get(interaction.guildId).name} - ${interaction.guildId}`)
    .addField("Canal", `${client.channels.cache.get(interaction.channelId).name} - ${interaction.channelId}`)
    .addField("Canal solicitado", canal)
    .addField("Tipo de notícias", options2);
  channelc.send({ content: `<@755162323026706583>`, embeds: [newsEmbed] });

  interaction.reply(`Ok, ${interaction.user.username}! Sua solicitação foi recebida com sucesso! Em breve irei enviar notícias no canal solicitado! :wink:`);
};
