// THIS COMMAND ONLY WORKS IN THE PRIVATE SERVER OF AARON OWNER
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require("discord.js");
const wait = require("util").promisify(setTimeout);
const jimp = require("jimp");

exports.int = async(client, interaction) => {
	let string = interaction.options["_hoistedOptions"][0].value;
	let embedder = embed => interaction.reply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.reply({ content: msg });
	let messagerEphemeral = msg => interaction.reply({ content: msg, ephemeral: true });
	let embedderEphemeral = msg => interaction.reply({ embeds: [msg.toJSON()], ephemeral: true });

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

	function evalString(str){
		try{
			return eval(str);
		}catch(e){
			return `Erro:\n${maxChars(e.toString())}`
		}
	}

	let evalEmbed = new MessageEmbed()
		.setTitle('Eval')
		.setColor('#00EEEE')
		.addField(`Entrada:`, `\`\`\`js\n${string}\`\`\``)
		.addField(`Saída:`, `\`\`\`js\n${evalString(string)}\`\`\``);

	return embedderEphemeral(evalEmbed);
}
