const { MessageEmbed, Permissions } = require('discord.js'),
	db = require('quick.db');

exports.int = async(client, interaction) => {
  const options = interaction.options['_hoistedOptions'];
  const channelc = client.channels.cache.get("853491913193029682");
  const canal = interaction.options['_hoistedOptions'][0].value;
  const type = interaction.options['_hoistedOptions'][1].value;
	const logs = client.channels.cache.get('902812808520036402');

	function spliceElement(array, element){
		const index = array.indexOf(element);
		if (index > -1) {
  		array.splice(index, 1);
		};
		return array;
	};

	if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({content: `Ops! Você precisa ser um **Administrador** para usar este comando!`, ephemeral: true});

	if(type == 'off'){
		if(ids.includes(canal)){
			db.set('idsnormal', spliceElement(ids, canal));
			messager(`Ok, ${interaction.user.username}! Não enviarei mais notícias no canal solicitado!`);
			return logs.send({ embeds: [new MessageEmbed().setTitle('Canal removido - normal').setDescription(`Canal: \`${canal}\``).setColor('#FF0000').toJSON()] });
		}else if(idstech.includes(canal)){
			db.set('idstech', spliceElement(idstech, canal));
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
			db.push(`idsnormal`, canal);
		}else{
			db.push(`idstech`, canal);
		};

  	logs.send({ embeds: [addnewsEmbed.toJSON()] });
	};

  interaction.reply(`Ok, ${interaction.user.username}! Sua solicitação foi recebida com sucesso! Em breve irei enviar notícias no canal solicitado! :wink:`);
};
