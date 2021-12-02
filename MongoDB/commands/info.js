const { 
	MessageEmbed,
	MessageButton,
	MessageActionRow 
	} = require('discord.js'),
	fetch = s => import('node-fetch').then(({default: fetch}) => fetch(s)),
	axios = require("axios"),
	weather = require('weather-js'),
	math = require('mathjs');

exports.commands = {
	'commands':['binary', 'unbinary', 'clima', 'cep', 'morse', 'token']
}

exports.int = async(client, interaction) => {
	let command = interaction.options['_subcommand'];
	let string = interaction.options['_hoistedOptions'][0].value;
	let embedder = embed => interaction.editReply({ embeds: [embed.toJSON()] });
	let messager = msg => interaction.editReply({ content: msg });
	let messagerEphemeral = msg => interaction.reply({ content: msg, ephemeral: true });
	let embedderEphemeral = embed => interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
	function generateANToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 			charactersLength));
   	}
   	return result;
	}
	function generateAllToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!*#%+-.';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 			charactersLength));
   	}
   	return result;
	}
	function generateNumToken(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 			charactersLength));
   	}
   	return result;
	}
	function generateLToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 			charactersLength));
   	}
   	return result;
	}
	function err(erro){
		console.log(erro);
		return messagerEphemeral('Ops! Algo deu errado, tente novamente mais tarde :confused:')
	};

	if(command == 'binary'){
		try{
			await interaction.deferReply();
			const urlEncode = `http://some-random-api.ml/binary?text=${encodeURIComponent(string)}`;
			let binary = new Array;
			let binaryResponse;
			await axios.get(urlEncode).then(e => binary.push(e.data.binary))
			const binaryEmbed = new MessageEmbed()
    		.setTitle('Texto codificado em código binário')
    		.setDescription(`\`\`\`${binary[0]}\`\`\``)
    		.setColor("#00EEEE")
    		.setThumbnail("https://3.bp.blogspot.com/-R7JYNwZn6h4/W-6z8rDgEmI/AAAAAAAAApE/8BCVNAIKrQ4B1rIgDTKgnINUVygPe-lIwCLcBGAs/s320/eada9829a322f74ee79247528c30e161941e7e60_00.gif")
    		.setFooter(`Para decodificar, use o comando /info unbinary`)
			binaryResponse = { embeds: [binaryEmbed.toJSON()] };
			return interaction.editReply(binaryResponse)
		}catch(e){
			return err(e);
		}
	}else if(command == 'unbinary'){
		try{
			await interaction.deferReply();
			let unbinaryResponse;
			const urlDecode = `http://some-random-api.ml/binary?decode=${encodeURIComponent(string)}`;
			let unbinary = new Array;
			await axios.get(urlDecode).then(e => {unbinary.push(e.data.text)})
			const unbinaryEmbed = new MessageEmbed()
    		.setTitle('Código binário decodificado')
    		.setDescription(`\`\`\`${unbinary[0]}\`\`\``)
    		.setColor("#00EEEE")
    		.setThumbnail("https://3.bp.blogspot.com/-R7JYNwZn6h4/W-6z8rDgEmI/AAAAAAAAApE/8BCVNAIKrQ4B1rIgDTKgnINUVygPe-lIwCLcBGAs/s320/eada9829a322f74ee79247528c30e161941e7e60_00.gif")
    		.setFooter(`Para codificar, use o comando /info binary`)
			return embedder(unbinaryEmbed);
		}catch(e){
			return err(e);
		}
	}else if(command == 'clima'){
		try{
			await interaction.deferReply();
			weather.find({search: string, degreeType: 'C'}, 
  
  		function (error, result){
    		if(result === undefined || result.length === 0) return interaction.editReply({ content: '❌ | Você enviou uma localização inválida. Por favor, tente novamente e verifique a escrita. Obrigado!', ephemeral: true });

   			let current = result[0].current;
    		let location = result[0].location;
    		let bra = current.observationpoint.replace('Brazil', 'Brasil')
    		let vento = current.winddisplay.replace("Southweast", "Sudoeste").replace("Northwest", "Noroeste").replace("Southeast", "Sudeste").replace("Northeast", "Nordeste").replace("Norteeast", "Nordeste").replace("South", "Sul").replace("North", "Norte").replace("West", "Oeste").replace("East", "Leste")

    		const weatherinfo = new MessageEmbed()
      		.setDescription(`**${current.skytext}**`)
      		.setTitle(`Previsão do tempo para ${/brazil/i.test(current.observationpoint) ? bra : current.observationpoint}`)
      		.setThumbnail("https://i.ibb.co/104ZyGV/pngwing.png")
      		.setTimestamp()
      		.setColor("#00EEEE")
      		.addField(':alarm_clock: Fuso horário', `UTC ${location.timezone}`, true)
      		.addField(':radio_button: Tipo de grau', 'Celsius', true)
      		.addField(':thermometer: Temperatura', `${current.temperature}°`, true)
      		.addField(':dash: Vento', vento, true)
      		.addField(':heavy_plus_sign: Máxima', `${current.feelslike}°`, true)
      		.addField(':droplet: Umidade', `${current.humidity}%`, true)

    		if (/Mostly Cloudy/i.test(current.skytext)) {
      		weatherinfo.setDescription("**Predominantemente nublado** :cloud:")
    		} else if (/Mostly Clear/i.test(current.skytext)) {
      		weatherinfo.setDescription("**Predominantemente limpo** :sparkles:")
				} else if (current.skytext == "Clear") {
      		weatherinfo.setDescription("**Limpo** :sparkles:")
				} else if (current.skytext == "Cloudy") {
      		weatherinfo.setDescription("**Nublado** :cloud:")
    		} else if (current.skytext == "Partly Cloudy") {
    		  weatherinfo.setDescription("**Parcialmente nublado** :cloud:")
    		} else if (current.skytext == "Partly Sunny") {
    		  weatherinfo.setDescription("**Parcialmente ensolarado** :partly_sunny:")
    		} else if (current.skytext == "Sunny") {
    		  weatherinfo.setDescription("**Ensolarado** :sunny:")
    		} else if (current.skytext == "Light Rain") {
    		  weatherinfo.setDescription("**Chuva leve** :cloud_rain:")
    		} else if (current.skytext == "Fair") {
    		  weatherinfo.setDescription("**Tempo ótimo** :white_sun_cloud:")
    		} else if (current.skytext == "Mostly Sunny") {
    		  weatherinfo.setDescription("**Predominantemente ensolarado** :sunny:")
    		}

    	interaction.editReply({ embeds: [weatherinfo.toJSON()] })
  		})
		}catch(e){
			return err(e);
		}
	}else if(command == 'cep'){
		try{
			await interaction.deferReply();
			if(/[a-z]/i.test(string) || string.trim().split('').length > 9) return interaction.editReply({ content:`Ops! Isso não parece ser um CEP... Um CEP possui 8 dígitos numéricos. Por favor, tente novamente. :wink:`, ephemeral: true });
  		let cep = /-/gmi.test(string) ? string.replace("-", "") : string;

  		fetch(`https://viacep.com.br/ws/${cep}/json/`).then(response => response.json().then(res => {
      	let estado;
        switch (res.uf) {
          case "AC":
          estado = "Acre (AC)"
          break
          case "AL":
          estado = "Alagoas (AL)"
          break
          case "AP":
          estado = "Amapá (AP)"
          break
          case "AM":
          estado = "Amazonas (AM)"
          break
          case "BA":
          estado = "Bahia (BA)"
          break
          case "CE":
          estado = "Ceará (CE)"
          break
          case "DF":
          estado = "Distrito Federal (DF)"
          break
          case "ES":
          estado = "Espírito Santo (ES)"
          break
          case "GO":
          estado = "Goiás (GO)"
          break
          case "MA":
          estado = "Maranhão (MA)"
          break
          case "MT":
          estado = "Mato Grosso (MT)"
          break
          case "MS":
          estado = "Mato Grosso do Sul (MS)"
          break
          case "MG":
          estado = "Minas Gerais (MG)"
          break
          case "PA":
          estado = "Pará (PA)"
          break
          case "PB":
          estado = "Paraíba (PB)"
          break
          case "PR":
          estado = "Paraná (PR)"
          break
          case "PE":
          estado = "Pernambuco (PE)"
          break
          case "PI":
          estado = "Piauí (PI)"
          break
          case "RJ":
          estado = "Rio de Janeiro (RJ)"
          break
          case "RN":
          estado = "Rio Grande do Norte (RN)"
          break
          case "RS":
          estado = "Rio Grande do Sul (RS)"
          break
          case "RO":
          estado = "Rondônia (RO)"
          break
          case "RR":
          estado = "Roraima (RR)"
          break
          case "SC":
          estado = "Santa Catarina (SC)"
          break
          case "SP":
          estado = "São Paulo (SP)"
          break
          case "SE":
          estado = "Sergipe (SE)"
          break
          case "TO":
          estado = "Tocantins (TO)"
          break
        }

      let cepEmbed = new MessageEmbed()
        .setTitle(`:map: Dados do local - Consulta por CEP`)
        .setColor("#00EEEE")
        .setThumbnail("https://campeamudancas.com.br/wp-content/uploads/2017/05/Mudan%C3%A7a-local.gif")
        .addField(`:round_pushpin: CEP`, res.cep)
        .addField(`:motorway: Logradouro`, `${res.logradouro == "" ? "Não fornecido" : res.logradouro}`)
        .addField(`:busstop: Complemento`, `${res.complemento == "" ? "Não fornecido" : res.complemento}`)
        .addField(`:homes: Bairro`, `${res.bairro == "" ? "Não fornecido" : res.bairro}`)
        .addField(`:cityscape: Cidade/município`, res.localidade)
        .addField(`:globe_with_meridians: Estado`, `${res.uf == "" ? "Não fornecido" : estado}`)
        .addField(`<:ibge:845545085705388042> Código IBGE`, `${res.ibge == "" ? "Não fornecido" : res.ibge}`)
        .addField(`:telephone_receiver: DDD Local`, `${res.ddd == "" ? "Não fornecido" : res.ddd}`)
        .addField(`<:siafi:845546243890610206> Código SIAFI`, `${res.siafi == "" ? "Não fornecido" : res.siafi}`)
        .setFooter(`Doe e me ajude a ficar online! Use o comando -donate para saber mais ♥`)

        if (!res.gia == "") {
          cepEmbed.addField(`<:gia:845545453419364413> Código GIA`, res.gia)
        } else if (res.cep == undefined || res.cep == "undefined") {
          return interaction.editReply({ content:`Ops, ${message.author}! Houve um erro. Por favor, verifique o CEP digitado, talvez ele não exista! Obrigado :wink:`, ephemeral: true });
        }

      	interaction.editReply({ embeds: [cepEmbed.toJSON()] })
    		})
			)
		}catch(e){
			return err(e);
		}
	}else if(command == 'morse'){
		try{
			await interaction.deferReply();
    	let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("")
			let	morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(",");
			let text = string.toUpperCase();
			while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
				text = text.replace("Ä","AE").replace("Ö","OE").replace("Ü","UE");
			}
			if (text.startsWith(".") || text.startsWith("-")) {
				text = text.split(" ");
				let length = text.length;
				for (i = 0; i < length; i++) {
					text[i] = alpha[morse.indexOf(text[i])];
					}
				text = text.join("");
			}else{
				text = text.split("");
				let length = text.length;
			for (i = 0; i < length; i++) {
					text [i] = morse[alpha.indexOf(text[i])];
				}
					text = text.join(" ");
			}

			const morseEmbed = new MessageEmbed()
    			.setTitle('Texto codificado em código morse')
   		 		.setDescription(`\`\`\`${text}\`\`\``)
    			.setColor("#00EEEE")
   				.setThumbnail("https://3.bp.blogspot.com/-R7JYNwZn6h4/W-6z8rDgEmI/AAAAAAAAApE/8BCVNAIKrQ4B1rIgDTKgnINUVygPe-lIwCLcBGAs/s320/eada9829a322f74ee79247528c30e161941e7e60_00.gif");
			
			return interaction.editReply({ embeds: [morseEmbed.toJSON()] })
		}catch(e){
			return err(e);
		}
	}else if(command == 'token'){
		try{
			let senha1;
			let senha2;
			switch(string){
				case "an":
				senha1 = generateANToken(9)
				senha2 = generateANToken(4)
				break;
				case "num":
				senha1 = generateNumToken(9)
				senha2 = generateNumToken(4)
				break;
				case "let":
				senha1 = generateLToken(9)
				senha2 = generateLToken(4)
				break;
				case "all":
				senha1 = generateAllToken(9)
				senha2 = generateAllToken(4)
				break;
			}

			let tokenEmbed = new MessageEmbed()
    		.setTitle("Senhas geradas com sucesso")
    		.setColor(`RANDOM`)
    		.setThumbnail("https://i.pinimg.com/originals/8c/76/55/8c765569971eaf48607970d9f02d4c0b.gif")
    		.setDescription("Como você pediu, gerei automaticamente duas senhas usando aleatoriedade de caracteres, portanto, só **você** tem acesso a ela (esta mensagem também é visível apenas para você).\n\n**IMPORTANTE:** Salve as senhas que você for utilizar, pois ao fechar o Discord, esta mensagem desaparecerá e você e nem ninguém terá acesso aos códigos que estão sendo exibidos agora.")
    		.addField(`Senha 1:`, `||${senha1.toString()}||`)
    		.addField(`Senha 2:`, `||${senha2.toString()}||`);

			return interaction.reply({ embeds: [tokenEmbed.toJSON()], ephemeral: true })
		}catch(e){
			return err(e);
		}
	}else if(command == 'calc'){
		try{
			await interaction.deferReply();
			let resp;
			try{
    		let c = string.replace(/\^+/gmi, '**');
    		resp = math.evaluate(c);
			}catch(error){
        return messagerEphemeral('Por favor, forneça uma expressão algébrica **válida**, lembre-se que para multiplicar, deve ser usado \`*\`, e para potência, \`\^\` ou \`\*\*\` :wink:')
    	};

  		const calcEmbed = new MessageEmbed()
    		.setColor("#00EEEE")
    		.setThumbnail('https://media.giphy.com/media/Lr9IC7PQqd9aOozMws/giphy.gif')
    		.setTitle('Calculadora')
    		.addField('Questão', "```css\n" + string + "```")
    		.addField('Resultado', "```css\n" + resp + "```");
			
			return embedder(calcEmbed);
		}catch(e){
			return err(e);
		};
	}
}
