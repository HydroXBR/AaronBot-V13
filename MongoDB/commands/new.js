const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const db = require("quick.db");
const sites = require('../sites.json');

exports.int = async(client, interaction) => {
	await interaction.deferReply();
	try{
		let ids = db.get('idsnormal');
		let idstech = db.get('idstech');
		let idserr = new Array;
		let idstecherr = new Array;
		let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
		let messager = msg => interaction.editReply({ content: msg });
		let messagerEphemeral = msg => interaction.editReply({ content: msg, ephemeral: true });
		let link = interaction.options['_hoistedOptions'][0].value;
		let image = interaction.options['_hoistedOptions'][1].value;
    let title = interaction.options['_hoistedOptions'][2].value;
    let subtitle = interaction.options['_hoistedOptions'][3].value;
    let content = interaction.options['_hoistedOptions'][4].value.replace(/\\n/gmi, '\n');
		let noticer = interaction.options['_hoistedOptions'][5].value;
		let type = interaction.options['_hoistedOptions'][6].value;
		let thumb = undefined;
		let cor = undefined;
    let leiamais = `\n\n[Leia mais clicando aqui](${link})`;
    let footer = `\n\n\n*Hey! Se quiser que eu envie notícias no seu servidor, me adicione nele [CLICANDO AQUI](https://abre.ai/aaronbott) e depois, digite: \`/addnews\` → para saber mais, acesse a página News no meu site, [CLICANDO AQUI](https://abre.ai/aaronnews)*`;

		for(var i = 0; i < sites.n.length; i++){
			let noticeRegex = new RegExp(noticer, 'gmi');
			if(noticeRegex.test(sites.n[i].title)){
				thumb = sites.n[i].image;
				cor = sites.n[i].color;
				};
			};

		if(!thumb || !cor) return messagerEphemeral('Erro: não identifiquei a organização que você forneceu!');

    //-----------------------embed----------------------

    const embed = new MessageEmbed()
      .setTitle(title)
      .setThumbnail(thumb)
      .setColor(cor)
      .setImage(image)
      .setDescription(`*${subtitle}*\n\n` + content + footer)
      .setTimestamp()
      .setFooter(`Para desativar, use o comando addnews e especifique a função off`)

		const row = new MessageActionRow()
		.addComponents(
    	new MessageButton()
        .setStyle('LINK')
        .setURL(link) 
        .setLabel("Leia a notícia na íntegra 📰"),
    	new MessageButton()
        .setStyle('LINK')
        .setURL('https://abre.ai/aaronbott') 
        .setLabel('Me adicione! 🤖')
			);

		if(type == 'normal'){
			for(var i = 0; i < ids.length; i++){
        try{
          let chann = client.channels.cache.get(ids[i]);
          chann.send({ embeds: [embed.toJSON()], components: [row] });
          console.log(`Enviado para o canal ${ids[i]} - OK`);
					embedder(new MessageEmbed().setTitle('Canais com erro').setDescription(`${idserr.join('\n')}`).setColor('#FF0000'))
        }catch(error){
          console.log(`O canal de ID ${ids[i]} está com problema!`);
					idserr.push(ids[i]);
        }
			}
		}else if(type == 'tech'){
			for(var i = 0; i < ids.length; i++){
        try{
          let chann = client.channels.cache.get(ids[i]);
          chann.send({ embeds: [embed.toJSON()], components: [row] });
          console.log(`Enviado para o canal ${ids[i]} - OK`);
        }catch(error){
          console.log(`O canal de ID ${ids[i]} está com problema!`);
					idserr.push(ids[i]);
        }
			}
			for(var i = 0; i < idstech.length; i++){
        try{
          let chann = client.channels.cache.get(idstech[i]);
          chann.send({ embeds: [embed.toJSON()], components: [row] });
          console.log(`Enviado para o canal ${idstech[i]} TECH - OK`);
        }catch(error){
          console.log(`O canal de ID ${idstech[i]} TECH está com problema!`);
					idstecherr.push(idstech[i]);
        }
			}

			embedder(new MessageEmbed().setTitle('Canais com erro').setDescription(`${idserr.join('\n')}\n\n${idstecherr.join(' (T)\n')}`).setColor('#FF0000'))
		}
	}catch(e){
		console.log(e)
	}
}
