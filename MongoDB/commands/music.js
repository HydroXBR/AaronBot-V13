const { 
	MessageEmbed 
	} = require("discord.js"),
	ytdl = require("ytdl-core"),
	youtubesearchapi = require("youtube-search-api"),
	fetch = s => import('node-fetch').then(({
		default: fetch
	}) => fetch(s)),
	JSDOM = require("jsdom").JSDOM,
	replace = require('string.prototype.replaceall'),
	ffmpeg = require('ffmpeg'),
	avconv = require('avconv'),
	{ 
		joinVoiceChannel, 
		createAudioPlayer, 
		createAudioResource, 
		getVoiceConnection 
	} = require('@discordjs/voice');

exports.int = async(client, interaction) => {
	await interaction.deferReply();
	let command = interaction.options["_subcommand"];
	let string = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : null;
	const embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	const messager = msg => interaction.editReply({ content: msg });
	const messagerEphemeral = msg => interaction.editReply({ content: msg, ephemeral: true });
	const isURL = string => {try{new URL(string); return true}catch(e){return false}};
	function err(erro){
		console.log(erro);
		return messager("Ops, me desculpe! Não consegui executar o comando. Por favor, tente novamente mais tarde.");
	};
	const musicChannel = interaction.member.voice.channel;

	if(command == 'play'){
		try{
			const musicEmbed = new MessageEmbed().setTitle("Tocando agora").setColor("#0000FF").setFooter(`Para parar, use /music disconnect`);
			if(!musicChannel) return messagerEphemeral('Ops! Você precisa entrar em um canal de voz, antes! :wink:');
			var videoId;
  		var videoTitle;
			const videoNotFound = `❌ | Ops! Não consegui encontrar a música que você pediu 😕\nTente novamente, verifique a ortografia e o nome da música 😉`
			const rand = [
    		'https://i.pinimg.com/originals/9f/49/d8/9f49d80ae9e1e1623adcd63b9a18e1a6.gif', 'https://i.pinimg.com/originals/05/4a/a3/054aa3421c22e0c9e04ada3082066a8d.gif', "https://cdn.dribbble.com/users/1237300/screenshots/6478927/__-1_1_____.gif", 'https://i.pinimg.com/originals/9f/49/d8/9f49d80ae9e1e1623adcd63b9a18e1a6.gif', 'https://i.imgur.com/t8H8ist.gif?noredirect'
  		];
			const randA = rand[Math.floor(Math.random() * rand.length)];

			if(isURL(string)){
				const url = new URL(string);
				const urlSearch = new Object;

				url.search.replace("?", "").split("&").forEach(current => {
					current = current.split("=");
					urlSearch[current[0]] = current[1] || null;
				});

				videoId = urlSearch.v;
    		const response = await fetch(url);
				const text = await response.text();
				const html = new JSDOM(text.substr(15)).window.document;

    		videoTitle = html.querySelector(`meta[name="title"]`).content || html.querySelector("title").textContent.replace(" - YouTube", "");

    		const results = await youtubesearchapi.GetListByKeyword(videoTitle, true)

    		videoId = results.items[0].id
				videoTitle = results.items[0].title;

    		musicEmbed.setDescription(`**Música**: [${videoTitle}](https://www.youtube.com/watch?v=${videoId})\n**A pedido de:** <@${interaction.user.id}>`).setThumbnail(results.items[0].thumbnail.thumbnails[0].url || randA);

				const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {filter: "audioonly"});
    		const connection = joinVoiceChannel({
          channelId: musicChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.member.guild.voiceAdapterCreator
        })
    		const player = createAudioPlayer();
				const resource = createAudioResource(stream);

				async function play() {
				  await player.play(resource);
  				connection.subscribe(player);
				};

				play()
				return embedder(musicEmbed);
			}else{
				const results = await youtubesearchapi.GetListByKeyword(string, true)
				if(!results || !results.items.length) return messagerEphemeral(videoNotFound);
		
				videoId = results.items[0].id
				videoTitle = results.items[0].title;
    		musicEmbed.setDescription(`**Música**: [${videoTitle}](https://www.youtube.com/watch?v=${videoId})\n**A pedido de:** <@${interaction.user.id}>`).setThumbnail(results.items[0].thumbnail.thumbnails[0].url || randA);

    		if(!videoId) return await messagerEphemeral(videoNotFound);
				const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {filter: "audioonly"});
    		const connection = joinVoiceChannel({
          channelId: musicChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.member.guild.voiceAdapterCreator
        });
    		const player = createAudioPlayer();
				const resource = createAudioResource(stream, {type: 'opus'});

				async function play() {
				  await player.play(resource);
  				connection.subscribe(player);
				};

				play()
				return embedder(musicEmbed);
			}
		}catch(e){
			return err(e);
		}
	}else if(command == 'disconnect'){
		try{
			if(!musicChannel) return messagerEphemeral('Ops! Você precisa entrar em um canal de voz, antes! :wink:');
			const connection = getVoiceConnection(interaction.guildId);
			const channelId = connection.packets.state.channel_id;
			if(!connection) return messagerEphemeral('Ops! Não estou em um canal de voz nesse servidor!');
			
			connection.destroy();
			return embedder(new MessageEmbed().setTitle('Desconectado').setDescription(`Desconectei do canal <#${channelId}>.\n\nPara conectar novamente, basta usar o comando \`/music play\``).setFooter(`A pedido de ${interaction.user.username}#${interaction.user.discriminator}`).setColor('#00EEEE').setThumbnail('https://winaero.com/blog/wp-content/uploads/2017/06/microphone-dictation-speech-icon.png'));
		}catch(e){
			return err(e);
		}
	}
}
