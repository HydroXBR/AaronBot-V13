// THIS COMMAND ONLY WORKS IN THE AARON OWNER PRIVATE SERVER

const { MessageEmbed } = require("discord.js"),
	db = require('quick.db'),
	ids = db.get('idsnormal'),
	idstech = db.get('idstech');

exports.int = async(client, interaction) => {
	await interaction.deferReply();
	let string = interaction.options["_hoistedOptions"][0].value;
	let string2 = interaction.options["_hoistedOptions"][1].value;
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.editReply({ content: msg, ephemeral: true });
	let embedderEphemeral = msg => interaction.editReply({ embeds: [msg.toJSON()], ephemeral: true });

	function maxChars(string){
    let arraying = new Array;
    let stringsplit = string.split("");
    if(stringsplit.length > 1000){
      for(var i = 0; i < 1000; i++){
        arraying.push(stringsplit[i])
      };

      return arraying.join("") + `...`;
    }else{
      return string;
    }
	};

	function spliceElement(array, element){
		const index = array.indexOf(element);
		if (index > -1) {
  		array.splice(index, 1);
		};
		return array;
	};

	const logchannel = client.channels.cache.get('902812808520036402');
	const channelid = string.match(/\d{18,}/gmi)[0];
	const type = string2 == 'normal' ? 'normal' : 'tech';

	if(type == 'normal'){
		if(!ids.includes(channelid)) return messagerEphemeral('Ops! Esse canal não foi encontrado no sistema!');
		db.set('idsnormal', spliceElement(ids, channelid));
		logchannel.send({ embeds: [new MessageEmbed().setTitle('Canal removido - normal').setDescription(`Canal: \`${channelid}\``).setColor('#FF0000').toJSON()] });
		return messagerEphemeral('Ok, o canal foi removido :wink:');
	}else if(type == 'tech'){
		if(!idstech.includes(channelid)) return messagerEphemeral('Ops! Esse canal não foi encontrado no sistema tech!');
		db.set('idstech', spliceElement(idstech, channelid));
		logchannel.send({ embeds: [new MessageEmbed().setTitle('Canal removido - Tech').setDescription(`Canal: \`${channelid}\``).setColor('#FF0000').toJSON()] });
		return messagerEphemeral('Ok, o canal tech foi removido :wink:');
	}
}
