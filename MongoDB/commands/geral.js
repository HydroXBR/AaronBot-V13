const { 
	MessageActionRow, 
	MessageEmbed, 
	MessageSelectMenu, 
	MessageButton 
	} = require("discord.js"),
	db = require("quick.db"),
	wait = require("util").promisify(setTimeout),
	jimp = require("jimp"),
	{ DiscordTogether } = require('discord-together'),
	canvas = require('canvas');

exports.commands = {
	'commands':['convite', 'botinfo', 'donate', 'feedback', 'servericon', 'serverinfo', 'userinfo', 'vote', 'news', 'deleteaaron', 'ticket', 'sugestao', 'youtubetogether']
}

exports.int = async(client, interaction) => {
	// Interaction content 
	let addZero = num => num < 10 ? "0" + num : num;
	let author = interaction.user.id;
	let authorTag = interaction.user.username + `#` + interaction.user.discriminator;
	let command = interaction.options["_subcommand"];
	let string = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : null;
	let feedbackChannel = client.channels.cache.get('848775464548827158')
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.reply({ content: msg, ephemeral: true });
	let err = e => messagerEphemeral("Ops, me desculpe! Não consegui executar o comando. Por favor, tente novamente mais tarde.");
	let dateFormat = date => `<t:${Math.floor(date / 1000)}:R>`;
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
	async function del(id){
    const all = db.all(); 
    const regexId = new RegExp(id);
    const array = new Array;
    for(var i = 0; i < all.length; i++){
      if(regexId.test(db.all()[i].ID)){
        array.push(all[i].ID);
      }
    };
    if(!array[0]) return;
    for(var e = 0; e < array.length; e++){
      db.delete(array[e]);
    };
   };

	if(command == 'convite'){
		try{
			await interaction.deferReply();
			const addEmbed = new MessageEmbed()
      	.setTitle(`Me adicione no seu servidor :)`)
      	.setDescription(`Olá! Muuito obrigado pela confiança ${client.emojis.cache.get("852676274815107092")}!\n\nAcesse o link abaixo para me adicionar no seu servidor:\n> https://abre.ai/aaronbott ${client.emojis.cache.get("853819002619297792")}\n\nSe quiser, entre também no meu servidor oficial, para encontrar outros usuários ou obter ajuda:\n> https://discord.gg/chnhwPBVxX`)
      	.setColor("#00EEEE")
      	.setThumbnail("https://i.ibb.co/JjGRPwV/Bot.png");
			embedder(addEmbed);
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'botinfo'){
		try{
			await interaction.deferReply();
			const infoEmbed = new MessageEmbed()
    		.setTitle(`Bot Info - Aaron Bot`)
    		.setColor("#00EEEE")
    		.setThumbnail("https://i.ibb.co/JjGRPwV/Bot.png")
    		.setImage(`https://i.ibb.co/V3sDH1K/Aaron-Banner.png`)
    		.setDescription(`**Olá!**\nSou o <@800510988973506601>, um simples bot de **administração**, **informação** e **diversão**, para fazer com que sua comunidade se divirta bastante e tornar processos mais práticos! :smile:\n> :scroll: Ao me utilizar, você concorda com meus **[Termos de Uso](https://sites.google.com/view/aaronbotsite/termos-de-uso)**\n\n**Dados básicos**\n> :mag_right: **Minha ID:** \`800510988973506601\`\n> :newspaper: **Para ver meus comandos:** \`/help\`\n> :bust_in_silhouette: **Nickname Discord:** \`Aaron (-)#5209\`\n\n**Links úteis**\n> :robot: **[Me adicione no seu servidor](https://abre.ai/aaronbot-)**\n> :incoming_envelope: **[Contato](https://forms.gle/mu7LYabhNd6E1fFZ8)**\n> :globe_with_meridians: [Aaron Site](https://abre.ai/aaronbotsite)\n> ${client.emojis.cache.get('863048436601585696')} [GitBook Aaron](https://abre.ai/aarongitbook)\n> **:love_letter: [Servidor de suporte](https://discord.gg/chnhwPBVxX)**\n\n**Estatísticas**\n> :satellite: **Servidores:** ${client.guilds.cache.size}\n> :speech_balloon: **Canais:** ${client.channels.cache.size}\n> :open_file_folder: **Comandos:** 118\n> :floppy_disk:  **Memória RAM**: ${(process.memoryUsage().heapUsed / 1e6).toFixed(3) + "MB"}\n\n**Dados técnicos**\n> ${client.emojis.cache.get('863487572356366337')} **Programado em:** JavaScript, Node.js\n> ${client.emojis.cache.get('863487927946444802')} **Programado por:** \`Psy#1518\`, com o apoio de \`Alphka#5575\`\n> ${client.emojis.cache.get('863488146893439017')} **Livraria:** Discord.js`)
    		.setFooter('Jesus loves you ♥');
			return embedder(infoEmbed);
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == 'donate'){
		try{
			await interaction.deferReply();
			let donateEmbed = new MessageEmbed()
    		.setTitle("Doe :heart:")
    		.setThumbnail(`https://i.pinimg.com/originals/65/a1/34/65a134a915c1bcc0f217822df555ff70.gif`)
    		.setDescription(`:right_facing_fist: **Ajude o bot a ficar online!** :left_facing_fist:\n\nPara me ajudar a ficar online, e os adms (hehe :kissing_closed_eyes:), você pode fazer um **PIX** e mandar o comprovante no canal <#849151083333812245> do meu [Servidor Oficial](https://discord.gg/A85ZWjFbqm) ou no email do PIX, e aparecer neste comando (\`/geral donate\`) e talvez até no meu status por alguns dias, caso decidido pelos meus técnicos, além de ganhar um dinheiro no meu sistema em agradecimento... :star_struck:\n\n**#FazOPIX:**\n> \`aaronbotjs@gmail.com\`\n\n*Qualquer valor é bem-vindo, muito obrigado!* :hugging:\n\n**Pessoas que doaram e me amam demais ♥:**\nMarco Aurélio ♥ :cry:`)
    		.setFooter("Muito obrigado ♥")
    		.setColor("#00EEEE");
			return embedder(donateEmbed);
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == 'feedback'){
		try{
			let feedbackEmbed = new MessageEmbed()
  			.setTitle(`Novo feedback :)`)
  			.setThumbnail("https://cdn.dribbble.com/users/616823/screenshots/3786967/breton-feedback-box.gif")
    		.setColor(`#00EEEE`)
    		.setDescription(`**Sugestão:**\n\`\`\`${maxChars(string)}\`\`\`\n\nAutor: \`${authorTag}\` | \`${author}\`\nServidor: \`${interaction.guild.name}\` | \`${interaction.guild.id}\``)
     		.setFooter(`Seu feedback é muito importante ♥ • Para enviar, digite em qualquer servidor: -feedback`);
				
			feedbackChannel.send({embeds: [feedbackEmbed.toJSON()]})
			return messagerEphemeral(`Ok, <@${author}>! Seu feedback foi enviado com sucesso! :smile:\nObrigado :heart:`);
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == 'servericon'){
		try{
			await interaction.deferReply();
			if(!interaction.member.guild.icon) return messagerEphemeral(`<@${author}>, este servidor não possui um ícone! :confused:`);

			let serverIcon = `https://cdn.discordapp.com/icons/${interaction.member.guild.id}/${interaction.member.guild.icon}.jpg?size=2048`;
			let serverIconWEBP = `https://cdn.discordapp.com/icons/${interaction.member.guild.id}/${interaction.member.guild.icon}.webp?size=2048`;
			let serverIconPNG = `https://cdn.discordapp.com/icons/${interaction.member.guild.id}/${interaction.member.guild.icon}.png?size=2048`;

			let iconeEmbed = new MessageEmbed()
    		.setTitle("Ícone do servidor")
				.setDescription("Clique em um dos botões para acessar o ícone em outros formatos.")
    		.setImage(serverIcon)
				.setFooter(`${interaction.member.guild.name} | ${interaction.member.guild.id}`)
    		.setColor("#00EEEE");
			
			const iconeLinks = new MessageActionRow()
				.addComponents(
    			new MessageButton()
        		.setStyle('LINK')
        		.setURL(serverIcon) 
        		.setLabel('JPG'),
    			new MessageButton()
        		.setStyle('LINK')
        		.setURL(serverIconWEBP) 
        		.setLabel('PNG'),
					new MessageButton()
        		.setStyle('LINK')
        		.setURL(serverIconPNG) 
        		.setLabel('WEBP')
					);

			interaction.editReply({embeds: [iconeEmbed.toJSON()], components:[iconeLinks]});
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == 'userinfo'){
		try{
			await interaction.deferReply();
  		const user1 = interaction.options['_hoistedOptions'][0].member;
			const userTag = user1.user.username + `#` + user1.user.discriminator;
  		const avatarLink = `https://cdn.discordapp.com/avatars/${user1.user.id}/${user1.user.avatar}.png?size=1024`;
			let d = new Date(user1.joinedTimestamp)
    	let datetime = addZero(d.getDate()) + "/" + addZero((d.getMonth()+1))  + "/" + d.getFullYear()/* + " - "  + addZero((d.getHours()-2)) + ":"  + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds())*/
    	let c = new Date(user1.user.createdAt)
    	let datetimec = addZero(c.getDate()) + "/" + addZero((c.getMonth()+1))  + "/" + c.getFullYear()/* + " - "  + addZero((c.getHours()-2)) + ":"  + addZero(c.getMinutes()) + ":" + addZero(c.getSeconds())*/
			const roles = new Array;
			for(var i = 0; i<user1._roles.length; i++){
				roles.push(`<@&${user1._roles[i]}>`)
			};

			const userEmbed = new MessageEmbed()
      	.setTitle("Informações do usuário")
      	.setColor('#00EEEE')
      	.setThumbnail(avatarLink)
      	.addField(":hash:  Tag Discord:", `\`${userTag}\``)
      	.addField(":mag:  ID: ", `\`${user1.user.id}\``)
				.addField(`:bust_in_silhouette: Conta criada em:`, `${datetimec} [${dateFormat(user1.user.createdAt)}]`)
      	.addField(`:globe_with_meridians: Entrou no servidor em:`, `${datetime} [${dateFormat(user1.joinedTimestamp)}]`)
     		.addField(':briefcase:  Cargos: ', roles.join(' '));
			
			if(user1.user.bot) userEmbed.addField(`:robot: Mais informações`, `> Este usuário é um **bot**.\n> [Link para adicionar (permissões básicas, nenhuma administrativa)](https://discord.com/oauth2/authorize?client_id=${user1.user.id}&permissions=517882633921&scope=bot%20applications.commands)`);
				
			return embedder(userEmbed);
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'serverinfo'){
		try{
			await interaction.deferReply();
			let guild = interaction.member.guild;
			let d = new Date(guild.createdAt);
    	let createdAt = addZero(d.getDate()) + "/" + addZero((d.getMonth()+1))  + "/" + d.getFullYear();
			let guildRoles = guild.roles.cache.map(e => e.name).length;
			let guildChannels = guild.channels.cache.filter(e => e.type !== 'GUILD_CATEGORY').map(e => e.type).length;
			let guildEmojis = guild.emojis.cache.map(e => e.name).length;
			let guildChannelsVoice = guild.channels.cache.filter(e => e.type == 'GUILD_VOICE').map(e => e.type).length;
			let guildChannelsText = guild.channels.cache.filter(e => e.type == 'GUILD_TEXT').map(e => e.type).length;
			let guildChannelsNews = guild.channels.cache.filter(e => e.type == 'GUILD_NEWS').map(e => e.type).length;
			let guildChannelsStage = guild.channels.cache.filter(e => e.type == 'GUILD_STAGE_VOICE').map(e => e.type).length;
			let serverIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=2048` : 'https://www.iconpacks.net/icons/1/free-user-group-icon-296-thumb.png';
			const serverEmbed = new MessageEmbed()
    		.setThumbnail(serverIcon)
    		.setColor("#00EEEE")
    		.setTitle("Informações do servidor")
				.setFooter(guild.verified ? `Servidor verificado pelo Discord` : `Servidor não verificado pelo Discord`, guild.verified ? 'https://cdn.worldvectorlogo.com/logos/twitter-verified-badge-1.svg' : 'https://icons-for-free.com/iconfiles/png/512/green+lock+privacy+safe+secure+security+icon-1320196713520107078.png')
    		.addFields(
					{
        		name: ":information_source: Nome do servidor",
        		value: `\`${guild.name}\``,
        		inline: true
        	},
        	{
        		name: ":crown: Dono do servidor",
        		value: (guild.ownerId ? `\`${guild.ownerId}\`` : `Ninguém`),
        		inline: true
        	},
					{
       			name: ":date: Data de criação",
        		value: createdAt + ` [${dateFormat(guild.createdAt)}]`,
        		inline: true
        	},
        	{
        		name: ":busts_in_silhouette: Membros",
        		value: `${guild.memberCount} membros.`,
        		inline: true
					},
        	{
        		name: ":briefcase: Cargos",
        		value: `${guildRoles} cargos`,
        		inline: true,
					},
        	{
        		name: '<:boost:847343656994078752> Boosters',
        		value: guild.premiumSubscriptionCount < 0 ? `${guild.premiumSubscriptionCount} boosters` : `Não há boosters`,
        		inline: true
					},
        	{
        		name: ":grin: Emojis",
        		value: guildEmojis > 0 ? `Há ${guildEmojis} emojis` : 'Não há emojis',
       			inline: true
					},
        	{
        		name: ":speech_left: Canais: " + guildChannels,
        		value: `:speech_balloon: **Texto:** ${guildChannelsText}\n:microphone2: **Voz:** ${guildChannelsVoice}\n:loudspeaker: **Anúncios:** ${guildChannelsNews}\n:loud_sound: **Palco:** ${guildChannelsStage}`,
        		inline: true
					},
					{
        		name: "⠀",
        		value: `⠀`,
        		inline: true
        	}
    	)
			return embedder(serverEmbed)
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'vote'){
		try{
			await interaction.deferReply();
			let voteEmbed = new MessageEmbed()
    		.setTitle("Vote e me ajude a crescer ♥")
    		.setColor("#00EEEE")
    		.setThumbnail("https://media1.giphy.com/media/lQ6KHKqQaPrx7CBhPD/giphy.gif")
    		.setDescription(`Obrigado por votar, assim você me ajuda bastante!!! No momento, estou disponível em duas botlists.\n\n${client.emojis.cache.get('864381582298054656')} | [**Top.GG**](https://top.gg/bot/800510988973506601)\n${client.emojis.cache.get('864381165254475826')} | **[BestList](https://bestlist.online/bots/800510988973506601)**`)
    		.setFooter("Jesus loves you ♥");
			return embedder(voteEmbed);
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'news'){
		try{
			await interaction.deferReply();
			let newsEmbed = new MessageEmbed()
    		.setTitle(`News`)
      	.setColor('#00EEEE')
      	.setThumbnail('https://i.pinimg.com/originals/57/cb/46/57cb46de34f5803c75582936435daa75.gif')
      	.setDescription(`Oi!\n\nA funcionalidade \`news\` é uma das que mais me destaca, visto que é uma função exclusiva e que há pouquíssimos bots com esse sistema (se é que tem haha)\n\nAo ativar a funcionalidade \`news\`, basta utilizar o comando \`/addnews\`, inserir o canal e especificar o tipo de notícias que você deseja. - só! E a partir daí, quando sair uma notícia, ela será enviada para o canal solicitado.`)
      	.addField(`Saber mais:`, `Acesse: https://abre.ai/aaronnews`)
			return embedder(newsEmbed);
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'ticket'){
		try{
			await interaction.deferReply();
			let user = author;
			let guild = interaction.member.guild.id;
    	let name = "ticket-" + user;
			/*if(!db.get(`tk${guild}`)) return messagerEphemeral(`Ops! Por favor, peça para que um administrador do servidor use o comando \`/set\` para ativar a abertura de tickets neste servidor :wink:`);*/
			if(interaction.member.guild.channels.cache.filter(m => m.name == `ticket-${user}`).size >= 1) return messagerEphemeral('Já há um ticket que você abriu! Insira seu problema ou dúvida nele :wink:');
			let ticketopenembed = new MessageEmbed()
        .setColor("#00EEE")
        .setThumbnail("https://i.pinimg.com/originals/e1/c6/9e/e1c69ebb1bcc9e8b319e584abe4b61a9.gif")
        .setImage()
        .setTitle(':tickets: Ticket')
        .setDescription(`Para abrir um ticket de suporte, clique no botão abaixo.`)
        .setTimestamp()
        .setFooter(`Ticket solicitado por ${authorTag}`);
			let ticketembed = new MessageEmbed()
        .setTitle("Ticket de suporte")
        .setDescription(`Aqui, você pode explicar seu problema ou sua dúvida, anexar arquivos, prints, etc. que ajudem a equipe de suporte a resolver seu problema.\n\n**Atenção:**\n\n*Apesar de eu ter marcado @everyone, apenas você a administração/staff do servidor podem ver esta conversa.*\n\nNão marque, por favor, os membros da equipe de suporte/staff. Se for urgente, contate-os no privado.\n\nPara o(s) administrador(es): Para fechar o ticket, basta apagar o canal, usando \`/gerency deletechannel\``)
        .setThumbnail("https://i.pinimg.com/originals/e1/c6/9e/e1c69ebb1bcc9e8b319e584abe4b61a9.gif")
        .setColor("#00EEE")
        .setFooter(`Ticket solicitado por ${authorTag} | ${user}`);
			const openTicket = new MessageActionRow()
				.addComponents(
					new MessageButton()
        		.setStyle('PRIMARY')
        		.setCustomId('ticketopen')
        		.setLabel('🎫 Abrir ticket')
					);
			interaction.editReply({ embeds: [ticketopenembed.toJSON()], components:[openTicket]});
			const filter = i => i.customId == "ticketopen" && i.user.id === author;
			const collector = interaction.channel.createMessageComponentCollector({ filter });
			collector.on("collect", async i => {
				if (i.customId === "ticketopen") {
					interaction.member.guild.channels.create(name).then((chan)=>{
						chan.permissionOverwrites.create(chan.guild.roles.everyone, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
						chan.permissionOverwrites.create(user, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ATTACH_FILES: true, READ_MESSAGE_HISTORY: true, ADD_REACTIONS: true });
						return chan.send({ embeds: [ticketembed.toJSON()] })
					})
				}
			});
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'youtubetogether'){
		try{
			await interaction.deferReply();
			let channel = interaction.member.voice.channel;
			if(!channel) return messagerEphemeral('Ops! Você precisa entrar em um canal de voz, antes! :wink:')
			let channelId = channel.id;
			client.discordTogether = new DiscordTogether(client);
  		client.discordTogether.createTogetherCode(channelId, 'youtube').then(async invite => {
    		if(invite.error) return messagerEphemeral(`Ops! Não consegui criar o invite. Verifique se tenho permissões necessárias no canal de voz no qual você está. :wink:`);
    		let youtubeEmbed = new MessageEmbed().setTitle('YouTube Together').setDescription(`Clique no botão abaixo para acessar a sala com a funcionalidade YouTube Together.`).setFooter('O link só funcionará se você estiver usando um computador.', 'https://i.ibb.co/JjGRPwV/Bot.png').setColor('#00EEEE').setThumbnail("https://logodownload.org/wp-content/uploads/2014/10/youtube-logo-6-2.png");
				const inviteUrl = new MessageActionRow()
				.addComponents(
					new MessageButton()
        		.setStyle('LINK')
        		.setURL(invite.code) 
        		.setLabel('▶️ Acesse a sala')
					);

				return interaction.editReply({embeds: [youtubeEmbed.toJSON()], components:[inviteUrl]});
			})
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'sugestao'){
		try{
			let suggestionsChannel = db.get(`sg${interaction.guildId}`);
			if(!suggestionsChannel) return messagerEphemeral('Ops! Parece que isso ainda não foi configurado por nenhum administrador do servidor. Peça para que algum deles use o comando \`/gerency suggestionchannel\` para configurar o canal para aonde serão enviadas as sugestões :wink:');

			const suggestionEmbed = new MessageEmbed()
    		.setTitle(`Sugestão adicionada!`)
    		.setDescription(`> ${maxChars(string)}\n\n*Para enviar uma, use o comando \`/geral sugestao\`*`)
				.setFooter(`Sugestão por ${authorTag}`, `https://cdn.discordapp.com/avatars/${author}/${interaction.member.user.avatar}.png`)
    		.setThumbnail("https://s2.glbimg.com/oeGnJ3pDzDOYvw7sCfqStPHEhmc=/0x0:480x480/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/Z/X/QKyPZbQ2ujBBwBo0g7Qg/giphy-1-.gif")
    		.setColor(`#00EEEE`);
			
			interaction.member.guild.channels.cache.get(suggestionsChannel).send({ embeds: [suggestionEmbed.toJSON()] });
			return messagerEphemeral('A sua sugestão foi enviada com sucesso! :wink:')
		}catch(e){
			console.log(e);
			return err(e);
		}
	}else if(command == 'deleteaaron'){
		try{
			await interaction.deferReply();
			const deleteEmbed = new MessageEmbed()
    		.setTitle(`Tem certeza?`)
    		.setDescription(`Ao clicar no botão "Ok, delete 🚮", **todos** os seus dados guardados no nosso sistema serão apagados, tais como dinheiro, objetos, carros, profissões e especialidades. Isso é algo irreversível. Para confirmar, basta clicar no botão abaixo.`)
    		.setThumbnail("https://media.baamboozle.com/uploads/images/112938/1613742504_15111_gif-url.gif")
    		.setColor("#FFFF00");

			const deletedEmbed = new MessageEmbed()
    		.setTitle(`Dados deletados`)
    		.setDescription(`Todos os seus dados foram deletados dos nossos sistemas. Alguns podem demorar a desaparecer de alguns comandos, mas em breve não serão mais computados.`)
    		.setColor("#00EEEE");

			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('cancel')
						.setLabel('Não quero deletar.')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('delete')
						.setLabel('Ok, delete 🚮')
						.setStyle('DANGER')
				);
			interaction.editReply({embeds: [deleteEmbed.toJSON()], components: [buttons]})
			
			const filter = i => (i.customId == "cancel" || i.customId == 'delete') && i.user.id === interaction.user.id;
			const collector = interaction.channel.createMessageComponentCollector({ filter });
			collector.on("collect", async i => {
				if (i.customId == "cancel") {
					return interaction.followUp('Ok, seus dados foram mantidos :smile:')
				}else if(i.customId == 'delete'){
					del(interaction.user.id);
					return interaction.followUp({embeds: [deletedEmbed.toJSON()]})
				}
			});
		}catch(e){
			console.log(e);
			return err();
		}
	}
}
