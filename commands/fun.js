const {
	MessageActionRow, 
	MessageEmbed, 
	MessageSelectMenu, 
	MessageButton, 
	MessageAttachment
} = require("discord.js"),
	db = require("quick.db"),
	wait = require("util").promisify(setTimeout),
	jimp = require("jimp"),
	num_conv = require('number-to-words'),
	canvacord = require('canvacord'),
	Canvas = require('canvas');

exports.commands = {
	'commands':['dado', 'stonks', 'notstonks', 'number', 'bigtxt', 'font', 'laranjo', 'joken', 'pflip', 'ship', 'pb', 'invert', 'sepia']
};

exports.int = async(client, interaction) => {
	await interaction.deferReply();
	let author = interaction.user.id;
	let command = interaction.options["_subcommand"];
	let string = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : null;
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.editReply({ content: msg, ephemeral: true });
	function err(erro){
		console.log(erro);
		return messagerEphemeral('Ops! Algo deu errado, tente novamente mais tarde :confused:')
	};
	function displayAvatar(id, avatar){
		return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=1024`;
	};

	if(command == 'dado'){
		try{
			if (string){
    		if (Number(string) < 1) return messagerEphemeral('Ops! O número de dados que você enviou é inválido!')
    		var dices = new Array();
    		try{
      		dices.length = parseInt(string);
    		}catch (e) {
					console.log(e)
      		return messagerEphemeral('Ops! O número de dados que você enviou é inválido! Insira um número de 1 a 5.')
    		}

    		if (dices.length > 5) return messagerEphemeral('Ops! O número de dados que você enviou é inválido! Insira um número de 1 a 5.')

    		var dice_string = '';
    		for (let i = 0; i < dices.length; i++) {
      		dices[i] = Math.floor(Math.random() * 6) + 1;
        	dice_string += `Dado ${i + 1}: **${dices[i]}**\n`;
    		}

    		let dadosEmbed = new MessageEmbed()
					.addField('Resultado dos dados jogados', dice_string)
					.setColor("#00EEEE");
				embedder(dadosEmbed)
  		} else {
    		var dice = Math.floor(Math.random() * 6) + 1;
    		return messager(`Você jogou o dado e ele parou em **${dice}**!`);
  		}
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'stonks'){
		try{
			let img = jimp.read("https://i.snipboard.io/n8u6Md.jpg");
  		if(string.length > 90) return messagerEphemeral(`❌ | Você passou do limite de letras (90)`);
  		img.then(image => {
    		jimp.loadFont(jimp.FONT_SANS_64_BLACK).then(font => 
					image.print(font, 10, 4, string, 700, (err, image, { x, y }) => {
      			image.getBuffer(jimp.MIME_PNG, (err, i) => {
        			interaction.editReply({files: [{ attachment: i, name: "stonks.png"}]})
      			})
    			}
  			))
			})
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'notstonks'){
		try{
			let img = jimp.read("https://i.snipboard.io/CRxkyw.jpg");
  		if(string.length > 90) return messagerEphemeral(`❌ | Você passou do limite de letras (90)`);
  		img.then(image => {
    		jimp.loadFont(jimp.FONT_SANS_64_BLACK).then(font => 
					image.print(font, 10, 4, string, 700, (err, image, { x, y }) => {
      			image.getBuffer(jimp.MIME_PNG, (err, i) => {
        			interaction.editReply({files: [{ attachment: i, name: "notstonks.png"}]})
      			})
    			}
  			))
			})
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'number'){
		try{
			let commands = ["1","2","3","4","5","6","7","8","9","10"];

			let random = Math.floor(Math.random() * commands.length)
			let reply = str => `Pensei no número **${commands[random]}**, você **${str}** dessa vez!`;
			if (!Number(string) || isNaN(string) || Number(string) > 10 || Number(string) <= 0) return messagerEphemeral(`Pense em um número de **1** a **10**, e insira-o na frente do comando.`);

			if(string.toLowerCase() != commands[random] ){
				messager(reply("perdeu"))
			}else{
				messager(reply("ganhou"))
			};
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'bigtxt'){
		try{
			let output = string;
			let bigtext_arr = new Array();
    	for (let i = 0; i < output.length; i++) {
      	let isnumber = await parseInt(output[i]);
      	if (isnumber >= 0 && isnumber <= 9) {
        	bigtext_arr.push(`:${num_conv.toWords(output[i])}:`);
      	} else {
        	if (output[i] !== ' '){
          	if (!output[i].match(/^[a-zA-Z]+$/)) {
          	bigtext_arr.push(`:question:`);
          	} else {
          		bigtext_arr.push(`:regional_indicator_${output[i].toLowerCase()}:`);
          	};
        	} else {
          	bigtext_arr.push('   ');
        	};
      	};
			};
			return messager(bigtext_arr.join(''));
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'font'){
		try{
			let data = {userText: string, alphaLength: 2};
			let randomNumber = Math.floor(Math.random() * Math.floor(data.alphaLength));
			let latinAlpha = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z";
			let customAlpha = new String;
			if(randomNumber == 1){
				customAlpha = "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉";
			}else{
				customAlpha = "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟";
			};
			for(let i = 0; i < latinAlpha.length;){
				let regex = new RegExp(latinAlpha[i], "gm");
				data.userText = data.userText.replace(regex, customAlpha.substring(i, i + 2));
				i += 2;
			};

			messager(data.userText)
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'laranjo'){
		try{
			if(string.split("").length > 90) return messagerEphemeral(`Ops! O número máximo de caracteres é 90! Tente novamente, por favor. Obrigado!`);
			jimp.read(`https://media.discordapp.net/attachments/689750456695914586/691077705071984710/295364123043211.png?width=540&height=482`, function (err, image) {
    		if (err) return err(e);
    		jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(function (font) {
      		image.print(font, 23, 310, string, 320)
      		image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
        		interaction.editReply({ files: [{ attachment: buffer, name: "laranjo.png"}] });
      		})
    		})
  		})
		}catch(e){
			
			return err(e);
		}
	}else if(command == 'joken'){
		try{
			let commands = ["cara", "coroa"];
			let emojis = ["😜", "👑"];

			let random = Math.floor(Math.random() * Math.floor(commands.length));
			let reply = str => `Deu **${commands[random]} ${emojis[random]}**, você **${str}** dessa vez!`;

			if (string != commands[random]){
				return messager(reply("perdeu"));
			}else{
				return messager(reply("ganhou"));
			};
		}catch(e){
			
			return err(e);
		};
	}else if(command == 'pflip'){
		try{
			let commands = ["papel", "tesoura", "pedra"];
			let emojis = ["📜", "✂️", "🪨"];

			let random = Math.floor(Math.random() * Math.floor(commands.length));
			let reply = str => `Deu **${commands[random]} ${emojis[random]}**, você **${str}** dessa vez!`;

			if (string != commands[random]){
				return messager(reply("perdeu"));
			}else{
				return messager(reply("ganhou"));
			};
		}catch(e){
			
			return err(e);
		};
	}else if(command == 'sepia'){
		try{
			let user = interaction.options.getUser('user');
			let img = jimp.read(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`);
			img.then(image => {
    		image.sepia();
    		image.getBuffer(jimp.MIME_PNG, (err, i) => {
    			interaction.editReply({ files: [{ attachment: i, name: "sepia.png"}] })
    		})
    	});
		}catch(e){
			return err(e);
		};
	}else if(command == 'pb'){
		try{
			let user = interaction.options.getUser('user');
			let img = jimp.read(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`);
			img.then(image => {
    		image.greyscale()
    		image.getBuffer(jimp.MIME_PNG, (err, i) => {
    			interaction.editReply({ files: [{ attachment: i, name: "sepia.png"}] })
    		})
    	});
		}catch(e){
			return err(e);
		};
	}else if(command == 'chok'){
		return messagerEphemeral("Ops! Este comando não existe mais e em breve será removido... Mas você pode se divertir usando outros como \`/fun sepia\`, \`/fun pb\`, etc :)");
	}else if(command == 'invert'){
		try{
			let user = interaction.options.getUser('user');
			let img = jimp.read(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`);
			img.then(image => {
    		image.invert()
    		image.getBuffer(jimp.MIME_PNG, (err, i) => {
    			interaction.editReply({ files: [{ attachment: i, name: "invert.png"}] })
    		})
    	});
		}catch(e){
			return err(e);
		};
	}else if(command == 'ship'){
		try{
			let user1n = interaction.options.getUser('user1');
			let user2n = interaction.options.getUser('user2');
  		let user1 = user1n.username
  		let user2 = user2n.username

			const canvas = Canvas.createCanvas(850, 250);
			const context = canvas.getContext('2d');
			
  
  		const amor = Math.floor(Math.random() * 100);
  		const loveIndex = Math.floor(amor / 10);
  		const loveLevel = "█".repeat(loveIndex) + ".".repeat(10 - loveIndex);

  		let nomeFim1 = user1.length;
  		let nomeFim2 = user2.length;

  		let calc1 = nomeFim1 - 3
  		let calc2 = nomeFim2 - 3
  
  		let nomeship;
    	if(amor > 60) {
      	nomeship = user1.slice(0, 3) + user2.slice(0, 3);
    	} else if(amor >= 40) {
      	nomeship = user1.slice(0, calc1) + user2.slice(0, calc2)
    	} else {
      	nomeship = user1.slice(calc1, nomeFim1) + user2.slice(calc2, nomeFim2)
    	} 
  
  		let emoticon;
    	if(amor > 60) {
      	emoticon = ("https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_2.png?v=1593651528429"); //imagem de coração
    	} else if(amor >= 40) {
      	emoticon = ("https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_3-1.png?v=1593652255529"); //imagem de sei lá
    	} else {
      	emoticon = ("https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_1.png?v=1593651511900"); //imagem chorando
   		}

  		let desc;
    	if(amor > 90) {
      	desc = (":sparkling_heart: HMMM, vai rolar ou não vai? :sparkling_heart:\n``"+user1+"``\n``"+user2+"``\n:heart: ``"+nomeship+"`` Esse é o casal perfeito! :heart:");
    	} else if(amor >= 70) {
     		desc = (":sparkling_heart: HMMM, vai rolar ou não vai? :sparkling_heart:\n``"+user1+"``\n``"+user2+"``\n:neutral_face: ``"+nomeship+"`` Esses aqui se conhecem bem, já... HMM... :neutral_face:");
    	} else if(amor >= 45) {
      	desc = (":sparkling_heart: HMMM, vai rolar ou não vai? :sparkling_heart:\n``"+user1+"``\n``"+user2+"``\n:no_mouth: ``"+nomeship+"`` Talvez só precisa o "+user2+" querer... :no_mouth:");
    	} else {
      	desc = (":sparkling_heart: HMMM, vai rolar ou não vai? :sparkling_heart:\n``"+user1+"``\n``"+user2+"``\n:cry: ``"+nomeship+"``queria muito dizer que é possivel mas... :cry: ");
    	}
    
  		
			const background = await Canvas.loadImage('https://i.ibb.co/k12njGS/blankpngimage.png');
			context.drawImage(background, 0, 0, canvas.width, canvas.height);
			const avatar1 = await Canvas.loadImage(displayAvatar(user1n.id, user1n.avatar));
			context.drawImage(avatar1, 25, 0, 250, canvas.height)
			const avatar2 = await Canvas.loadImage(displayAvatar(user2n.id, user2n.avatar));
			context.drawImage(avatar2, 600, 0, 250, canvas.height);
			const emoteCanvas = await Canvas.loadImage(emoticon);
			context.drawImage(emoteCanvas, 310, 0, 250, canvas.height);

			const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
      
  
			let amorEmbed = new MessageEmbed()
  			.setColor('#ff3399')
    		.setDescription("**"+amor+"%** [`"+loveLevel+"`]").setImage('attachment://profile-image.png')


  		interaction.editReply({ content: desc, embeds: [amorEmbed.toJSON()], files: [attachment]})
		}catch(e){
			return err(e);
		}
	}
};
