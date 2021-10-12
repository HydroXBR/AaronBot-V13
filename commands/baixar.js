const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const youtubesearchapi = require("youtube-search-api");

exports.int = async(client, interaction) => {
  const link = interaction.options['_hoistedOptions'][0].value;
  if(/https?/gmi.test(link) && /youtube/gmi.test(link)){
    let linkbaixar = link.replace("youtube.com", "youtubex2.com");

    const row = new MessageActionRow()
		.addComponents(
    	new MessageButton()
        .setStyle('LINK')
        .setURL(linkbaixar) 
        .setLabel('⬇️ Baixar'),
    	new MessageButton()
        .setStyle('LINK')
        .setURL(link) 
        .setLabel('▶️ Assistir no YouTube')
			);

    let embed1 = new MessageEmbed()
      .setTitle("Download")
          .addField(`:link: **Link do YouTube**`, `\`\`\`${link}\`\`\``)
          .setThumbnail("https://trucao.com.br/wp-content/uploads/2018/07/youtube-logo.png")
          .setColor("#00EEEE");

    interaction.reply({embeds: [embed1.toJSON()], components: [row]});
  }else if(!/https?/gmi.test(link)){
    const search = interaction.options['_hoistedOptions'][0].value;
    const results = await youtubesearchapi.GetListByKeyword(search, true);
		
    if(!results || !results.items.length) return interaction.reply({ content: `Ops! O vídeo não foi encontrado, tente novamente :wink:`, ephemeral: true });
		
		let videoId = results.items[0].id;
		let videoTitle = results.items[0].title;
    let link = `https://www.youtube.com/watch?v=${videoId}`;
    let linkbaixar = `https://ytop1.com/Youtube/${videoId}`;

		const row = new MessageActionRow()
		.addComponents(
    	new MessageButton()
        .setStyle('LINK')
        .setURL(linkbaixar) 
        .setLabel('⬇️ Baixar'),
    	new MessageButton()
        .setStyle('LINK')
        .setURL(link) 
        .setLabel('▶️ Assistir no YouTube')
		);

    let embed2 = new MessageEmbed()
      .setTitle("Download")
        .addField(`${client.emojis.cache.get('887937997738233916')} **Vídeo**`, `\`\`\`${videoTitle}\`\`\``)
        .addField(`:link: **Link do YouTube**`, `\`\`\`${link}\`\`\``)
        .setThumbnail(results.items[0].thumbnail.thumbnails[0].url || "https://trucao.com.br/wp-content/uploads/2018/07/youtube-logo.png")
        .setColor("#00EEEE");
    
    interaction.reply({embeds: [embed2.toJSON()], components: [row]});
    }else if(/https?/gmi.test(link) && !/youtube/gmi.test(link)){
      interaction.reply({ content: `Ops! Esse não parece ser um link para um vídeo do YouTube! Tente novamente :wink:`, ephemeral: true });
    };
};
