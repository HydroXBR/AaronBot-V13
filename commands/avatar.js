const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

exports.int = async(client, interaction) => {
	const author = interaction.user.id;
  const user = interaction.options['_hoistedOptions'][0] ? interaction.options['_hoistedOptions'][0].value : interaction.user.id;

  const user1 = user == author ? author : user;
  const avatarUrl = client.users.cache.get(user1).avatar;
  const userTag = client.users.cache.get(user1).username + `#` + client.users.cache.get(user1).discriminator;
  const avatarLink = `https://cdn.discordapp.com/avatars/${user}/${avatarUrl}.png?size=1024`;

  let embed = new MessageEmbed()
    .setTitle(`Avatar de ${userTag}`)
    .setColor('#00EEEE')
    .setFooter(`Pois o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus, nosso Senhor. - Romanos 6.23 ♥`)
    .setImage(avatarLink);

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://cdn.discordapp.com/avatars/${user}/${avatarUrl}.png?size=1024`)
				.setLabel('PNG')
				.setStyle('LINK'),
			new MessageButton()
				.setURL(`https://cdn.discordapp.com/avatars/${user}/${avatarUrl}.jpg?size=1024`)
				.setLabel('JPG')
				.setStyle('LINK'),
			new MessageButton()
				.setURL(`https://cdn.discordapp.com/avatars/${user}/${avatarUrl}.webp?size=1024`)
				.setLabel('WEBP')
				.setStyle('LINK')
		);

	interaction.reply({embeds: [embed.toJSON()], components: [row]});
};
