const { MessageEmbed, Permissions } = require('discord.js')
const system = require("../database/system");

exports.int = async(client, interaction) => {
	system.findOne({_id: client.user.id}, (err, res) => {
	const ids = res.news;
	const idstech = res.tech;

  await interaction.deferReply();

  if(!res) {
	new system({
		_id: client.user.id
	}).save();

	return interaction.reply(":repeat: Por favor, execute o comando novamente.")
}

  const options = interaction.options['_hoistedOptions'];
  const channelc = client.channels.cache.get("853491913193029682");
  const canal = interaction.options['_hoistedOptions'][0].value;
  const type = interaction.options['_hoistedOptions'][1].value;
	const logs = client.channels.cache.get('902812808520036402');
	const toBRL = value => Number(value).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.editReply({ content: msg, ephemeral: true });
	let err = e => messagerEphemeral("Ops, me desculpe! Não consegui executar o comando. Por favor, tente novamente mais tarde.");

	function spliceElement(array, element){
		const index = array.indexOf(element);
		if (index > -1) {
  		array.splice(index, 1);
		};
		return array;
	};

	if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({content: `Ops! Você precisa ser um **Administrador** para usar este comando!`, ephemeral: true});

	if(type == 'off'){
		if(ids.includes(canal)){
			res.news = spliceElement(ids, canal);
			res.save();

			messager(`Ok, ${interaction.user.username}! Não enviarei mais notícias no canal solicitado!`);
			return logs.send({ embeds: [new MessageEmbed().setTitle('Canal removido - normal').setDescription(`Canal: \`${canal}\``).setColor('#FF0000').toJSON()] });
		}else if(idstech.includes(canal)){
			res.tech = spliceElement(idstech, canal);
			res.save();
			
			messager(`${message.author}, ok! Não enviarei mais notícias no canal solicitado!`);
			return logs.send({ embeds: [new MessageEmbed().setTitle('Canal removido - TECH').setDescription(`Canal: \`${canal}\``).setColor('#FF0000').toJSON()] });
		}else{
			messagerEphemeral('Esse canal não foi cadastrado anteriormente em nenhuma de minhas listas para envio de notícias :confused:');
		};
	}else{
  	const addnewsEmbed = new MessageEmbed()
    	.setTitle(`Canal adicionado - ${type}`)
    	.setColor("#00FF00")
    	.addField("Autor da solicitação", `${interaction.user.username + `#` + interaction.user.discriminator} - <@${interaction.user.id}>`)
    	.addField("Servidor", `${client.guilds.cache.get(interaction.guildId).name} - ${interaction.guildId}`)
    	.addField("Canal adicionado", canal)
    	.addField("Tipo de notícias", type);

		if(type == 'normal'){
			if(ids.includes(canal)) return messagerEphemeral('Este canal já foi adicionado! Tente novamente se remover ele, usando \`/addnews #canal off\`');
			res.news.push(canal);
			res.save();
		}else{
			if(idstech.includes(canal)) return messagerEphemeral('Este canal já foi adicionado! Tente novamente se remover ele, usando \`/addnews #canal off\`');
			res.tech.push(canal);
			res.save();
		};

  	logs.send({ embeds: [addnewsEmbed.toJSON()] });
	};

  interaction.editReply(`Ok, ${interaction.user.username}! Sua solicitação foi recebida com sucesso! Em breve irei enviar notícias no canal solicitado! :wink:`);
	});
};
