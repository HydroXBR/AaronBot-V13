const express = require('express')
const app = express()
const { Client, Intents, MessageEmbed } = require('discord.js')
const token = process.env['TOKEN']
const db = require('quick.db')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const guildId = '800795888817143828'
const clientId = process.env['clientId']
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })
const bodyParser = require('body-parser')
const bannedUsers = db.get('banned')
const music = require('@koenie06/discord.js-music')
const events = music.event
const displayAvatar = (id, avatar) => `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=1024`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.listen(8000)

app.get('/', (request, response) => {
	let ping = new Date()
	ping.setHours(ping.getHours() - 3)
	let addZero = num => num < 10 ? `0${num}` : num.toString()
	console.info(
		`Bot online - Ping recebido às ${addZero(ping.getUTCHours())}:${addZero(ping.getUTCMinutes())}:${addZero(
			ping.getUTCSeconds()
		)}`
	)
	response.sendStatus(200)
})

events.on('addSong', async (channel, songInfo, requester) => {
	let getEmoji = emoji => client.emojis.cache.get(emoji).toString()
	const addSongEmbed = new MessageEmbed()
		.setTitle('Música adicionada à lista')
		.setDescription(
			`${getEmoji('887937997738233916')} **Música:** [${songInfo.title}](${songInfo.url})   |   ${getEmoji(
				'916163942097768469'
			)} \`${songInfo.likes}\`\n${getEmoji('916164183752577084')} \`${songInfo.views}\``
		)
		.setColor('#00EEEE')
		.setThumbnail(songInfo.thumbnail)
		.setFooter(`${requester.tag}`, displayAvatar(requester.id, requester.avatar))
	channel.send({
		embeds: [addSongEmbed.toJSON()]
	})
})

events.on('playSong', async (channel, songInfo, requester) => {
	console.log(requester)
	let getEmoji = emoji => client.emojis.cache.get(emoji).toString()
	const playlistEmbed = new MessageEmbed()
		.setTitle('Tocando agora:')
		.setDescription(
			`${getEmoji('887937997738233916')} **Música:** [${songInfo.title}](${songInfo.url})\n${getEmoji(
				'916163942097768469'
			)} \`${songInfo.likes}\`   |   ${getEmoji('916164183752577084')} \`${songInfo.views}\``
		)
		.setColor('#00EEEE')
		.setThumbnail(songInfo.thumbnail)
		.setFooter(`${requester.tag}`, displayAvatar(requester.id, requester.avatar))

	channel.send({
		embeds: [playlistEmbed.toJSON()]
	})
})

events.on('finish', async channel => {
	const finishEmbed = new MessageEmbed()
		.setTitle('Finish')
		.setDescription(
			`As músicas terminaram, por isso saí do canal. Para ouvir novamente outras músicas, use \`/music play\` :)`
		)
		.setColor('#00EEEE')
		.setThumbnail('https://www.pngrepo.com/png/146995/512/stop.png')
		.setFooter(`Muito obrigado por me utilizar ♥`)

	channel.send({
		embeds: [finishEmbed.toJSON()]
	})
})

const guildcommands = [
	new SlashCommandBuilder()
		.setName('new')
		.setDescription('Adicione uma notícia no jornal do Aaron')
		.addStringOption(option => option.setName('link').setDescription('Link da notícia').setRequired(true))
		.addStringOption(option =>
			option.setName('imagelink').setDescription('Link da imagem da notícia').setRequired(true)
		)
		.addStringOption(option => option.setName('title').setDescription('Título da notícia').setRequired(true))
		.addStringOption(option => option.setName('subtitle').setDescription('Subtítulo da notícia').setRequired(true))
		.addStringOption(option => option.setName('notice').setDescription('Notícia').setRequired(true))
		.addStringOption(option => option.setName('agency').setDescription('Agência da notícia').setRequired(true))
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Tipo de notícia')
				.setRequired(true)
				.addChoice('normal', 'normal')
				.addChoice('tech', 'tech')
		),
	new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Execute um código [Desenvolvedores]')
		.addStringOption(option => option.setName('code').setDescription('Código a ser executado').setRequired(true)),
	new SlashCommandBuilder()
		.setName('removechannel')
		.setDescription('Remova um canal da lista de notícias')
		.addStringOption(option => option.setName('channel').setDescription('Canal a ser removido').setRequired(true))
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Tipo do canal a ser removido')
				.setRequired(true)
				.addChoice('normal', 'normal')
				.addChoice('tech', 'tech')
		)
].map(command => command.toJSON())

/*const rest = new REST({ version: '9' }).setToken(token).put(Routes.applicationGuildCommands(clientId, guildId), { body: guildcommands }).then(() => console.log('Successfully registered application commands - GUILD.')).catch(console.error);*/

const cmds = [
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Saiba sobre meus comandos ou cada um deles especificamente')
		.addStringOption(option => option.setName('command').setDescription('Comando específico').setRequired(false)),
	new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Exibe o avatar de um usuário')
		.addUserOption(option => option.setName('user').setDescription('Usuário para exibir o avatar').setRequired(false)),
	new SlashCommandBuilder()
		.setName('addnews')
		.setDescription('Adicione um canal para que eu envie notícias')
		.addChannelOption(option =>
			option.setName('channel').setDescription('Canal para eu enviar as notícias').setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('tipo')
				.setDescription('Tipo de notícias que enviarei')
				.setRequired(true)
				.addChoice('all', 'normal')
				.addChoice('tech', 'tech')
				.addChoice('off (desativar)', 'off')
		),
	new SlashCommandBuilder()
		.setName('social')
		.setDescription('Ações como abraçar, toca aqui, beijar, etc.')
		.addStringOption(option =>
			option
				.setName('ação')
				.setDescription('Escolha a ação que quer executar')
				.setRequired(true)
				.addChoice('hug (abraço)', 'hug')
				.addChoice('kiss (beijo)', 'kiss')
				.addChoice('love (dizer que ama)', 'love')
				.addChoice('tap (tapinha)', 'tap')
				.addChoice('tok (toca aqui)', 'tok')
				.addChoice('caf (cafuné)', 'caf')
				.addChoice('hi', 'hi')
				.addChoice('sev (olhar sério)', 'sev')
		)
		.addUserOption(option => option.setName('user').setDescription('Usuário para executar a ação').setRequired(true)),
	new SlashCommandBuilder()
		.setName('adm')
		.setDescription('Ações de administração e moderação, como expulsar, banir e mutar.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('Bana um usuário do servidor')
				.addUserOption(option => option.setName('user').setDescription('Usuário para banir').setRequired(true))
				.addStringOption(option =>
					option.setName('reason').setDescription('Motivo para banir o usuário').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('Expulse um usuário do servidor')
				.addUserOption(option => option.setName('user').setDescription('Usuário para expulsar').setRequired(true))
				.addStringOption(option =>
					option.setName('reason').setDescription('Motivo para expulsar o usuário').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('timeout')
				.setDescription('Coloque um usuário de castigo (mute um usuário)')
				.addUserOption(option => option.setName('user').setDescription('Usuário para timeout').setRequired(true))
				.addStringOption(option =>
					option.setName('reason').setDescription('Motivo para castigar o usuário').setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('time')
						.setDescription('Tempo que o usuário ficará de castigo')
						.setRequired(true)
						.addChoice('10min', '10min')
						.addChoice('30min', '30min')
						.addChoice('1h', '1h')
						.addChoice('3h', '3h')
						.addChoice('12h', '12h')
						.addChoice('24h', '24h')
						.addChoice('72h (3 days)', '72h')
						.addChoice('168h (uma semana, a week)', '168h')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('warn')
				.setDescription('Aplique uma advertência em um usuário')
				.addUserOption(option => option.setName('user').setDescription('Usuário para advertir').setRequired(true))
				.addStringOption(option =>
					option.setName('reason').setDescription('Motivo para advertir o usuário').setRequired(true)
				)
		),
	new SlashCommandBuilder()
		.setName('info')
		.setDescription('Obtenha informações, ceps e outras coisas úteis')
		.addSubcommand(subcommand =>
			subcommand
				.setName('binary')
				.setDescription('Codifique um texto em código binário')
				.addStringOption(option => option.setName('text').setDescription('Texto que irei codificar').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('instaload')
				.setDescription('Baixe ou obtenha o link de uma foto, vídeo ou reel do Instagram, de um perfil público')
				.addStringOption(option => option.setName('link').setDescription('Link do post').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('calc')
				.setDescription('Calcule expressões algébricas')
				.addStringOption(option =>
					option.setName('expression').setDescription('Expressão algébrica básica para cálculo').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('clima')
				.setDescription('Obtenha informações climáticas sobre determinada localização')
				.addStringOption(option =>
					option.setName('local').setDescription('Localização para obter informações climáticas').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('unbinary')
				.setDescription('Decodifique um código binário')
				.addStringOption(option => option.setName('code').setDescription('Código binário').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('morse')
				.setDescription('Codifique um texto para código morse')
				.addStringOption(option => option.setName('text').setDescription('Texto a ser codificado').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand.setName('calculator').setDescription('Calcule usando minha calculadora de botões')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cep')
				.setDescription('Obtenha informações sobre determinado CEP')
				.addStringOption(option =>
					option.setName('cep').setDescription('CEP para buscar informações').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('letra')
				.setDescription('Obtenha a letra de uma música')
				.addStringOption(option => option.setName('music').setDescription('Nome da música e autor').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('decodeuri')
				.setDescription('Decodifique uma URI')
				.addStringOption(option => option.setName('uri').setDescription('URI a ser decodificada').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('token')
				.setDescription('Gere senhas aleatórias para serem usadas em qualquer plataforma')
				.addStringOption(option =>
					option
						.setName('tipo')
						.setName('tipo')
						.setDescription('Tipo de senha')
						.setRequired(true)
						.addChoice('Alphanumeric (letras e números)', 'an')
						.addChoice('Letters (apenas letras)', 'let')
						.addChoice('Numbers (apenas números)', 'num')
						.addChoice('All (tudo + caracteres especiais)', 'all')
				)
		),
	new SlashCommandBuilder()
		.setName('eco')
		.setDescription('Faça pagamentos, compras, e movimente seu dinheiro')
		.addSubcommand(subcommand => subcommand.setName('daily').setDescription('Pegue seu saldo diário'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('perfil')
				.setDescription('Veja um perfil de usuário')
				.addUserOption(option => option.setName('user').setDescription('Perfil que irei exibir').setRequired(false))
		)
		.addSubcommand(subcommand => subcommand.setName('work').setDescription('Trabalhe diariamente e ganhe dinheiro'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('pay')
				.setDescription('Transfira dinheiro na conta Aaron')
				.addIntegerOption(option =>
					option.setName('money').setDescription('Quantidade de dinheiro a transferir').setRequired(true)
				)
				.addUserOption(option =>
					option.setName('user').setDescription('Transfira dinheiro para alguém na conta Aaron').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('carros')
				.setDescription('Compre carros na loja Aaron')
				.addStringOption(option =>
					option
						.setName('car')
						.setDescription('Escolha o carro que deseja comprar')
						.setRequired(false)
						.addChoice('Kombi Volkswagen Branca (R$ 4.500)', 'kombi')
						.addChoice('Fusca Wolkswagen Azul (R$ 5.000)', 'fusca')
						.addChoice('Carro Fiat Siena Vermelho (R$ 10.000)', 'siena')
						.addChoice('Carro Chevrolet Sedan Vermelho (R$ 15.000)', 'sedan')
						.addChoice('Picape Hilux 4x4 Branca (R$ 20.000)', 'hilux')
						.addChoice('Carro Ranger Rover (R$ 35.000)', 'rover')
						.addChoice('Carro Ferrari Vermelho (R$ 100.000)', 'ferrari')
						.addChoice('Carro Lamborghini Aventador Branca (R$ 101.000)', 'lamborghini')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('objetos')
				.setDescription('Compre objetos na loja Aaron')
				.addStringOption(option =>
					option
						.setName('object')
						.setDescription('Escolha o objeto que deseja comprar')
						.setRequired(false)
						.addChoice('Violão Di Giorgio (R$ 1.000)', 'violao')
						.addChoice('Guitarra Fender (R$ 3.000)', 'guitarra')
						.addChoice('Caixa de som JBL (R$ 650)', 'jbl')
						.addChoice('iPhone 13 Pro Max (R$ 9.000)', 'iphone')
						.addChoice('Samsung Galaxy A17+ (R$ 3.999)', 'galaxy')
						.addChoice('PC Gamer Samsung + Placa RTX (R$ 14.300)', 'pc')
						.addChoice('Bicicleta Caloi (R$ 800)', 'bike')
						.addChoice('Drone AirLink (R$ 1.000)', 'drone')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('especialidade')
				.setDescription('Escolha sua especialidade neste servidor')
				.addStringOption(option =>
					option
						.setName('especialidade')
						.setDescription('Escolha a especialidade a ser exibida no comando perfil')
						.setRequired(true)
						.addChoice('🎙️ Pregação', 'pregaçao')
						.addChoice('🎸 Música', 'musica')
						.addChoice('🎮 Games', 'games')
						.addChoice('🇯🇵 Anime', 'anime')
						.addChoice('✏️ Desenho', 'desenho')
						.addChoice('🖌 Pintura', 'pintura')
						.addChoice('🏞️ Arte', 'arte')
						.addChoice('💃 Dança', 'dança')
						.addChoice('🎤 Canto', 'canto')
						.addChoice('▶️ YouTuber', 'youtuber')
						.addChoice('🤖 Programação', 'programaçao')
						.addChoice('🔢 Números', 'numeros')
						.addChoice('📝 Escrita', 'escrita')
						.addChoice('⚽ Esportes', 'esportes')
						.addChoice('🇺🇸 Idiomas', 'idiomas')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('profissao')
				.setDescription('Escolha sua profissão neste servidor')
				.addStringOption(option =>
					option
						.setName('profissao')
						.setDescription('Escolha a profissão a ser exibida no comando perfil')
						.setRequired(true)
						.addChoice('🤡 Palhaço(a)', 'palhaço')
						.addChoice('📸 Fotógrafo(a)', 'fotografo')
						.addChoice('⚒️ Minerador(a)', 'minerador')
						.addChoice('🔨 Marceneiro(a)', 'marceneiro')
						.addChoice('🚑 Médico(a)', 'medico')
						.addChoice('⛑️ Bombeiro(a)', 'bombeiro')
						.addChoice('👨‍⚖️ Juiz(a)', 'juiz')
						.addChoice('🚓 Policial', 'policial')
						.addChoice('▶️ Youtuber', 'youtuber')
						.addChoice('🏞️ Artista', 'artista')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('papel')
				.setDescription('Escolha o papel de parede do comando perfil')
				.addStringOption(option =>
					option
						.setName('papel')
						.setDescription('Escolha o papel de parede a ser exibido no comando perfil')
						.setRequired(false)
						.addChoice('Clássico', 'classico')
						.addChoice('Céu', 'ceu')
						.addChoice('Universo', 'universo')
						.addChoice('Madeira', 'madeira')
						.addChoice('Esverdeado', 'esverdeado')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('level')
				.setDescription('Consulte o level de um usuário')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para exibir o nível e xp').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ranking')
				.setDescription('Veja os rankings de saldo')
				.addStringOption(option =>
					option
						.setName('type')
						.setDescription('Tipo de ranking')
						.setRequired(true)
						.addChoice('Global', 'global')
						.addChoice('Local', 'local')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('saldo')
				.setDescription('Exibe o saldo da conta Aaron de um usuário')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para exibir o saldo').setRequired(false)
				)
		),
	new SlashCommandBuilder()
		.setName('fun')
		.setDescription('Se divirta usando os comandos de diversão!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('dado')
				.setDescription('Jogue o dado!')
				.addIntegerOption(option =>
					option.setName('number').setDescription('Número para jogar o dado').setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('stonks')
				.setDescription('Gere um meme stonks')
				.addStringOption(option => option.setName('text').setDescription('Texto para gerar o meme').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('notstonks')
				.setDescription('Gere um meme not stonks')
				.addStringOption(option => option.setName('text').setDescription('Texto para gerar o meme').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('bigtxt')
				.setDescription('Converta letras em emojis deixando-as grandes')
				.addStringOption(option => option.setName('text').setDescription('Texto para converter').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('font')
				.setDescription('Altere a fonte de um texto')
				.addStringOption(option => option.setName('text').setDescription('Texto para alterar').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('laranjo')
				.setDescription('Gere um meme do laranjo')
				.addStringOption(option => option.setName('text').setDescription('Texto para gerar o meme').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('jogodavelha')
				.setDescription('Jogue o Jogo da Velha com um usuário')
				.addUserOption(option => option.setName('user').setDescription('Usuário para jogar').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('joken')
				.setDescription('Jogue cara ou coroa com o Aaron')
				.addStringOption(option =>
					option
						.setName('mode')
						.setDescription('Escolha: cara ou coroa?')
						.setRequired(true)
						.addChoice('cara', 'cara')
						.addChoice('coroa', 'coroa')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('invert')
				.setDescription('Inverta a imagem de perfil de um usuário')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para inverter foto de perfil').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('pb')
				.setDescription('Edição da foto de perfil de um usuário em escala de cinza')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('Usuário para editar a foto de perfil para escala de cinza')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ship')
				.setDescription('Shippe dois usuários ♥')
				.addUserOption(option => option.setName('user1').setDescription('Usuário para shippar').setRequired(true))
				.addUserOption(option => option.setName('user2').setDescription('Outro usuário para shippar').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('sepia')
				.setDescription('Aplique o efeito de sépia na imagem de perfil de um usuário')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para aplicar efeito de sépia').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('pflip')
				.setDescription('Jogue "pedra, papel, tesoura" com o Aaron')
				.addStringOption(option =>
					option
						.setName('mode')
						.setDescription('Escolha: pedra, papel ou tesoura?')
						.setRequired(true)
						.addChoice('pedra', 'pedra')
						.addChoice('papel', 'papel')
						.addChoice('tesoura', 'tesoura')
				)
		),
	new SlashCommandBuilder()
		.setName('geral')
		.setDescription('Comandos gerais do Aaron')
		.addSubcommand(subcommand => subcommand.setName('botinfo').setDescription('Veja minhas informações técnicas'))
		.addSubcommand(subcommand =>
			subcommand.setName('convite').setDescription('Entre no meu servidor oficial ou me adicione no seu servidor')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('walink')
				.setDescription('Gere um link para conversar no WhatsApp sem adicionar o contato')
				.addStringOption(option =>
					option.setName('ddd').setDescription('Insira apenas o DDD, por exemplo, 11 ou 86').setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('telefone')
						.setDescription('Insira o número de telefone com 9 e sem o DDD, exemplo: 912345678')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand => subcommand.setName('donate').setDescription('Saiba como doar e me ajudar'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('feedback')
				.setDescription('Envie um feedback para minha equipe')
				.addStringOption(option => option.setName('text').setDescription('Escreva seu feedback').setRequired(true))
		)
		.addSubcommand(subcommand => subcommand.setName('servericon').setDescription('Veja o ícone do servidor'))
		.addSubcommand(subcommand =>
			subcommand.setName('serverinfo').setDescription('Veja informações básicas sobre o servidor')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('userinfo')
				.setDescription('Veja informações básicas sobre um usuário')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para exibir informações').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('vote').setDescription('Saiba como votar, me ajudar e ainda ganhar recompensa')
		)
		.addSubcommand(subcommand =>
			subcommand.setName('deleteaaron').setDescription('Delete todas as suas informações em meu sistema')
		)
		.addSubcommand(subcommand =>
			subcommand.setName('news').setDescription('Saiba como funciona meu sistema de notícias')
		)
		.addSubcommand(subcommand => subcommand.setName('ticket').setDescription('Abra um ticket de suporte no servidor'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('youtubetogether')
				.setDescription('Obtenha um link para Youtube em call do Discord, o YouTube Together')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('sugestao')
				.setDescription('Envie uma sugestão ou um feedback para a administração do servidor')
				.addStringOption(option =>
					option.setName('suggestion').setDescription('Descreva brevemente sua sugestão').setRequired(true)
				)
		),
	new SlashCommandBuilder()
		.setName('gerency')
		.setDescription('Gerência do servidor')
		.addSubcommand(subcommand =>
			subcommand.setName('banlist').setDescription('Veja a lista de usuários banidos no servidor')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('createchannel')
				.setDescription('Crie um canal no servidor')
				.addStringOption(option => option.setName('name').setDescription('Nome do canal').setRequired(true))
				.addStringOption(option =>
					option
						.setName('type')
						.setDescription('Tipo do canal')
						.setRequired(true)
						.addChoice('texto', 'text')
						.addChoice('voz', 'voice')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('deletechannel')
				.setDescription('Delete um canal no servidor')
				.addChannelOption(option => option.setName('channel').setDescription('Canal a ser deletado').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('slowmode')
				.setDescription('Aplique o Modo Lento no canal')
				.addStringOption(option =>
					option.setName('tempo').setDescription('Intervalo do Modo Lento (ex: 2s)').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('poll')
				.setDescription('Faça uma votação no servidor')
				.addChannelOption(option =>
					option.setName('channel').setDescription('Canal para enviar a votação').setRequired(true)
				)
				.addStringOption(option => option.setName('text').setDescription('Texto da votação').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('nick')
				.setDescription('Altere o nickname de um usuário no servidor')
				.addUserOption(option =>
					option.setName('user').setDescription('Usuário para alterar o nickname').setRequired(true)
				)
				.addStringOption(option =>
					option.setName('new').setDescription('Novo nickname para o usuário').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('log')
				.setDescription('Envie um log de atualização para um canal no servidor')
				.addStringOption(option =>
					option
						.setName('type')
						.setDescription('Tipo de atualização')
						.setRequired(true)
						.addChoice('improvement, adição', 'add')
						.addChoice('removal, exclusão', 'del')
						.addChoice('neutral, neutro', 'none')
				)
				.addStringOption(option => option.setName('text').setDescription('Texto da atualização').setRequired(true))
				.addChannelOption(option =>
					option.setName('channel').setDescription('Canal para a atualização ser enviada').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ticketrole')
				.setDescription('Configure um cargo para ser mencionado quando um ticket for aberto')
				.addRoleOption(option =>
					option.setName('role').setDescription('Cargo para ser mencionado na abertura de tickets').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ticket')
				.setDescription('Opte por ativar ou desativar o sistema de tickets')
				.addStringOption(option =>
					option
						.setName('action')
						.setDescription('Cargo para ser mencionado na abertura de tickets')
						.setRequired(true)
						.addChoice('on (enable)', 'on')
						.addChoice('off (disable)', 'off')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('suggestionschannel')
				.setDescription('Selecione um canal para serem enviadas sugestões pelo comando /sugestao')
				.addChannelOption(option =>
					option.setName('channel').setDescription('Canal para sugestões serem enviadas').setRequired(true)
				)
		),
	new SlashCommandBuilder()
		.setName('music')
		.setDescription('Execute músicas e outros vídeos em áudio')
		.addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Execute músicas ou vídeos (áudio)')
				.addStringOption(option =>
					option
						.setName('music')
						.setDescription('Insira o link do vídeo ou o nome para ser executado')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand => subcommand.setName('disconnect').setDescription('Me desconecte do canal de voz'))
		.addSubcommand(subcommand => subcommand.setName('stop').setDescription('Pare a execução da música'))
		.addSubcommand(subcommand => subcommand.setName('skip').setDescription('Pule a música'))
		.addSubcommand(subcommand => subcommand.setName('pause').setDescription('Pause a execução da música'))
		.addSubcommand(subcommand => subcommand.setName('continue').setDescription('Continue a execução da música'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('repeat')
				.setDescription('Repita a execução da música')
				.addStringOption(option =>
					option
						.setName('select')
						.setDescription('Ative ou desative a repetição')
						.setRequired(true)
						.addChoice('on', 'true')
						.addChoice('off', 'false')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('volume')
				.setDescription('Altere o volume da música')
				.addIntegerOption(option =>
					option.setName('value').setDescription('Insira um número de 1 a 100').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('jump')
				.setDescription(
					'Pule para uma determinada música da lista de reprodução, conforme mostrado no comando /music queue'
				)
				.addIntegerOption(option =>
					option.setName('number').setDescription('Posição da música (insira um número)').setRequired(true)
				)
		)
		.addSubcommand(subcommand => subcommand.setName('queue').setDescription('Veja a lista de reprodução atual'))
]

/*
const commands = cmds.map(command => command.toJSON())
const rest = new REST({ version: '9' }).setToken(token)
;(async () => {
	try {
		console.log('Started refreshing application (/) commands.')
		await rest.put(Routes.applicationCommands(clientId), { body: commands })
		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
})()*/


client.on('guildCreate', async guild => {
	try {
		const channel = client.channels.cache.get('886971352324669490')
		channel.setName(`🌐 | Servidores: ${client.guilds.cache.size}`)
	} catch (e) {
		console.log(e)
	}
})

client.on('guildDelete', async guild => {
	try {
		const channel = client.channels.cache.get('886971352324669490')
		channel.setName(`🌐 | Servidores: ${client.guilds.cache.size}`)
	} catch (e) {
		console.log(e)
	}
})

client.on('interactionCreate', async interaction => {
	try {
		if (bannedUsers.includes(interaction.member.user.id))
			return interaction.reply('Infelizmente, você foi banido e não pode usar meus comandos :confused: | Se achar que isso é um erro, contate-me em https://abre.ai/aaronbotsite')

		const lv = db.get(`lv_${interaction.member.user.id}`) || 0
		const xp = db.get(`xp_${interaction.member.user.id}`) || 0
		const cmds = db.get(`cmds`) || 0

		if (interaction.type !== 'APPLICATION_COMMAND') {
			console.log('Button')
			/*
				let int = interaction.data.values ? db.set(`iloja${interaction.member.user.id}`, interaction.data.values[0]) : false;
    			setTimeout(() => db.delete(`iloja${interaction.member.user.id}`), 1000);
			*/
		} else {
			try {
				if (xp >= 50 && lv == 0 && xp < 100) {
					db.set(`lv_${interaction.member.user.id}`, 1)
				} else if (xp >= 100 && xp < 300 && lv < 2) {
					db.set(`lv_${interaction.member.user.id}`, 2)
				} else if (xp >= 300 && xp < 500 && lv < 3) {
					db.set(`lv_${interaction.member.user.id}`, 3)
				} else if (xp >= 500 && xp < 700 && lv < 4) {
					db.set(`lv_${interaction.member.user.id}`, 4)
				} else if (xp >= 700 && xp < 900 && lv < 5) {
					db.set(`lv_${interaction.member.user.id}`, 5)
				} else if (xp >= 900 && xp < 1000 && lv < 6) {
					db.set(`lv_${interaction.member.user.id}`, 6)
				} else if (xp >= 1000 && xp < 1150 && lv < 7) {
					db.set(`lv_${interaction.member.user.id}`, 7)
				} else if (xp >= 1150 && xp < 1500 && lv < 8) {
					db.set(`lv_${interaction.member.user.id}`, 8)
				} else if (xp >= 1500 && xp < 2000 && lv < 9) {
					db.set(`lv_${interaction.member.user.id}`, 9)
				} else if (xp >= 2000 && lv < 10) {
					db.set(`lv_${interaction.member.user.id}`, 10)
				}

				db.set(`xp_${interaction.member.user.id}`, xp + 1)
				db.set(`cmds`, cmds + 1)

				const commandId = interaction.id
				const commandName = interaction.commandName
				console.log(
					`Comando utilizado - ${commandName} ${
						interaction.options['_subcommand'] ? interaction.options['_subcommand'] : ''
					} (${interaction.user.id})`
				)

				await require(`./commands/${commandName}.js`).int(client, interaction).catch(console.error)
			} catch (e) {
				console.log(e)
			}
		}
	} catch (e) {
		console.log(e)
	}
})

client.once('ready', () => {
	console.log('Ready!')
	console.log('bot is online')

	let activities = ['ATENÇÃO: ESTOU FUNCIONANDO APENAS EM SLASH COMMANDS! USE /help PARA SABER MAIS.']

	let i = 0

	setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {
		type: 'WATCHING'
	}), 6e4)

	client.user.setStatus('online')
})

client.login(token)
