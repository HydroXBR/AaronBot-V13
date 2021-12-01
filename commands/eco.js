const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require("discord.js");
const db = require("quick.db");
const wait = require("util").promisify(setTimeout);
const jimp = require("jimp");

exports.commands = {
	'commands':['daily', 'pay', 'saldo', 'work', 'especialidade', 'carros', 'level', 'papel', 'ranking', 'objetos']
}

exports.int = async(client, interaction) => {
	// Interaction content 
	let author = interaction.user.id;
	let command = interaction.options["_subcommand"];
	let string = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : null;

	// Database variable functions
	let dbPapel = id => `papel_${id}`;
	let dbPapeis = id => `papeis_${id}`;
	let dbMoney = id => `money_${id}`;
	let dbXp = id => `xp_${id}`;
	let dbLv = id => `lv_${id}`;
	let dbWork = id => `work_${id}`;

	// Util personal functions
	const toBRL = value => Number(value).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.reply({ content: msg, ephemeral: true });
	let err = e => messagerEphemeral("Ops, me desculpe! Não consegui executar o comando. Por favor, tente novamente mais tarde.");
	function chartUp(text){
		const a = new Array;
		const textSplit = text.split('');
		a.push(textSplit[0].toUpperCase());

		for(var i = (/['"]/gmi.test(textSplit[0]) ? 2 : 1); i < textSplit.length; i++){
			a.push(textSplit[i]);
		};

		return a.join("");
	};
	function maxChars(string){
    const arraying = new Array;
		let tag = string.match(/#\d\d\d\d/gmi)[0];
    let stringsplit = string.replace(tag, '').split("");
    if(stringsplit.length > 13){
      for(var i = 0; i < 13; i++){
        arraying.push(stringsplit[i])
      };
      return arraying.join("") + `...` + tag;
    }else{
      return string;
    }
  };

	// Setting subcommands functions	
	if(command == "daily"){
		try{
			await interaction.deferReply();
			const databaseDate = db.get(`datetime_${author}`);
			const datetime = new Date().toISOString().split("T")[0].split("-").reverse().join("/");
	
  		const svoficial = client.guilds.cache.get("831379807673253888");
			if(databaseDate == datetime) return messagerEphemeral("❌ | Ops! Parece que você já pegou seu saldo diário! Por favor, volte amanhã para pegar novamente :wink:");

			const moneyAmmount = db.get(`money_${author}`) || 0;
			const minimumAmmount = 1e3;
			const maximumAmmount = 5e3;
			const dailyValue = Math.floor(Math.random() * (maximumAmmount - minimumAmmount)) + minimumAmmount;
  		let dailyammount = Number(moneyAmmount) + dailyValue;
  		let newmoney = svoficial.members.cache.get(author) ? (dailyammount + (dailyValue / 10)) : dailyammount;
  		let atualdaily = svoficial.members.cache.find(e => e.id == author) ? (dailyValue + (dailyValue/10)) : dailyValue;

			db.set(`money_${author}`, newmoney);
			db.set(`datetime_${author}`, datetime);
  		let embed = new MessageEmbed()
    		.setTitle("Daily")
    		.setColor("#00EEEE")
    		.setDescription(`Parabéns, você pegou o seu saldo diário e conseguiu ${toBRL(atualdaily)}!\n\nSaldo atual: \`${toBRL(db.get(`money_${author}`))}\`\n\n${svoficial.members.cache.get(author) ? `**Aee, você ganhou 10% a mais que iria ganhar** porque está no meu [servidor oficial](https://discord.gg/chnhwPBVxX) :partying_face:` : `**Sabia que você pode ganhar 10% a mais todos os dias se entrar no meu servidor? [Clique aqui para entrar](https://discord.gg/chnhwPBVxX)**`}`);

			return embedder(embed);
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == "pay"){
		try{
			await interaction.deferReply();
  		let member = interaction.options.getUser("user")
			let user = member.id;
  		let dinheiro = db.get(`money_${user}`);
  		let money = dinheiro == null ? 0 : dinheiro;
  		let moneyma = db.get(`money_${author}`);
  		let messagemoney = moneyma == null ? 0 : moneyma;
  
  		if (user == author) return messagerEphemeral(`❌ | Ops! Você não pode transferir dinheiro para você mesmo(a)! Tente novamente mencionando um user diferente :wink:`);
  		if (/-/gmi.test(string) || (Number(string) < 0)) return messagerEphemeral(`❌ | Ops! Pace que você inseriu um número inválido ou negativo. Por favor, verifique, obrigado :wink:`);

  		let d = Number(string);
  		let mensagem = new MessageEmbed().setTitle(`Transferência realizada com sucesso`).setColor(`#32CD32`).setDescription(`**Rementente:** <@${author}>\n**Destinatário:** <@${user}>\n**Quantia:** ${toBRL(d)}\n\nParabéns, não esqueça de transferir e usar esse dinheiro do sistema de acordo com as [minhas diretrizes](https://sites.google.com/view/aaronbotsite/termos-de-uso) :wink:`).setThumbnail(`https://cdn.pixabay.com/photo/2018/08/25/21/08/money-3630935_1280.png`);
  		let confirm = new MessageEmbed()
				.setTitle(`Confirmação`)
				.setColor(`#FFFF00`)
				.setDescription(`**Rementente:** <@${author}>\n**Destinatário:** <@${user}>\n**Quantia:** ${toBRL(d)}\n\nPor favor, <@${author}>, reaja à essa mensagem clicando no botão ✔️ para confirmar a transação.`)
				.setThumbnail(`http://gifmania.com.br/wp-content/uploads/2020/07/gif-interrogacao.gif`);
			const police = new MessageActionRow()
				.addComponents(
    			new MessageButton()
        		.setStyle("LINK")
        		.setURL(`https://sites.google.com/view/aaronbotsite/contato`) 
        		.setLabel("⚠️ Denuncie uso indevido e burlamentos")
				);
			const action = new MessageActionRow()
				.addComponents(
    			new MessageButton()
        		.setStyle("PRIMARY")
        		.setCustomId(`confirmTransaction`) 
        		.setLabel("✔️")
				);

			interaction.editReply({embeds: [confirm.toJSON()], components: [action]})  		
			const filter = i => i.customId == "confirmTransaction" && i.user.id === author;
			const collector = interaction.channel.createMessageComponentCollector({ filter });
			collector.on("collect", async i => {
				if (i.customId === "confirmTransaction") {
					db.set(`money_${user}`, (money + d))
        	db.set(`money_${author}`, (messagemoney - d))
			  	i.update({ embeds: [mensagem.toJSON()], components: [police] })
				}
			});
  }catch(error){
		console.log(error)
    return messagerEphemeral(`❌ | Ops! Desculpe, mas não foi possível completar a transação. Verifique se a marcação e a quantidade estão corretas, bem como se usuário está no servidor, mesmo. Lembrando, a sintaxe correta é: \`/eco pay @USER QUANTIDADE (EM NÚMERO INTEIRO)\``);
  }
	}else if(command == "saldo"){
		try{
			await interaction.deferReply();
			const user = interaction.options["_hoistedOptions"][0] ? interaction.options["_hoistedOptions"][0].value : interaction.user.id;
			const tag = client.users.cache.get(user).username + `#` + client.users.cache.get(user).discriminator;
			const id = client.users.cache.get(user).id;
  		const money = db.get(`money_${user}`) || 0;
  		let embed = new MessageEmbed()
    		.setTitle(`Saldo - ${tag}`)
    		.setThumbnail("https://img.freepik.com/vetores-gratis/carteira-e-desenho-animado-do-dinheiro_138676-2086.jpg?size=338&ext=jpg")
    		.setColor("#00EEEE")
    		.setDescription(`O saldo desta conta, atualmente, é de:\n\n\`\`\`${toBRL(money)}\`\`\``);

  		interaction.editReply({embeds: [embed.toJSON()]})
		}catch(e){
			console.log(e)
			return err();
		}
	}else if(command == "work"){
		try{
			await interaction.deferReply();
			let work = db.get(`work_${interaction.guildId}_${author}`) || `Nenhuma`;
  		let m = db.get(`money_${author}`);
  		let money = m == null ? 0 : m;
  		const databaseDate = db.get(`dtw_${author}`);
			const datetime = new Date().toISOString().split("T")[0].split("-").reverse().join("/");

  		if (databaseDate == datetime) return messagerEphemeral("**❌ | Ops! Parece que você já trabalhou hoje! Por favor, volte amanhã para trabalhar novamente!** :wink:");

  		let salario;
  		switch(work){
    		case null:
    		salario = 0
    		break;
    		case "Nenhuma":
    		salario = 0
    		break;
    		case "Palhaço(a)":
    		salario = 150
    		break;
    		case "Fotógrafo(a)":
    		salario = 300
    		break;
    		case "Minerador(a)":
    		salario = 450
    		break;
    		case "Marceneiro(a)":
    		salario = 600
    		break;
    		case "Médico(a)":
    		salario = 750
    		break;
    		case "Bombeiro(a)":
    		salario = 900
    		break;
    		case "Juiz(a)":
    		salario = 1050
    		break;
    		case "Policial":
    		salario = 1200
    		break;
    		case "Youtuber":
    		salario = 1350
    		break;
    		case "Artista":
    		salario = 1500
    		break;
  		};

  		let embed = new MessageEmbed()
    		.setTitle("Trabalhar")
    		.setDescription(`${work == `Nenhuma` ? `Ops! Você não tem nenhuma profissão! Para escolher uma, use o comando \`/eco profissao\`` : `Parabéns por ser um(a) ótimo(a) ${work}!\n\nVocê ganhou hoje:\`\`\`${toBRL(salario)}\`\`\``}`)
    		.setColor("#00EEEE")
    		.setThumbnail("https://images.emojiterra.com/google/android-pie/512px/1f4bc.png")
    		.setFooter("Para escolher ou alterar sua profissão, use /eco profissao")
    		.setTimestamp();

  		if(salario == 0){
    		interaction.editReply({ embeds: [embed.toJSON()], ephemeral: true });
  		}else{
				db.set(`money_${author}`, (money + salario));
    		db.set(`dtw_${author}`, datetime);
				interaction.editReply({ embeds: [embed.toJSON()] });
  		};
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == "profissao"){
		try{
			await interaction.deferReply();
			let work = db.get(`work_${interaction.guildId}_${author}`) || `Nenhuma`;
  		let m = db.get(`money_${author}`);
  		let money = m == null ? 0 : m;
			let lv = db.get(`lv_${author}`) || 0;
			let prof = {
				"work":[
					{
						"name": "Palhaço(a)",
						"level": 0,
						"emoji": "🤡"
					},
					{
						"name": "Fotógrafo(a)",
						"level": 2,
						"emoji": "🤡"
					},
					{
						"name": "Minerador(a)",
						"level": 3,
						"emoji": "⚒️"
					},
					{
						"name": "Marceneiro(a)",
						"level": 4,
						"emoji": "🔨"
					},
					{
						"name": "Médico(a)",
						"level": 5,
						"emoji": "🚑"
					},
					{
						"name": "Bombeiro(a)",
						"level": 6,
						"emoji": "⛑️"
					},
					{
						"name": "Juiz(a)",
						"level": 7,
						"emoji": "👨‍⚖️"
					},
					{
						"name": "Policial",
						"level": 8,
						"emoji": "🚓"
					},
					{
						"name": "Youtuber",
						"level": 9,
						"emoji": "▶️"
					},
					{
						"name": "Artista",
						"level": 10,
						"emoji": "🏞️"
					}
				]
			}

			for(var i = 0; i < prof.work.length; i++){
				let name = prof.work[i].name;
				let requiredLevel = prof.work[i].level;
				let emoji = prof.work[i].emoji;
				let regex = new RegExp(string, 'gmi');
				if(regex.test(name)){
					if (lv >= requiredLevel) {
		    		db.set(`work_${interaction.guildId}_${author}`, prof.work[i].name);
        		let pembed = new MessageEmbed()
          		.setTitle("Profissão escolhida com sucesso!")
          		.setDescription(`Agora, sua **profissão** é:\n\n ${emoji} - ${name}`)
          		.setColor("#00EEEE")
          		.setThumbnail("https://images.emojiterra.com/google/android-pie/512px/1f4bc.png")
          		.setFooter("Parabéns por trabalhar, mesmo sendo preguiçoso KKK");
        		return embedder(pembed);
      		} else {
        		return messagerEphemeral(`Ops! Desculpe, mas você precisa chegar até o nível ${requiredLevel.toString()} para ter essa profissão. Atualmente, seu nível é \`${lv}\`. Continue usando meus comandos e consulte o nível usando \`/eco level\` :wink:`);
      		};
				};
			};
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'especialidade'){
		try{
			await interaction.deferReply();
			let especialidade = db.get(`especialidade_${interaction.guildId}_${author}`) || `Nenhuma`;
			let esp = {
				"especialidades":[
					{
						"name": "Pregação",
						"emoji": "🎙️"
					},
					{
						"name": "Música",
						"emoji": "🎸"
					},
					{
						"name": "Games",
						"emoji": "🎮"
					},
					{
						"name": "Anime",
						"emoji": "🇯🇵"
					},
					{
						"name": "Desenho",
						"emoji": "✏️"
					},
					{
						"name": "Pintura",
						"emoji": "🖌"
					},
					{
						"name": "Arte",
						"emoji": "🏞️"
					},
					{
						"name": "Dança",
						"emoji": "💃"
					},
					{
						"name": "Canto",
						"emoji": "🎤"
					},
					{
						"name": "YouTuber",
						"emoji": "▶️"
					},
					{
						"name": "Programação",
						"emoji": "🤖"
					},
					{
						"name": "Números",
						"emoji": "🔢"
					},
					{
						"name": "Escrita",
						"emoji": "📝"
					},
					{
						"name": "Esportes",
						"emoji": "⚽"
					},
					{
						"name": "Idiomas",
						"emoji": "🇺🇸"
					}
				]
			};

			for(var i = 0; i < esp.especialidades.length; i++){
				let name = esp.especialidades[i].name;
				let emoji = esp.especialidades[i].emoji;
				let regex = new RegExp(string, 'gmi');
				if(regex.test(name)){
					db.set(`especialidade_${interaction.guildId}_${author}`, name);
     			let especialidadeEmbed = new MessageEmbed()
        		.setTitle("Especialidade escolhida com sucesso!")
        		.setDescription(`Agora, sua **especialidade** é:\n\n ${emoji} - ${name}`)
        		.setColor("#00EEEE")
        		.setThumbnail("http://25.media.tumblr.com/8fb327b41fae5c04297cb315654643b5/tumblr_n02s03cEvm1sfhbr8o1_500.gif")
        		.setFooter("Ela aparecerá no comando /eco perfil");
					return embedder(especialidadeEmbed);
				};
			};
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == "carros"){
		try{
			await interaction.deferReply();
			let money = db.get(`money_${author}`) || 0;
			let carro = db.get(`carros_${author}`);
			let getEmoji = emoji => client.emojis.cache.get(emoji).toString();
			let carros = {
				"car":[
					{
						"name":"Kombi WolksWagen Branca",
						"price":4500,
						"emoji":getEmoji("843972602179616770"),
						"image":"https://www.instacarro.com/uploads/veiculos/fotos-modelos/volkswagen-kombi.png"
					},
					{
						"name":"Fusca WolksWagen Azul",
						"price":5000,
						"emoji":getEmoji("843971646359994399"),
						"image":"https://www.instacarro.com/uploads/veiculos/fotos-modelos/volkswagen-fusca.png"
					},
					{
						"name":"Carro Fiat Siena Vermelho",
						"price":10000,
						"emoji":getEmoji("843971016040120370"),
						"image":"https://seminovoscarros.com.br/wp-content/uploads/2016/09/Fiat-Siena.png"
					},
					{
						"name":"Carro Chevrolet Sedan Vermelho",
						"price":15000,
						"emoji":getEmoji("843969401291145257"),
						"image":"https://www.chevrolet.com.br/content/dam/chevrolet/mercosur/brazil/portuguese/index/cars/2021-onix-plus/colorizer/colorizer-onix%20plus-premier-vernelho.jpg?imwidth=960"
					},
					{
						"name":"Picape Hilux 4x4 Branca",
						"price":20000,
						"emoji":getEmoji("843970480317792276"),
						"image":"https://s2.glbimg.com/BpZgUZsrr3cFkbchDuWwI_TKgj8=/0x0:620x400/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2020/l/C/TUIUtSSSAAm2tAU1OGMw/2015-08-21-toyota-hilux-limited-edition-1-960-640.jpg"
					},
					{
						"name":"Carro Ranger Rover Preto",
						"price":35000,
						"emoji":getEmoji("843975759735554078"),
						"image":"https://cdn6.campograndenews.com.br/uploads/noticias/2020/03/10/1194870d0a53t.jpg"
					},
					{
						"name":"Carro Ferrari Vermelho",
						"price":100000,
						"emoji":getEmoji("843976271709077564"),
						"image":"https://www.autoinforme.com.br/wp-content/uploads/2016/06/ferrari-458.jpg"
					},
					{
						"name":"Carro Lamborghini Aventador Branco",
						"price":101000,
						"emoji":getEmoji("843976651040882698"),
						"image":"http://1.bp.blogspot.com/-4gLImh0dFag/TkyEyeQrL0I/AAAAAAAAGpE/MvxqbWQT1OQ/s640/Comercial-Lamborghini-Aventador-branco.jpg"
					}
				]
			};

			for(var i = 0; i < carros.car.length; i++){
				let name = carros.car[i].name;
				let price = carros.car[i].price;
				let emoji = carros.car[i].emoji;
				let image = carros.car[i].image;
				let stringUp = chartUp(string)
				let regex = new RegExp(stringUp);
				console.log(regex)
				if(regex.test(name)){
					if(price > money) return messagerEphemeral(`Ops! Seu saldo não é suficiente para comprar este automóvel!`);

					let newsaldo = (money - price);
          let nc = `${emoji} - ${name}`;
          db.push(`carros_${author}`, nc);
          db.set(`money_${author}`, newsaldo)
          let embed = new MessageEmbed()
					.setTitle(`${name} comprado com sucesso!`)
					.setColor("#00EEEE")
					.setThumbnail(image)
					.setDescription(`Parabéns! Você, ao que parece, trabalhou bem e conseguiu uma grana pra comprar um automóvel!\n\nSeu novo saldo: \`${toBRL(newsaldo)}\`.`);
			    return embedder(embed);
				};
			};
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'level'){
		try{
			await interaction.deferReply();
			let authorLevel = interaction.options.getMember("user").id;
			let lv = db.get(dbLv(authorLevel));
			let xp = db.get(dbXp(authorLevel));

			let levelEmbed = new MessageEmbed()
    		.setTitle(`Level`)
    		.setColor("#00EEEE")
    		.setThumbnail("https://i.ibb.co/ZNhD90g/XP.png")
    		.setDescription(`**Level:** \n\`\`\`${lv}\`\`\`\n**XP:**\n\`\`\`${xp}\`\`\`\n\n\nCada comando utilizado equivale a 1xp, e a quantidade de XP determina seu level.`)
				.addField(`Level`, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10`, true)
    		.addField(`XP`, `50\n100\n300\n500\n700\n900\n1000\n1150\n1500\n2000`, true)
    		.setFooter(`Para saber o seu level ou o de alguém, use o comando /eco level`);

			return embedder(levelEmbed)
		}catch(e){
			console.log(e)
			return err()
		}
	}else if(command == 'papel'){
		try{
			await interaction.deferReply();
			let papel = db.get(dbPapel(author));
			let papeis = db.get(dbPapeis(author));
			let money = db.get(`money_${author}`);
			let papeisJSON = {
				"papel":[
					{
						"name":"Clássico",
						"position":"1",
						"code":null,
						"link":"https://i.ibb.co/CMYGCqn/1a.png",
						"price":0
					},
					{
						"name":"Céu",
						"position":"2",
						"code":"2a",
						"link":"https://i.ibb.co/vV7Gfrx/2a.png",
						"price":250
					},
					{
						"name":"Universo",
						"position":"3",
						"code":"3a",
						"link":"https://i.ibb.co/N72Kp83/3a.png",
						"price":400
					},
					{
						"name":"Madeira",
						"position":"4",
						"code":"4a",
						"link":"https://i.ibb.co/Stg23tz/4a.png",
						"price":600
					},
					{
						"name":"Esverdeado",
						"position":"5",
						"code":"5a",
						"link":null,
						"price":700
					}
				]
			};
			let papelEmbed = new MessageEmbed()
    		.setTitle("Papéis de parede do perfil")
    		.setColor("#DB7093")
    		.setDescription(`Sabia que você pode alterar o papel de parede do comando \`/eco perfil\`? Veja os papéis de parede disponíveis, clique no nome deles para ver o layout :)`)
    		.addField(`:one: :necktie: Clássico | Já adquirido :unlock: - R$ 0,00`, `[Clique aqui para ver](https://i.ibb.co/CMYGCqn/1a.png)`)
    		.addField(`:two: :sunrise: Céu ${/2a/gmi.test(papeis) ? `| Já adquirido :unlock:` : `:lock:`} - R$ 250`, `[Clique aqui para ver](https://i.ibb.co/vV7Gfrx/2a.png)`)
    		.addField(`:three: :milky_way: Universo ${/3a/gmi.test(papeis) ? `| Já adquirido :unlock:` : `:lock:`} - R$ 400`, `[Clique aqui para ver](https://i.ibb.co/N72Kp83/3a.png)`)
    		.addField(`:four: :wood: Madeira ${/4a/gmi.test(papeis) ? `| Já adquirido :unlock:` : `:lock:`} - R$ 600`, `[Clique aqui para ver](https://i.ibb.co/Stg23tz/4a.png)`)
    		.addField(`:five: :green_heart: Esverdeado ${/5a/gmi.test(papeis) ? `| Já adquirido :unlock:` : `:lock:`} - R$ 700`, `Papel simples com tema esverdeado`);
			if(!string) return embedder(papelEmbed);
			let b;
  		switch(string){
				case "classico":
    		b = "1"
    		break;
    		case "ceu":
    		b = "2"
    		break;
   			case "universo":
   			b = "3"
    		break;
    		case "madeira":
    		b = "4"
    		break;
    		case "esverdeado":
    		b = "5"
    		break;
  		}
			for(var i = 0; i < papeisJSON.papel.length; i++){
				console.log(b)
				let papelRegex = new RegExp(b);
				if (!papelRegex.test(dbPapeis(author))){
      		if (money >= papeisJSON.papel[i].price) return messagerEphemeral(`:confused: | Ops! Você não tem dinheiro suficiente na conta Aaron para comprar esse papel de parede! Você precisa de \`${toBRL(papeisJSON.papeis[i].price - money)}\` a mais...`);
        	if(!papeis) {
      	    db.set(dbPapeis(author), papeisJSON.papeis[i].code);
      	  	db.set(dbPapel(author), papeisJSON.papeis[i].code);
      	    db.set(dbMoney(author), (money - papeisJSON.papeis[i].price));
      	    return messager(`Parabéns! :smile: - Você comprou o papel de parede ${papeisJSON.papel[i].position} - ${papeisJSON.papel[i].name} com sucesso por \`${toBRL(papeisJSON.papel[i].price)}\` da conta Aaron.`);
        	}else{
          	db.set(dbPapeis(author), papeis + papeisJSON.papeis[i].code);
      	  	db.set(dbPapel(author), papeisJSON.papeis[i].code);
      	    db.set(dbMoney(author), (money - papeisJSON.papeis[i].price));
          	return messager(`Parabéns! :smile: - Você comprou o papel de parede ${papeisJSON.papel[i].position} - ${papeisJSON.papel[i].name} com sucesso por \`${toBRL(papeisJSON.papel[i].price)}\` da conta Aaron.`);
        	}
      	}else{
          db.set(dbPapel(author), papeisJSON.papeis[i].code);
          return messager(`Parabéns! :smile: - Você setou o papel de parede ${papeisJSON.papel[i].position} - ${papeisJSON.papel[i].name} com sucesso!`);
				}
			}
		}catch(e){
			console.log(e)
			return err()
		}
	}else if(command == 'perfil'){
		try{
			await interaction.deferReply();
			let u = !string ? author : string;
			let user = interaction.guild.members.cache.get(u).user;
			let papel;
  		switch(db.get(dbPapel(user))){
  			case null:
    		papel = "https://i.ibb.co/CMYGCqn/1a.png"
    		break;
    		case "1a":
    		papel = "https://i.ibb.co/CMYGCqn/1a.png"
    		break;
    		case "2a":
    		papel = "https://i.ibb.co/vV7Gfrx/2a.png"
    		break;
    		case "3a":
    		papel = "https://i.ibb.co/N72Kp83/3a.png"
    		break;
    		case "4a":
    		papel = "https://i.ibb.co/Stg23tz/4a.png"
    		break;
    		case "5a":
    		papel = "https://i.ibb.co/bWzS4R5/5a.png"
    		break;
  		}

			let a;
  		switch(db.get(dbPapel(user))){
    		case null:
    		a = "Padrão"
    		break
    		case "2a":
    		a = "Céu"
    		break
   			case "3a":
   			a = "Universo"
    		break
    		case "4a":
    		a = "Amadeirado"
    		break
    		case "5a":
    		a = "Paisagem"
    		break
  		}

			let img = jimp.read(papel)
  		let money = db.get(dbMoney(user.id)) || 0;
  		let work = db.get(dbWork(user.id)) || "Nenhuma";
  		let especialidade = db.get(`especialidade_${interaction.guildId}_${user.id}`) || "Nenhuma";
  		let gema = db.get(`gemas_${user.id}`) || 0;
			let carro = db.get(`carros_${user.id}`) == null ? "" : db.get(`carros_${user.id}`).join('\n');
  		let objeto = db.get(`objetos_${user.id}`) == null ? "" : db.get(`objetos_${user.id}`).join('\n');
			let userTag = user.username + "#" + user.discriminator;

  		let addZero = num => num < 10 ? "0" + num : num;
  		let d = new Date(user.createdAt);
  		let datetime = addZero(d.getDate()) + "/" + addZero((d.getMonth()+1))  + "/" + d.getFullYear()
  		let emoji = e => client.emojis.cache.get(e);


  		let profileEmbed = new MessageEmbed()
    		.setTitle(`Perfil de ${userTag}`)
    		.setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`)
    		.setColor('#00EEEE')
				.setImage('attachment://profile-image.png')
    		.setDescription(`${emoji("844048667299020850")} **Dinheiro:** ${toBRL(money)}\n${emoji("843922568386052117")} **Gemas:** ${gema} gemas\n${emoji("844049802165878794")} **Profissão:** ${work}\n:bulb: **Especialidade:** ${especialidade}\n:park: **Papel de parede:** ${a} (para alterar, use \`/eco papel\`)\n\n**Itens:**\n${carro}\n${objeto}\n------------`).setFooter(`Para deixar seu perfil mais bonito e moderno, compre coisas e pegue seu saldo diário usando /eco daily, altere também a especialidade e profissão no servidor usando /eco especialidade e /eco profissao, respectivamente :)`);
 
  		img.then(image => {
    		jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font => {
    			image.print(font, 30, 57, userTag, 400)
    			image.print(font, 153, 190, `${toBRL(money)}`, 400)
    			image.print(font, 35, 342, datetime, 4000)
    			image.print(font, 310, 342, work, 4000)
    			image.print(font, 35, 485, especialidade, 4000)
    			image.print(font, 444, 485, gema, 4000)
    			image.getBuffer(jimp.MIME_PNG, (err, i) => {
    				interaction.editReply({files: [{ attachment: i, name: "profile-image.png"}], embeds: [profileEmbed.toJSON()]})
    			})
    		})
  		})
		}catch(e){
			console.log(e);
			return err();
		}
	}else if(command == 'ranking'){
		try{
			await interaction.deferReply();
			const img = jimp.read("https://i.ibb.co/5MrDBsw/r5.png");
  
  		if (string == 'local'){
    		const array = [];
				const usersArray = new Array;
				usersArray.push(interaction.guild.members.cache.map(e => e.id));

    		for(var e = 0; e < usersArray[0].length; e++){
					const user = interaction.guild.members.cache.get(usersArray[0][e]).user;
					console.log(user)
      		const u = {
        		user: {
        		id: user.username + "#" + user.discriminator,
        		saldo: (db.get(`money_${usersArray[0][e]}`)||0)
	      		}
      		};

      		for (var key in u) {
	      		array.push(u[key]);
      		}

      		array.sort(function(a, b){
        		return b.saldo - a.saldo;
      		});

      		for (var i = 0; i < array.length; i++) {
	      		array[i].rank = i + 1;
      		}
    		}
 				img.then(image => {
      		jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font => {
      		try{image.print(font, 140, 89, maxChars(array[0].id), 400)}catch(e){image.print(font, 140, 89, `-`, 400)};
      		try{image.print(font, 165, 150, toBRL(array[0].saldo), 400)}catch(e){image.print(font, 165, 150, `-`, 400)};
      		try{image.print(font, 140, 210, maxChars(array[1].id), 400)}catch(e){image.print(font, 140, 210, `-`, 400)};
      		try{image.print(font, 165, 270, toBRL(array[1].saldo), 400)}catch(e){image.print(font, 165, 270, `-`, 400)};
     		 	try{image.print(font, 140, 325, maxChars(array[2].id), 400)}catch(e){image.print(font, 140, 325, `-`, 400)};
      		try{image.print(font, 165, 382, toBRL(array[2].saldo), 400)}catch(e){image.print(font, 165, 382, `-`, 400)};
      		try{image.print(font, 140, 440, maxChars(array[3].id), 400)}catch(e){image.print(font, 140, 440, `-`, 400)};
      		try{image.print(font, 165, 502, toBRL(array[3].saldo), 400)}catch(e){image.print(font, 165, 502, `-`, 400)};
      		try{image.print(font, 140, 560, maxChars(array[4].id), 400)}catch(e){image.print(font, 140, 560, `-`, 400)};
      		try{image.print(font, 165, 615, toBRL(array[4].saldo), 400)}catch(e){image.print(font, 165, 615, `-`, 400)};
      		image.getBuffer(jimp.MIME_PNG, (err, i) => {
      			return interaction.editReply({ content:'Ranking local de saldo', files: [{ attachment: i, name: "ranklocal.png"}] });
      		});
    		});
				});
  		}else{
    		const array = new Array;
				const usersArray = new Array;
				usersArray.push(client.users.cache.map(e => e.id));

    		for(var e = 0; e < usersArray[0].length; e++){
					const user = client.users.cache.get(usersArray[0][e]);
      		const u = {
        		user: {
        		id: user.username + "#" + user.discriminator,
        		saldo: (db.get(`money_${usersArray[0][e]}`)||0)
	      		}
      		};

      		for (var key in u) {
	      		array.push(u[key]);
      		};

      		array.sort(function(a, b){
        		return b.saldo - a.saldo;
      		});

      		for (var i = 0; i < array.length; i++) {
	      		array[i].rank = i + 1;
      		};
    		};

  			img.then(image => {
      		jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font => {
      		try{image.print(font, 140, 89, maxChars(array[0].id), 400)}catch(e){image.print(font, 140, 89, `-`, 400)};
      		try{image.print(font, 165, 150, toBRL(array[0].saldo), 400)}catch(e){image.print(font, 165, 150, `-`, 400)};
      		try{image.print(font, 140, 210, maxChars(array[1].id), 400)}catch(e){image.print(font, 140, 210, `-`, 400)};
      		try{image.print(font, 165, 270, toBRL(array[1].saldo), 400)}catch(e){image.print(font, 165, 270, `-`, 400)};
      		try{image.print(font, 140, 325, maxChars(array[2].id), 400)}catch(e){image.print(font, 140, 325, `-`, 400)};
      		try{image.print(font, 165, 382, toBRL(array[2].saldo), 400)}catch(e){image.print(font, 165, 382, `-`, 400)};
      		try{image.print(font, 140, 440, maxChars(array[3].id), 400)}catch(e){image.print(font, 140, 440, `-`, 400)};
      		try{image.print(font, 165, 502, toBRL(array[3].saldo), 400)}catch(e){image.print(font, 165, 502, `-`, 400)};
      		try{image.print(font, 140, 560, maxChars(array[4].id), 400)}catch(e){image.print(font, 140, 560, `-`, 400)};
      		try{image.print(font, 165, 615, toBRL(array[4].saldo), 400)}catch(e){image.print(font, 165, 615, `-`, 400)};
      		image.getBuffer(jimp.MIME_PNG, (err, i) => {
      			return interaction.editReply({ content:'Ranking global de saldo', files: [{ attachment: i, name: "rankglobal.png"}] });
      		});
    			});
				});
  		};
		}catch(e){
			console.log(e);
			return err();
		};
	}else if(command == "objetos"){
		try{
			await interaction.deferReply();
			let objectsEmbed = new MessageEmbed()
				.setTitle("Loja - Objetos")
    		.setColor('#00EEEE')
    		.setDescription(`Na minha loja de objetos, você pode escolher um objeto e ele aparecerá no seu perfil. Para comprar, basta usar esse comando (\`/eco objetos\`) e escolher um objeto. Verifique se seu saldo é suficiente para comprar um deles usando \`/eco saldo\`.`)
    		.addField(`<:violao:844060020291272724> - Violão Di Giorgio`, `R$ 1.000`)
    		.addField(`:guitar: - Guitarra Fender`, `R$ 3.000`)
    		.addField(`<:jbl:844423641960546314> - Caixinha de som - JBL`, `R$ 650,00`)
    		.addField(`<:iphone:844424383647842365> - iPhone 13 Pro Max`, `R$ 9.000`)
    		.addField(`<:galaxyA71:844425394048204842> - Samsung Galaxy A17+`, `R$ 3.999`)
    		.addField(`<:pcgamer:844426174816845831> - PC Gamer Samsung - Completo`, `R$ 14.300`)
    		.addField(`:bike: - Bike Caloi`, `R$ 800`)
				.addField(`<:drone:844429166991769621> - Drone AirLink`, `R$ 1.000`);

			if(!string) return interaction.editReply({embeds: [objectsEmbed.toJSON()]});
			let money = db.get(`money_${author}`) || 0;
			let objects = db.get(`objetos_${author}`);
			let getEmoji = emoji => client.emojis.cache.get(emoji).toString();
			let objetos = {
				"obj":[
					{
						"name":"Violão Di Giorgio",
						"price":1000,
						"emoji":getEmoji("844060020291272724"),
						"image":"http://4.bp.blogspot.com/-MUpnuinBt0E/Uk-ShLxoKyI/AAAAAAAAY7A/NuZwRDQYPkw/s1600/Instrumentos-Musicais-em-png-queroiamgem-Cei%C3%A7a-Crispim+(1).png"
					},
					{
						"name":"Guitarra Fender",
						"price":3000,
						"emoji":":guitar:",
						"image":"https://cdn.pixabay.com/photo/2016/05/25/08/10/music-1414165_960_720.png"
					},
					{
						"name":"Caixa de som - JBL",
						"price":650,
						"emoji":getEmoji("844423641960546314"),
						"image":"https://www.qualitech.info/media/catalog/product/cache/1/image/800x/9df78eab33525d08d6e5fb8d27136e95/s/h/shopping_1.png"
					},
					{
						"name":"iPhone 13 Pro Max",
						"price":9000,
						"emoji":getEmoji("844424383647842365"),
						"image":"https://assets.swappie.com/cdn-cgi/image/width=600,height=600,fit=contain,format=auto/swappie-product-iphone-13-pro-max-graphite-back.png"
					},
					{
						"name":"Samsung Galaxy A17+",
						"price":3999,
						"emoji":getEmoji("844425394048204842"),
						"image":"http://freebiescloud.com/wp-content/uploads/2020/10/3-72-1024x1024.png"
					},
					{
						"name":"PC Gamer Samsung + Placa RTX",
						"price":14300,
						"emoji":getEmoji("844426174816845831"),
						"image":"https://img.terabyteshop.com.br/archive/577435565/monitor-samsung-10259-02.png"
					},
					{
						"name":"Bicicleta Caloi",
						"price":800,
						"emoji":":bike:",
						"image":"https://www.pontofrio-imagens.com.br/html/conteudo-produto/418/50000917/imagens/bicicleta_1.png"
					},
					{
						"name":"Drone AirLink",
						"price":1000,
						"emoji":getEmoji("844429166991769621"),
						"image":"https://www.pngall.com/wp-content/uploads/4/Drone-PNG.png"
					}
				]
			};

			for(var i = 0; i < objetos.obj.length; i++){
				let name = objetos.obj[i].name;
				let price = objetos.obj[i].price;
				let emoji = objetos.obj[i].emoji;
				let image = objetos.obj[i].image;
				let stringUp = chartUp(string)
				let regex = new RegExp(stringUp, 'gmi');
				if(regex.test(name)){
					if(price > money) return messagerEphemeral(`Ops! Seu saldo não é suficiente para comprar este objeto!`);

					let newsaldo = (money - price);
          let nc = `${emoji} - ${name}`;
          db.push(`objetos_${author}`, nc);
          db.set(`money_${author}`, newsaldo)
          let embed = new MessageEmbed()
					.setTitle(`${name} comprado com sucesso!`)
					.setColor("#00EEEE")
					.setThumbnail(image)
					.setDescription(`Parabéns! Você, ao que parece, trabalhou bem e conseguiu uma grana pra comprar um objeto de qualidade!\n\nSeu novo saldo: \`${toBRL(newsaldo)}\`.`);
			    return embedder(embed);
				};
			};
		}catch(e){
			console.log(e);
			return err();
		}
	}
};
