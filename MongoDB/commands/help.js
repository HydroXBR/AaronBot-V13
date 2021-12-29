const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const json = require('../config.json')


exports.int = async (client, interaction) => {
	await interaction.deferReply();
	/*const pp = '/'
  const group = interaction.options['_hoistedOptions'][0] ? interaction.options['_hoistedOptions'][0].value : null;
  const adm = [];
  const info = [];
  const fun = [];
  const geral = [];
  const eco = [];
  const none = [];

  for (var i = 0; i < json.commands.length; i++){
    if(json.commands[i].category && (json.commands[i].showInHelp == true || json.commands[i].showInHelp == 'true')){
      if (/adm/i.test(json.commands[i].category)){
        adm.push("\`"+json.commands[i].name+"\`")
      }else if(/info/i.test(json.commands[i].category)){
        info.push("\`"+json.commands[i].name+"\`")
      }else if(/fun/i.test(json.commands[i].category)){
        fun.push("\`"+json.commands[i].name+"\`")
      }else if(/geral/i.test(json.commands[i].category)){
        geral.push("\`"+json.commands[i].name+"\`")
      }else if(/eco/i.test(json.commands[i].category)){
        eco.push("\`"+json.commands[i].name+"\`")
      }else{
        none.push("\`"+json.commands[i].name+"\`")
      }
    }
	}

  let embed = new MessageEmbed()
    .setTitle(`Help - Aaron`)
    .setColor("#00EEEE")
    .setThumbnail('https://cdn.dribbble.com/users/1788424/screenshots/5204144/9999.gif')
    .setImage(`https://i.ibb.co/V3sDH1K/Aaron-Banner.png`)
    .setDescription(`Sou o bot <@800510988973506601>, tenho comandos de diversão, informação, administração e muito mais :)\n\n:dividers: ⋙ **Prefixo:** Nenhum, meus comandos são todos Slash (comandos de barra) :smile:\n:robot: ⋙ **Mais informações:** \`${pp}botinfo\`\n:notepad_spiral: ⋙ **Saber sobre cada comando:** \`${pp}help <comando>\`\n\n:globe_with_meridians: ⋙ **Gerais**\n${geral.join(' | ')}\n\n:briefcase: ⋙ **Administração**\n${adm.join(' | ')}\n\n:soccer: ⋙  **Diversão**\n${fun.join(' | ')}\n\n:dollar:  ⋙ **Economia**\n${eco.join(' | ')}\n\n:newspaper: ⋙ **Info e utilidades**\n${info.join(' | ')}\n\n${none.join(' | ')}\n────────────────\n**Porque Deus amou o mundo de tal maneira que deu seu Filho unigênito, para que to do aquele que nele crer não pereça, mas tenha a vida eterna.** - João 3.16 :heart:
    `)
    .setFooter('Espero ter ajudado :D');*/

	let embed = new MessageEmbed()
    .setTitle(`Help - Aaron`)
    .setColor("#00EEEE")
    .setThumbnail('https://cdn.dribbble.com/users/1788424/screenshots/5204144/9999.gif')
    .setImage(`https://i.snipboard.io/vMs130.jpg`)
    .setDescription(`Sou o bot <@800510988973506601>, tenho comandos de diversão, informação, administração e muito mais :)\n\n:dividers: ⋙ **Prefixo:** Nenhum, meus comandos são todos Slash (comandos de barra) :smile:\n:robot: ⋙ **Mais informações:** \`/botinfo\`\n:globe_with_meridians: ⋙ **Contato:** https://abre.ai/aaronbotsite\n\n**Meus comandos são divididos em categorias. Então, basta digitar o nome da categoria junto com o comando, após a categoria. Exemplo: \`/eco daily\`**\n\n:globe_with_meridians: ⋙ **geral**\n\`${require('./geral').commands.commands.join('\` | \`')}\`\n\n:briefcase: ⋙ **administrator**\n\`${require('./administrator').commands.commands.join('\` | \`')}\`\n\n:soccer: ⋙  **fun**\n\`${require('./fun').commands.commands.join('\` | \`')}\`\n\n:dollar:  ⋙ **eco**\n\`${require('./eco').commands.commands.join('\` | \`')}\`\n\n:newspaper: ⋙ **info**\n\`${require('./info').commands.commands.join('\` | \`')}\`\n────────────────\n**Porque Deus amou o mundo de tal maneira que deu seu Filho unigênito, para que to do aquele que nele crer não pereça, mas tenha a vida eterna.** - João 3.16 :heart:
    `)
    .setFooter('Espero ter ajudado :D');

		return interaction.editReply({ embeds: [embed.toJSON()] })

  /*let helprow = new MessageActionRow().addComponents(
		new MessageButton()
    	.setStyle('LINK')
    	.setURL('https://abre.ai/aaronbotsite') 
    	.setLabel('Site oficial 🌐'),
  	new MessageButton()
    	.setStyle('LINK')
    	.setURL('https://top.gg/bot/800510988973506601') 
    	.setLabel('Vote 👍'),
  	new MessageButton()
    	.setStyle('LINK')
    	.setURL('https://abre.ai/aaronbott') 
   		.setLabel('Me adicione ❤️')
	);

  if(group){
    let command = new RegExp(group)
    let cmd = []
    let desc = [];
    let sintax = [];
    let infos = [];
    let similares = [];
    let category = [];
      
    for (var i = 0; i < json.commands.length; i++){
      let descricao = json.commands[i].description;
      let sintaxe = json.commands[i].sintax;
      let informacoes = json.commands[i].info;
      let similaress = json.commands[i].similar;
      let cat = json.commands[i].category ? json.commands[i].category : false;
      if (command.test(json.commands[i].name) && json.commands[i].showInHelp !== false){
        cmd.push(json.commands[i].name);
        /Nenhuma i/.test(descricao) || descricao == false ? desc.push('nonenone') : desc.push(json.commands[i].description);
        /Nenhuma i/.test(sintaxe) || sintaxe == false ? sintax.push('nonenone') : sintax.push(json.commands[i].sintax);
        /Nenhuma i/.test(informacoes) || informacoes == false ? infos.push('nonenone') : infos.push(json.commands[i].info);
        similaress == false ? similares.push('nonenone') : similares.push(json.commands[i].similar);
        cat == false ? category.push('nonenone') : category.push(json.commands[i].category);
      }
    }

		const seeAll = new MessageActionRow().addComponents(
			new MessageButton().setStyle('PRIMARY').setLabel('Ver todos os comandos').setCustomId('seeAllCommands')
		)
          
    let ddembed = new MessageEmbed()
      .setTitle(`Ajuda - Comando ${cmd[0]}`)
    	.setColor(`#A020F0`)
      .setThumbnail("https://media2.giphy.com/media/4ZnPYsAxJpau2r8v9e/200w.gif")

    if(desc[0] != 'nonenone'){
      ddembed.addField(`Descrição`, `\`\`\`${desc[0]}\`\`\``)
    }
    if(sintax[0] != 'nonenone'){
      ddembed.addField(`Sintaxe do comando:`, `\`\`\`${pp}${sintax[0]}\`\`\``)
    }
  	if(similares[0] != 'nonenone'){
      ddembed.addField(`Comandos similares`, `\`\`\`${similares[0]}\`\`\``)
    }
    if(category[0] != 'nonenone'){
      ddembed.addField(`Categoria`, `\`\`\`${category[0].replace('fun', 'Diversão').replace('eco', 'Economia').replace('adm', 'Administração').replace('geral', 'Gerais').replace('info', 'Utilidades')}\`\`\``)
    }

    let msgg = await interaction.editReply({embeds: [ddembed.toJSON()], components: [seeAll]});
    const filter = i => i.customId === 'seeAllCommands' && i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter });
		collector.on('collect', async i => {
			if (i.customId === 'seeAllCommands') {
				await i.update({ embeds: [embed.toJSON()], components: [helprow]});
			}
		});
  } else {
    await interaction.editReply({ embeds: [embed.toJSON()], components: [helprow]})
	}*/
}
