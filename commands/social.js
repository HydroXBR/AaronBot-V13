const {
	MessageEmbed,
	MessageButton,
	MessageActionRow 
} = require("discord.js")

exports.commands = {
	'commands':['hug', 'caf', 'love', 'kiss', 'love', 'tap', 'sev', 'tok', 'hi']
}


exports.int = async(client, interaction) => {
	await interaction.deferReply();
	const action = interaction.options["_hoistedOptions"][0].value;
	const authorId = interaction.user.id;
	const userId = interaction.options["_hoistedOptions"][1].value;
	const author = client.users.cache.get(authorId);
	const user = client.users.cache.get(userId);
	const authorAvatar = `https://cdn.discordapp.com/avatars/${authorId}/${author.avatar}.png?size=1024`;
	const userAvatar = `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=1024`;
	const mentionAuthor = `<@${authorId}>`;
	const mentionUser = `<@${userId}>`;
	function chartUp(text){
		const a = new Array;
		const textSplit = text.split('')
		if(/['"]/gmi.test(textSplit[0])){
			a.push(textSplit[0])
			a.push(textSplit[1].toUpperCase())
		}else{
			a.push(textSplit[0].toUpperCase())
		}
		for(var i = (/['"]/gmi.test(textSplit[0]) ? 2 : 1); i < textSplit.length; i++){
			a.push(textSplit[i])
		}

		return a.join("")
	};

	var act;
	if(action == "hug"){
		act = {
			"acao":[
				{
					"rand": ["https://i.pinimg.com/originals/ea/b7/e2/eab7e2b3f32d3306f6c9840724b7df65.gif","https://media.tenor.com/images/003a3986b9557cb2a6fee36b54459bb9/tenor.gif","https://media.tenor.com/images/9d0f7d3c74a1ffb00fa6660a96015897/tenor.gif","https://media.tenor.com/images/9b620e36872db80072f07e987f63bd39/tenor.gif","https://www.icegif.com/wp-content/uploads/hug-icegif-3.gif","https://media.tenor.com/images/5acd718308f3d8212a9279d094ae8ea2/tenor.gif"],
					"title":"abraço",
					"p":"o",
					"action":"abraçar",
					"footer":"Que fofo!",
					"emoji":":hugging:"
				}
			]
		}
	}else if(action == "kiss"){
		act = {
			"acao":[
				{
					"rand":["https://www.portaldodog.com.br/cachorros/wp-content/uploads/2016/02/beijo-cachorro-14.gif","https://imgur.com/lYQt9rx.https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif","https://media.tenor.com/images/338b948758c24e9b347e5b8d8db01624/tenor.gif","https://i.pinimg.com/originals/de/8c/94/de8c941bff621731fcf4ed8cbf6542c3.gif"],
					"title":"beijo",
					"p":"o",
					"action":"dar um beijo em",
					"footer":"Que fofinho!",
					"emoji":":heart:"
				}
			]
		}
	}else if(action == "love"){
		act = {
			"acao":[
				{
					"rand":["https://gifman.net/wp-content/uploads/2019/06/eu-te-amo.gif","https://i.pinimg.com/originals/99/b6/a6/99b6a64ce4a7cb38619ed32d324e6907.gif"],
					"title":"\"eu te amo\"",
					"p":"o",
					"action":"dizer que ama a(o)",
					"footer":"Que amorrr!",
					"emoji":":heart:"
				}
			]
		}
	}else if(action == "tap"){
		act = {
			"acao":[
				{
					"rand":["https://mensagenseatividades.com/wp-content/uploads/2017/05/gifs-com-gatos-e-c%C3%A3es.gif","https://i.pinimg.com/originals/84/8b/ce/848bce754d3bb524c1e71a781fdb71c4.gif","https://i.pinimg.com/originals/49/67/6b/49676b74bb029547ad5c9d142cf709fc.gif"],
					"title":"tapinha",
					"p":"o",
					"action":"dar um tapinha em",
					"footer":"Ui, ui!",
					"emoji":":grimacing:"
				}
			]
		}
	}else if(action == "sev"){
		act = {
			"acao":[
				{
					"rand":["https://thumbs.gfycat.com/ClumsyHalfCoypu-small.gif","https://media4.giphy.com/media/fGC7N1NYAEEaRAcxaQ/giphy.gif","https://c.tenor.com/P8mkY467HMEAAAAd/bravo-dog.gif","https://c.tenor.com/rXbhcq-GOpMAAAAM/kwurkie-dog.gif"],
					"title":"olhar sério",
					"p":"o",
					"action":"olhar sério para",
					"footer":"Eitaaa!",
					"emoji":":grimacing:"
				}
			]
		}
	}else if(action == "tok"){
		act = {
			"acao":[
				{
					"rand":["https://media1.tenor.com/images/9bd8751fb360a8111d93a95024138e0c/tenor.gif?itemid=4921005","http://www.insanos.com.br/img/toca_ai_maninho.gif","https://media4.giphy.com/media/H689iuTAD49djEc4pt/giphy-downsized-large.gif","https://c.tenor.com/H4CPmZt-rOUAAAAd/toca-aqui-puppy.gif","https://64.media.tumblr.com/779ec383358ae6a16b78d67d37bb1b9a/tumblr_o6rp9sxpR51vnc4axo1_400.gif","https://2.bp.blogspot.com/-BUEy93-2GXc/VzYQcPwganI/AAAAAAAAUs8/lk1oxGIZruYUhWp64IfRB7vUGPqvkwXvgCLcB/s400/Gif%2BToca%2Baqui%2Bgatinho.gif"],
					"title":"\"toca aqui\"",
					"p":"o",
					"action":"fazer um \"toca aqui\" com",
					"footer":"Aeeee!",
					"emoji":":smile:"
				}
			]
		}
	}else if(action == "caf"){
		act = {
			"acao":[
				{
					"rand":["https://media.tenor.com/images/fe3e2fbf6e12bbb0acf05741db037f62/tenor.gif","https://thumbs.gfycat.com/BoringFavorableDuckling-max-1mb.gif"],
					"title":"cafuné",
					"p":"a",
					"action":"fazer cafuné em",
					"footer":"Que fofinhooo!",
					"emoji":":blush:"
				}
			]
		}
	}else if(action == "hi"){
		act = {
			"acao":[
				{
					"rand":['https://media.tenor.com/images/5a5296439b011c94d89d533f779c254f/tenor.gif','https://maisvideos.me/wp-content/uploads/2018/09/pinguin-recurta-bebe-dizendo-oi.gif'],
					"title":"oi",
					"p":"o",
					"action":"acenar com um oi para",
					"footer":"Oieee :)",
					"emoji":":smile:"
				}
			]
		}
	};;

	const embed = new MessageEmbed()
		.setTitle(chartUp(act.acao[0].title))
		.setImage(act.acao[0].rand[Math.floor(Math.random() * act.acao[0].rand.length)])
		.setDescription(`${mentionAuthor} acaba de ${act.acao[0].action} ${mentionUser} ${act.acao[0].emoji}`)
		.setThumbnail(authorAvatar)
		.setFooter(act.acao[0].footer)
		.setColor("#00EEEE");
	const embedretry = new MessageEmbed()
		.setTitle(chartUp(act.acao[0].title))
		.setImage(act.acao[0].rand[Math.floor(Math.random() * act.acao[0].rand.length)])
		.setDescription(`${mentionUser} acaba de retribuir ${act.acao[0].p} ${act.acao[0].title} de ${mentionAuthor} ${act.acao[0].emoji}`)
		.setThumbnail(userAvatar)
		.setFooter(act.acao[0].footer)
		.setColor("#00EEEE");

	const retry = new MessageActionRow().addComponents(
			new MessageButton().setStyle("SUCCESS").setLabel("🔁 Retribuir").setCustomId("retry_social")
		);

	interaction.editReply({embeds: [embed.toJSON()], components: [retry]});
  const filter = i => i.customId == "retry_social" && i.user.id === userId;
	const collector = interaction.channel.createMessageComponentCollector({ filter });
	collector.on("collect", async i => {
		if (i.customId === "retry_social") {
			await client.channels.cache.get(interaction.channelId).send({content: `${mentionUser} 🔁 ${mentionAuthor}`, embeds: [embedretry]});
		}
	});
}
