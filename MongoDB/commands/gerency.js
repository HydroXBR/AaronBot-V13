const { 
	MessageEmbed,
	MessageButton,
	MessageActionRow, 
	Permissions, 
	PermissionOverwriteManage, 
	PermissionOverwrites
	} = require("discord.js"),
	db = require("quick.db"),
	wait = require("util").promisify(setTimeout),
	ms = require('ms');

const gerency = require("../database/gerency");

exports.commands = {
	'commands':['banlist', 'createchannel', 'deletechannel', 'slowmode', 'poll', 'nick', 'ticketrole', 'ticket', 'suggestionschannel', 'log']
}

exports.int = async(client, interaction) => {
	gerency.findOne({_id: interaction.guildId}, (err,res) => {

	if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({content: `Ops! Você precisa ser um **Administrador** para usar este comando!`, ephemeral: true});
	let addZero = num => num < 10 ? "0" + num : num;
	let author = interaction.user.id;
	let authorTag = interaction.user.username + `#` + interaction.user.discriminator;
	let command = interaction.options["_subcommand"];
	let string = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : null;
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.reply({ content: msg, ephemeral: true });
	let embedderEphemeral = embed => interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
	function err(erro){
		console.log(erro);
		return messagerEphemeral("Ops, me desculpe! Não consegui executar o comando. Por favor, tente novamente mais tarde.");
	};
	function maxChars(string){
    let arraying = new Array;
    let stringsplit = string.split("");
    if(stringsplit.length > 4000){
      for(var i = 0; i < 4000; i++){
        arraying.push(stringsplit[i])
      };

      return arraying.join("") + `...`;
    }else{
      return string;
    }
  };
	function nickChars(string){
    let arraying = new Array;
    let stringsplit = string.split("");
    if(stringsplit.length > 32){
      for(var i = 0; i < 32; i++){
        arraying.push(stringsplit[i])
      };

      return arraying.join("");
    }else{
      return string;
    }
  };
	function channelChars(string, type){
    let arraying = new Array;
    let stringsplit = string.split("");
    if(stringsplit.length > 90){
      for(var i = 0; i < 90; i++){
        arraying.push(stringsplit[i])
      };

			if(type == 'GUILD_TEXT'){
      	return arraying.join("").replace(/\s+/gmi, '-');
			}else{
				return arraying.join("");
			}
    }else{
      if(type == 'GUILD_TEXT'){
      	return string.replace(/\s+/gmi, '-');
			}else{
				return string;
			}
    }
  };

	if(command == 'banlist'){
		try{
			interaction.member.guild.bans.fetch().then(banned => {
				let bans = banned.map(e => `\`${e.user.username}#${e.user.discriminator}\``);
				let bansEmbed = new MessageEmbed().setTitle('Usuários banidos do servidor').setDescription(bans.length ? bans.join('\n') : 'Não há usuários banidos deste servidor!').setColor('#00EEEE').setThumbnail('https://cdn.pixabay.com/photo/2012/04/24/12/29/no-symbol-39767_1280.png');
				embedderEphemeral(bansEmbed);
      });
		}catch(e){
			return err(e);
		}
	}else if(command == 'createchannel'){
		try{
			await interaction.deferReply();
			const channelName = string;
			const channelType = interaction.options["_hoistedOptions"][1].value;
			const type = channelType == 'text' ? 'GUILD_TEXT' : 'GUILD_VOICE';
			const newChannel = [];
		
			return interaction.member.guild.channels.create(channelChars(channelName, type), { type: type }).then(channel => messager(`Pronto, <@${author}>! O canal <#${channel.id}> foi criado com sucesso! :wink:`));
		}catch(e){
			return err(e);
		}
	}else if(command == 'deletechannel'){
		try{
			const channelId = string.match(/\d{18}/gmi)[0];
			const channel = interaction.member.guild.channels.cache.get(channelId);

			channel.delete();

			if(channelId == interaction.channelId){
				return '';
			}else{
				return messagerEphemeral('Ok, o canal foi apagado com sucesso!')
			}
		}catch(e){
			return err(e);
		}
	}else if(command == 'slowmode'){
		try{
			await interaction.deferReply();
			const slowtime = interaction.member.guild.channels.cache.get(interaction.channelId).rateLimitPerUser;
			const time = string;
			const timeSeconds = ms(time)/1000;
			if(isNaN(timeSeconds)) return messagerEphemeral('Especifique um tempo válido, por exemplo: \`2s\` :wink:');
			if (time >= 21600) return messagerEphemeral(`O limite do modo lento que você solicitou é muito alto, digite qualquer coisa menor que 6 horas.`);
			if (slowtime == timeSeconds) return messagerEphemeral(`O limite do modo lento já está definido para ${timeSeconds}s! :confused:`);

			interaction.member.guild.channels.cache.get(interaction.channelId).setRateLimitPerUser(timeSeconds, `Ativado por ${authorTag}`);

			const slowEmbed = new MessageEmbed()
				.setTitle('Modo lento ativado')
				.setThumbnail('https://cdn-icons-png.flaticon.com/512/1247/1247847.png')
      	.addField('Intervalo do modo lento: ', string)
				.addField('Ativado por', `\`${authorTag}\` | \`${author}\``)
      	.setColor('#00EEEE');			
			return embedder(slowEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'poll'){
		try{
			await interaction.deferReply();
			const channelId = string.match(/\d{18}/gmi)[0];
			const question = interaction.options["_hoistedOptions"][1].value;

			const questionEmbed = new MessageEmbed()
    		.setTitle(`Enquete!`)
    		.setDescription(`> ${maxChars(question)}`)
				.setFooter(`Criada por ${authorTag}`, `https://cdn.discordapp.com/avatars/${author}/${interaction.member.user.avatar}.png`)
    		.setThumbnail("https://s2.glbimg.com/oeGnJ3pDzDOYvw7sCfqStPHEhmc=/0x0:480x480/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/Z/X/QKyPZbQ2ujBBwBo0g7Qg/giphy-1-.gif")
    		.setColor(`#00EEEE`);
			
			interaction.member.guild.channels.cache.get(interaction.channelId).send({ embeds: [questionEmbed.toJSON()] });
			return messager('A enquete foi enviada :wink:')
		}catch(e){
			return err(e);
		}
	}else if(command == 'nick'){
		try{
			await interaction.deferReply();
			let member = interaction.options["_hoistedOptions"][0].member;
			let user = interaction.options["_hoistedOptions"][0].user;
			let userUsername = user.username;
			let userTag = userUsername + '#' + user.discriminator;
			let userId = string.match(/\d{18}/gmi)[0];
			let nick = interaction.options["_hoistedOptions"][1].value;

			let nickEmbed = new MessageEmbed()
    		.setTitle(`Nickname alterado`)
    		.setThumbnail("https://s2.glbimg.com/oeGnJ3pDzDOYvw7sCfqStPHEhmc=/0x0:480x480/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/Z/X/QKyPZbQ2ujBBwBo0g7Qg/giphy-1-.gif")
				.setFooter("/gerency nick")
				.addField(`Usuário alterado:`, `\`${userTag}\``)
				.addField(`Administrador que alterou:`, `\`${authorTag}\` | \`${author}\``)
				.addField(`Antigo nickname:`, `\`${(member.nickname ? member.nickname : userUsername)}\``)
				.addField(`Novo nickname:`, `\`${nickChars(nick)}\``)
    		.setColor(`#00EEEE`);

			member.setNickname(nickChars(nick));
			return embedder(nickEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'ticketrole'){
		try{
			if(!res.ticketRole) return messagerEphemeral(`Ops! O sistema de tickets ainda não está ativado no servidor. Para ativar, use o seguinte comando: \`/gerency ticket\`. Após ativar, use este comando novamente. :wink:`);

			await interaction.deferReply();

			let roleEmbed = new MessageEmbed()
    		.setTitle(`Cargo para menção em tickets`)
				.setDescription(`Agora, o cargo para ser mencionado quando um ticket for aberto será:\n> <@&${string}>`)
				.setFooter(`Ação por: ${authorTag}`)
    		.setColor(`#00EEEE`);
			
			res.ticketRole = string;
			res.save();

			return embedder(roleEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'ticket'){
		try{
			await interaction.deferReply();
			let ticketEmbed = new MessageEmbed()
    		.setTitle(`Sistema de tickets no servidor`)
				.setDescription(`Agora, o sistema de tickets no servidor está ${string == 'on' ? `ativado! Para qualquer usuário abrir um, basta utilizar o comando \`/geral ticket\` :smile:` : `desativado, e **não** será possível abrir um ticket com o comando \`/geral ticket\` :wink:`}`)
				.setFooter(`Ação por: ${authorTag}`)
    		.setColor(`#00EEEE`);
			
			res.ticketRole = string;
			res.save();
			return embedder(ticketEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'suggestionschannel'){
		try{
			await interaction.deferReply();
			let suggestionsEmbed = new MessageEmbed()
    		.setTitle(`Canal de sugestões do servidor`)
				.setDescription(`Agora, as sugestões enviadas através do comando \`/geral sugestao\` serão enviadas para o canal <#${string}> :wink:`)
				.setFooter(`Ação por: ${authorTag} | Para desativar, basta apagar o canal`)
    		.setColor(`#00EEEE`);
			
			res.channelSuggestions = string;
			res.save();
			return embedder(suggestionsEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'log'){
		try{
			let type = string;
			let text = interaction.options["_hoistedOptions"][1].value;
			let channel = interaction.options.getChannel('channel');
			let emoji;
			let color;

			switch(type){
				case 'add':
				emoji = ':green_circle:';
				color = '#00FF00';
				break;
				case 'del':
				emoji = ':red_circle:';
				color = '#FF0000';
				break;
				case 'none':
				emoji = ':white_circle:';
				color = '#FFFFFF';
				break;
			}

			let logEmbed = new MessageEmbed()
				.setTitle(`${emoji} Atualização`)
				.setAuthor(authorTag, `https://cdn.discordapp.com/avatars/${author}/${interaction.user.avatar}.png`)
				.setColor(color)
				.setDescription(`> ${maxChars(text)}`)
				.setThumbnail('https://static.wixstatic.com/media/77af00_204cff4bb058419ba81aa7b34ebca08f~mv2.gif')
				.setFooter(`Comando /gerency log`);

			channel.send({embeds: [logEmbed.toJSON()]});
			messagerEphemeral('Ok, o log foi enviado!');
		}catch(e){
			return err(e);
		}
	}
})
}
