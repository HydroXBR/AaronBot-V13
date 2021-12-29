const { MessageEmbed, MessageButton, MessageActionRow, Permissions, PermissionOverwriteManage, PermissionOverwrites } = require("discord.js");
const gerency = require("../database/gerency");

exports.commands = {
	'commands':['ban', 'kick', 'mute', 'unmute', 'unwarn']
}

exports.int = async(client, interaction) => {
	await interaction.deferReply();
	gerency.findOne({_id: interaction.guildId}, (err,res) => {

	if(!res) {
		new gerency({
			_id: client.user.id
		}).save();

		return interaction.reply(":repeat: Por favor, execute o comando novamente.")
	}

	if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({content: `Ops! Você precisa ser um **Administrador** para usar este comando!`, ephemeral: true});
	const action = interaction.options["_hoistedOptions"][0].value;
	const member = interaction.options.getMember("user");
	const authorId = interaction.user.id;
	const userId = interaction.options["_hoistedOptions"][1].value;
	const reason = interaction.options["_hoistedOptions"][2].value;
	const author = client.users.cache.get(authorId);
	const user = client.users.cache.get(userId)
	const authorTag = author.username + `#` + author.discriminator;
	const authorAvatar = `https://cdn.discordapp.com/avatars/${authorId}/${author.avatar}.png?size=1024`;
	const userAvatar = `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=1024`;
	const mentionAuthor = `<@${authorId}>`;
	const mentionUser = `<@${userId}>`;
	const warns = res.advs[interaction.user.id];
	function maxChars(string){
    const arraying = new Array;
    let stringsplit = string.split("");
    if(stringsplit.length > 200){
      for(var i = 0; i < 200; i++){
        arraying.push(stringsplit[i])
      };

      return arraying.join("") + `...`;
    }else{
      return string;
    }
  };

	if(action == 'ban'){
		let banEmbed = new MessageEmbed()
    	.setTitle(`Ban`)
			.setColor('#00EEEE')
    	.setThumbnail("https://media.tenor.com/images/fe829734d0d3b1d5faf7bb92c1a951aa/tenor.gif")
    	.setImage("https://media1.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif")
			.addField('Administrador que baniu:', `${mentionAuthor} - \`${authorId}\``)
    	.addField('Membro Banido: ', `${mentionUser} - \`${userId}\``)
    	.addField("Motivo: ", `\`\`\`${maxChars(reason)}\`\`\``);
		
		member.ban({reason: `${maxChars(reason)} - Banido por ${authorTag}`}).catch(e => {
			console.log(e)
			return interaction.editReply({content: 'Desculpe, mas não consegui banir o usuário! Verifique se o meu cargo é menor que o dele, e se tenho permissões suficientes para isso :wink:', ephemeral: true})
		})

		interaction.editReply({embeds: [banEmbed.toJSON()]})
	}else if(action == 'kick'){
		let kickEmbed = new MessageEmbed()
    	.setTitle(`Kick`)
			.setColor('#00EEEE')
    	.setThumbnail("https://i.pinimg.com/originals/63/d3/7d/63d37d7bde44bdb2321ff8b9b99304e4.png")
			.addField('Administrador que expulsou:', `${mentionAuthor} - \`${authorId}\``)
    	.addField('Membro expulso: ', `${mentionUser} - \`${userId}\``)
    	.addField("Motivo: ", `\`\`\`${maxChars(reason)}\`\`\``);
		
		member.kick({reason: `${reason} - Banido por ${authorTag}`}).catch(e => {
			console.log(e);
			return interaction.editReply({content: 'Desculpe, mas não consegui expulsar o usuário! Verifique se o meu cargo é menor que o dele, e se tenho permissões suficientes para isso :wink:', ephemeral: true});
		})

		interaction.editReply({embeds: [kickEmbed.toJSON()]});
	}else if(action == 'warn'){
		if(reason == 'delete' || reason == 'apagar'){
			delete res.advs[interaction.user.id];
			res.save();

			let deleteEmbed = new MessageEmbed()
    		.setTitle(`Warns deletadas`)
				.setColor('#00EEEE')
    		.setThumbnail("https://cdn.pixabay.com/photo/2016/10/03/19/00/garbage-1712516_960_720.png")
				.addField('Administrador que limpou:', `${mentionAuthor} - \`${authorId}\``)
    		.addField('Membro com advertências apagadas: ', `${mentionUser} - \`${userId}\``)
			interaction.editReply({content: mentionUser, embeds: [deleteEmbed.toJSON()]})
		}else{
			if(warns >= 3) return interaction.editReply({content: `O usuário ${mentionUser} já atingiu 3 advertências e não pode mais ser advertido. Recomendo que use o comando mute, ban ou kick. Para limpar as advertências, use o comando novamente e insira \`delete\` no motivo.`, ephemeral: true});
			let warnEmbed = new MessageEmbed()
    		.setTitle(`Warn`)
				.setColor('#00EEEE')
    		.setThumbnail("http://2.bp.blogspot.com/-ZH5rlb4CpZA/T2pffEW1Q_I/AAAAAAAAADs/P0d56oN7_Oc/s1600/advertencia.gif")
				.addField('Administrador que advertiu:', `${mentionAuthor} - \`${authorId}\``)
    		.addField('Membro advertido: ', `${mentionUser} - \`${userId}\``)
    		.addField("Motivo: ", `\`\`\`${maxChars(reason)}\`\`\``);
			if(!warns) {
			res.advs[interaction.user.id] = 1;
    	}else {
			res.advs[interaction.user.id]+=1;
    	}
			res.save();
			interaction.editReply({content: mentionUser, embeds: [warnEmbed.toJSON()]})
		}
	}else if(action == 'mute'){
		const guildChannels = interaction.guild.channels.cache;
		const channelsArray = guildChannels.map(e=>e.id);
		const memberRoles = member.roles.cache;
		const rolesArray = memberRoles.map(role => role.id);
		let roleArr = interaction.guild.roles.cache.map(e => e.id);
		const muted = new Array;
		console.log(muted)
		for(var i = 0; i < roleArr.length; i++){
			if(interaction.guild.roles.cache.get(roleArr[i]).name == 'Muted (Aaron)'){
				muted.push(interaction.guild.roles.cache.get(roleArr[i]).id)
			};
		};
		if(!muted[0]){
			interaction.guild.roles.create({ name: 'Muted (Aaron)', permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY] }).then(e => {
				muted.push(e.id)
				console.log(e.id)
			});
		}

		for(var i = 0; i < channelsArray.length; i++){
				if(interaction.guild.channels.cache.get(channelsArray[i]).type == 'GUILD_TEXT'){
					interaction.guild.channels.cache.get(channelsArray[i]).permissionOverwrites.create(interaction.guild.roles.cache.find(e => e.name == 'Muted (Aaron)'), { SEND_MESSAGES: false, ADD_REACTIONS: false, USE_PUBLIC_THREADS: false, USE_PRIVATE_THREADS: false }).catch(e=>``);	
				}else if(interaction.guild.channels.cache.get(channelsArray[i]).type == 'GUILD_VOICE'){
					interaction.guild.channels.cache.get(channelsArray[i]).permissionOverwrites.create(interaction.guild.roles.cache.find(e => e.name == 'Muted (Aaron)'), { CONNECT: false, SPEAK: false, USE_VAD: false, REQUEST_TO_SPEAK: false }).catch(e=>``);	
				}
			}

		for(var i = 0; i < (memberRoles.size - 1); i++){
			member.roles.remove(rolesArray[i])
		}
		
		member.roles.add(muted[0])

		let muteEmbed = new MessageEmbed()
    	.setTitle(`Mute`)
			.setColor('#00EEEE')
			.setThumbnail('https://www.pngkit.com/png/full/760-7607346_royalty-free-shhh-clipart-retro-calligraphy.png')
			.addField('Administrador que mutou:', `${mentionAuthor} - \`${authorId}\``)
    	.addField('Membro mutado: ', `${mentionUser} - \`${userId}\``)
    	.addField("Motivo: ", `\`\`\`${maxChars(reason)}\`\`\``);

		interaction.editReply({embeds: [muteEmbed.toJSON()]})
	}else if(action == 'unmute'){
		const role = member.roles.cache.find(e => e.name == 'Muted (Aaron)');

		if(!role) return interaction.editReply({ content: `Ops! O usuário não está mutado ou não foi mutado por mim. Verifique se o cargo de mute que ele tem é \`Muted (Aaron)\`.`, ephemeral: true})

		member.roles.remove(role.id)
		let unmuteEmbed = new MessageEmbed()
    	.setTitle(`Unmute`)
			.setColor('#00EEEE')
			.setThumbnail('https://www.pngrepo.com/download/244921/speak.png')
			.addField('Administrador que desmutou:', `${mentionAuthor} - \`${authorId}\``)
    	.addField('Membro desmutado: ', `${mentionUser} - \`${userId}\``)
    	.addField("Motivo: ", `\`\`\`${maxChars(reason)}\`\`\``);

		interaction.editReply({content: mentionUser, embeds: [unmuteEmbed.toJSON()]})
	}


	/*const retry = new MessageActionRow().addComponents(
			new MessageButton().setStyle("SUCCESS").setLabel("🔁 Retribuir").setCustomId("retry_social")
		);

	interaction.editReply({embeds: [embed.toJSON()], components: [retry]});
  const filter = i => i.customId == "retry_social" && i.user.id === userId;
	const collector = interaction.channel.createMessageComponentCollector({ filter });
	collector.on("collect", async i => {
		if (i.customId === "retry_social") {
			await client.channels.cache.get(interaction.channelId).send({content: `${mentionUser} 🔁 ${mentionAuthor}`, embeds: [embedretry]});
		}
	});*/
});
}
