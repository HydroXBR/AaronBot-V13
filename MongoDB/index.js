const express = require("express")
const app = express()
const { Client, Intents } = require('discord.js')
const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
})

const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const token = process.env['TOKEN'];
const guildId = '800795888817143828';
const clientId = process.env['clientId'];

bodyParser = require('body-parser')

const economia = require("./database/economia");
const system = require("./database/system");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));
app.listen(3000, () => {});

app.get("/", (request, response) => {
    var ping = new Date();
    ping.setHours(ping.getHours() - 3);
    var addZero = num => num < 10 && `0${num}` || num;
    console.info(`Bot online - Ping recebido às ${addZero(ping.getUTCHours())}:${addZero(ping.getUTCMinutes())}:${addZero(ping.getUTCSeconds())}`);
    response.sendStatus(200);
});

require("./db_connect")();

const guildcommands = [
	new SlashCommandBuilder()
		.setName('new')
		.setDescription('Adicione uma notícia no jornal do Aaron')
		.addStringOption(option => 
			option.setName('link')
			.setDescription('Link da notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('imagelink')
			.setDescription('Link da imagem da notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('title')
			.setDescription('Título da notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('subtitle')
			.setDescription('Subtítulo da notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('notice')
			.setDescription('Notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('agency')
			.setDescription('Agência da notícia')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('type')
			.setDescription('Tipo de notícia')
			.setRequired(true)
			.addChoice('normal', 'normal')
			.addChoice('tech', 'tech')),
	new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Execute um código [Desenvolvedores]')
		.addStringOption(option => 
			option.setName('code')
			.setDescription('Código a ser executado')
			.setRequired(true))
].map(command => command.toJSON());

/*const rest = new REST({ version: '9' }).setToken(token).put(Routes.applicationGuildCommands(clientId, guildId), { body: guildcommands }).then(() => console.log('Successfully registered application commands - GUILD.')).catch(console.error);*/

const cmds = [
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Saiba sobre meus comandos ou cada um deles especificamente')
		.addStringOption(option => 
			option.setName('command')
			.setDescription('Comando específico')
			.setRequired(false)),
	new SlashCommandBuilder()
		.setName('baixar')
		.setDescription('Gera um link para baixar um vídeo disponível no YouTube')
		.addStringOption(option => 
			option.setName('pesquisa')
			.setDescription('Insira o link do vídeo ou pesquise')
			.setRequired(true)),
	new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Exibe o avatar de um usuário')
		.addUserOption(option => 
			option.setName('user')
			.setDescription('Usuário para exibir o avatar')
			.setRequired(false)),
	new SlashCommandBuilder()
		.setName('addnews')
		.setDescription('Adicione um canal para que eu envie notícias')
		.addChannelOption(option => 
			option.setName('channel')
			.setDescription('Canal para eu enviar as notícias')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('tipo')
			.setDescription('Tipo de notícias que enviarei')
			.setRequired(true)
			.addChoice('all', 'normal')
			.addChoice('tech', 'tech')
			.addChoice('off (desativar)', 'off')),
	new SlashCommandBuilder()
		.setName('social')
		.setDescription('Ações como abraçar, toca aqui, beijar, etc.')
		.addStringOption(option => 
			option.setName('ação')
				.setDescription('Escolha a ação que quer executar')
				.setRequired(true)
				.addChoice('hug (abraço)', 'hug')
				.addChoice('kiss (beijo)', 'kiss')
				.addChoice('love (dizer que ama)', 'love')
				.addChoice('tap (tapinha)', 'tap')
				.addChoice('tok (toca aqui)', 'tok')
				.addChoice('caf (cafuné)', 'caf')
				.addChoice('hi', 'hi')
				.addChoice('sev (olhar sério)', 'sev'))
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para executar a ação')
				.setRequired(true)),
	new SlashCommandBuilder()
		.setName('administrator')
		.setDescription('Ações de administração e moderação, como expulsar, banir e mutar.')
		.addStringOption(option => 
			option.setName('ação')
			.setDescription('Escolha a ação que quer executar')
			.setRequired(true)
			.addChoice('ban', 'ban')
			.addChoice('kick', 'kick')
			.addChoice('warn', 'warn')
			.addChoice('mute', 'mute')
			.addChoice('unmute', 'unmute'))
		.addUserOption(option => 
			option.setName('user')
			.setDescription('Usuário para executar a ação')
			.setRequired(true))
		.addStringOption(option => 
			option.setName('motivo')
			.setDescription('Motivo da ação')
			.setRequired(true)),
	new SlashCommandBuilder()
		.setName('info')
		.setDescription('Obtenha informações, ceps e outras coisas úteis')
		.addSubcommand(subcommand => subcommand
			.setName('binary')
			.setDescription('Codifique um texto em código binário')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto que irei codificar')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('calc')
			.setDescription('Calcule expressões algébricas')
			.addStringOption(option => option
				.setName('expression')
				.setDescription('Expressão algébrica básica para cálculo')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('clima')
			.setDescription('Obtenha informações climáticas sobre determinada localização')
		.addStringOption(option => option
			.setName('local')
			.setDescription('Localização para obter informações climáticas')
			.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('unbinary')
			.setDescription('Decodifique um código binário')
			.addStringOption(option => option
				.setName('code')
				.setDescription('Código binário')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('morse')
			.setDescription('Codifique um texto para código morse')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto a ser codificado')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('cep')
			.setDescription('Obtenha informações sobre determinado CEP')
			.addStringOption(option => option
				.setName('cep')
				.setDescription('CEP para buscar informações')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('letra')
			.setDescription('Obtenha a letra de uma música')
			.addStringOption(option => option
				.setName('music')
				.setDescription('Nome da música e autor')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('decodeuri')
			.setDescription('Decodifique uma URI')
			.addStringOption(option => option
				.setName('uri')
				.setDescription('URI a ser decodificada')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('token')
			.setDescription('Gere senhas aleatórias para serem usadas em qualquer plataforma')
			.addStringOption(option => option
				.setName('tipo')
				.setDescription('Tipo de senha')
				.setRequired(true)
				.addChoice('Alphanumeric (letras e números)', 'an')
				.addChoice('Letters (apenas letras)', 'let')
				.addChoice('Numbers (apenas números)', 'num')
				.addChoice('All (tudo + caracteres especiais)', 'all'))),
	new SlashCommandBuilder()
		.setName('eco')
		.setDescription('Faça pagamentos, compras, e movimente seu dinheiro')
		.addSubcommand(subcommand => subcommand
			.setName('daily')
			.setDescription('Pegue seu saldo diário'))
		.addSubcommand(subcommand =>subcommand
			.setName('perfil')
			.setDescription('Veja um perfil de usuário')
			.addUserOption(option => option
				.setName('user')
				.setDescription('Perfil que irei exibir')
				.setRequired(false)))
		.addSubcommand(subcommand =>subcommand
			.setName('work')
			.setDescription('Trabalhe diariamente e ganhe dinheiro'))
		.addSubcommand(subcommand =>subcommand
			.setName('pay')
			.setDescription('Transfira dinheiro na conta Aaron')
		.addIntegerOption(option => option
				.setName('money')
				.setDescription('Quantidade de dinheiro a transferir')
				.setRequired(true))
		.addUserOption(option => option
				.setName('user')
				.setDescription('Transfira dinheiro para alguém na conta Aaron')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('carros')
			.setDescription('Compre carros na loja Aaron')
		.addStringOption(option => option
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
			.addChoice('Carro Lamborghini Aventador Branca (R$ 101.000)', 'lamborghini')))
		.addSubcommand(subcommand =>subcommand
			.setName('objetos')
			.setDescription('Compre objetos na loja Aaron')
			.addStringOption(option => option
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
				.addChoice('Drone AirLink (R$ 1.000)', 'drone')))
		.addSubcommand(subcommand =>subcommand
			.setName('especialidade')
			.setDescription('Escolha sua especialidade neste servidor')
			.addStringOption(option => option
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
				.addChoice('🇺🇸 Idiomas', 'idiomas')))
		.addSubcommand(subcommand =>subcommand
			.setName('profissao')
			.setDescription('Escolha sua profissão neste servidor')
			.addStringOption(option => option
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
				.addChoice('🏞️ Artista', 'artista')))
		.addSubcommand(subcommand =>subcommand
			.setName('papel')
			.setDescription('Escolha o papel de parede do comando perfil')
			.addStringOption(option => option
				.setName('papel')
				.setDescription('Escolha o papel de parede a ser exibido no comando perfil')
				.setRequired(false)
				.addChoice('Clássico', 'classico')
				.addChoice('Céu', 'ceu')
				.addChoice('Universo', 'universo')
				.addChoice('Madeira', 'madeira')
				.addChoice('Esverdeado', 'esverdeado')))
		.addSubcommand(subcommand =>subcommand
			.setName('level')
			.setDescription('Consulte o level de um usuário')
			.addUserOption(option => option
				.setName('user')
				.setDescription('Usuário para exibir o nível e xp')
				.setRequired(true)))
		.addSubcommand(subcommand =>subcommand
			.setName('ranking')
			.setDescription('Veja os rankings de saldo')
			.addStringOption(option => option
				.setName('type')
				.setDescription('Tipo de ranking')
				.setRequired(true)
				.addChoice('Global', 'global')
				.addChoice('Local', 'local')))
		.addSubcommand(subcommand =>subcommand
			.setName('levels')
			.setDescription('Saiba a relação level-xp'))
		.addSubcommand(subcommand => subcommand
			.setName('saldo')
			.setDescription('Exibe o saldo da conta Aaron de um usuário')
			.addUserOption(option => option
				.setName('user')
				.setDescription('Usuário para exibir o saldo')
				.setRequired(false))),
	new SlashCommandBuilder()
		.setName('fun')
		.setDescription('Se divirta usando os comandos de diversão!')
		.addSubcommand(subcommand => subcommand
			.setName('dado')
			.setDescription('Jogue o dado!')
			.addIntegerOption(option => option
				.setName('number')
				.setDescription('Número para jogar o dado')
				.setRequired(false)))
		.addSubcommand(subcommand => subcommand
			.setName('stonks')
			.setDescription('Gere um meme stonks')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto para gerar o meme')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('notstonks')
			.setDescription('Gere um meme not stonks')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto para gerar o meme')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('bigtxt')
			.setDescription('Converta letras em emojis deixando-as grandes')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto para converter')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('font')
			.setDescription('Altere a fonte de um texto')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto para alterar')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('laranjo')
			.setDescription('Gere um meme do laranjo')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Texto para gerar o meme')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('joken')
			.setDescription('Jogue cara ou coroa com o Aaron')
			.addStringOption(option => option
				.setName('mode')
				.setDescription('Escolha: cara ou coroa?')
				.setRequired(true)
				.addChoice('cara', 'cara')
				.addChoice('coroa', 'coroa')))
		.addSubcommand(subcommand => subcommand
			.setName('chok')
			.setDescription('Faça uma montagem tiggered')
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para fazer a montagem')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('invert')
			.setDescription('Inverta a imagem de perfil de um usuário')
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para inverter foto de perfil')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('pb')
			.setDescription('Edição da foto de perfil de um usuário em escala de cinza')
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para editar a foto de perfil para escala de cinza')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('sepia')
			.setDescription('Aplique o efeito de sépia na imagem de perfil de um usuário')
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para aplicar efeito de sépia')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('pflip')
			.setDescription('Jogue "pedra, papel, tesoura" com o Aaron')
			.addStringOption(option => option
				.setName('mode')
				.setDescription('Escolha: pedra, papel ou tesoura?')
				.setRequired(true)
				.addChoice('pedra', 'pedra')
				.addChoice('papel', 'papel')
				.addChoice('tesoura', 'tesoura'))),
	new SlashCommandBuilder()
		.setName('geral')
		.setDescription('Comandos gerais do Aaron')
		.addSubcommand(subcommand => subcommand
			.setName('botinfo')
			.setDescription('Veja minhas informações técnicas'))
		.addSubcommand(subcommand => subcommand
			.setName('convite')
			.setDescription('Entre no meu servidor oficial ou me adicione no seu servidor'))
		.addSubcommand(subcommand => subcommand
			.setName('donate')
			.setDescription('Saiba como doar e me ajudar'))
		.addSubcommand(subcommand => subcommand
			.setName('feedback')
			.setDescription('Envie um feedback para minha equipe')
			.addStringOption(option => option
				.setName('text')
				.setDescription('Escreva seu feedback')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('servericon')
			.setDescription('Veja o ícone do servidor'))
		.addSubcommand(subcommand => subcommand
			.setName('serverinfo')
			.setDescription('Veja informações básicas sobre o servidor'))
		.addSubcommand(subcommand => subcommand
			.setName('userinfo')
			.setDescription('Veja informações básicas sobre um usuário')	.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para exibir informações')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('vote')
			.setDescription('Saiba como votar, me ajudar e ainda ganhar recompensa'))
		.addSubcommand(subcommand => subcommand
			.setName('deleteaaron')
			.setDescription('Delete todas as suas informações em meu sistema'))
		.addSubcommand(subcommand => subcommand
			.setName('news')
			.setDescription('Saiba como funciona meu sistema de notícias'))
		.addSubcommand(subcommand => subcommand
			.setName('ticket')
			.setDescription('Abra um ticket de suporte no servidor'))
		.addSubcommand(subcommand => subcommand
			.setName('youtubetogether')
			.setDescription('Obtenha um link para Youtube em call do Discord, o YouTube Together'))
		.addSubcommand(subcommand => subcommand
			.setName('sugestao')
			.setDescription('Envie uma sugestão ou um feedback para a administração do servidor')
			.addStringOption(option => 
				option.setName('suggestion')
				.setDescription('Descreva brevemente sua sugestão')
				.setRequired(true))),
	new SlashCommandBuilder()
		.setName('gerency')
		.setDescription('Gerência do servidor')
		.addSubcommand(subcommand => subcommand
			.setName('banlist')
			.setDescription('Veja a lista de usuários banidos no servidor'))
		.addSubcommand(subcommand => subcommand
			.setName('createchannel')
			.setDescription('Crie um canal no servidor')
			.addStringOption(option => 
				option.setName('name')
				.setDescription('Nome do canal')
				.setRequired(true))
			.addStringOption(option => 
				option.setName('type')
				.setDescription('Tipo do canal')
				.setRequired(true)
				.addChoice('texto', 'text')
				.addChoice('voz', 'voice')))
		.addSubcommand(subcommand => subcommand
			.setName('deletechannel')
			.setDescription('Delete um canal no servidor')
			.addChannelOption(option => 
				option.setName('channel')
				.setDescription('Canal a ser deletado')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('slowmode')
			.setDescription('Aplique o Modo Lento no canal')
			.addStringOption(option => 
				option.setName('tempo')
				.setDescription('Intervalo do Modo Lento (ex: 2s)')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('poll')
			.setDescription('Faça uma votação no servidor')
			.addChannelOption(option => 
				option.setName('channel')
				.setDescription('Canal para enviar a votação')
				.setRequired(true))
			.addStringOption(option => 
				option.setName('text')
				.setDescription('Texto da votação')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('nick')
			.setDescription('Altere o nickname de um usuário no servidor')
			.addUserOption(option => 
				option.setName('user')
				.setDescription('Usuário para alterar o nickname')
				.setRequired(true))
			.addStringOption(option => 
				option.setName('new')
				.setDescription('Novo nickname para o usuário')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('log')
			.setDescription('Envie um log de atualização para um canal no servidor')
			.addStringOption(option => 
				option.setName('type')
				.setDescription('Tipo de atualização')
				.setRequired(true)
				.addChoice('improvement, adição', 'add')
				.addChoice('removal, exclusão', 'del')
				.addChoice('neutral, neutro', 'none'))
			.addStringOption(option => 
				option.setName('text')
				.setDescription('Texto da atualização')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('ticketrole')
			.setDescription('Configure um cargo para ser mencionado quando um ticket for aberto')
			.addRoleOption(option => 
				option.setName('role')
				.setDescription('Cargo para ser mencionado na abertura de tickets')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('ticket')
			.setDescription('Opte por ativar ou desativar o sistema de tickets')
			.addStringOption(option => 
				option.setName('action')
				.setDescription('Cargo para ser mencionado na abertura de tickets')
				.setRequired(true)
				.addChoice('on (enable)', 'on')
				.addChoice('off (disable)', 'off')))
		.addSubcommand(subcommand => subcommand
			.setName('suggestionschannel')
			.setDescription('Selecione um canal para serem enviadas sugestões pelo comando /sugestao')
			.addChannelOption(option => 
				option.setName('channel')
				.setDescription('Canal para sugestões serem enviadas')
				.setRequired(true))),
	new SlashCommandBuilder()
		.setName('music')
		.setDescription('Execute músicas e outros vídeos em áudio')
		.addSubcommand(subcommand => subcommand
			.setName('play')
			.setDescription('Execute músicas ou vídeos (áudio)')
			.addStringOption(option => 
				option.setName('music')
				.setDescription('Insira o link do vídeo ou o nome para ser executado')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('disconnect')
			.setDescription('Me desconecte do canal de voz'))
];

const commands = cmds.map(command => command.toJSON());

/*const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();*/

client.on('interactionCreate', async (interaction) => {
system.findOne({_id:client.user.id}, (err, dev) => {
	economia.findOne({_id: interaction.member.user.id}, (err, res) => {
	if(dev.users.includes(interaction.member.user.id)) return interaction.reply('Infelizmente, você foi banido e não pode usar meus comandos :confused: | Se achar que isso é um erro, contate-me em https://abre.ai/aaronbotsite');

	const lv = res.level || 0;
	const xp = res.xp || 0;

	if(interaction.type !== 'APPLICATION_COMMAND'){
    console.log('Button');
    /*let int = interaction.data.values ? db.set(`iloja${interaction.member.user.id}`, interaction.data.values[0]) : false;
    setTimeout(() => {
      db.delete(`iloja${interaction.member.user.id}`);
    }, 1000);*/
  }else{
		try{

		if(res) {

			if((lv * 200) <= xp) {
				res.level+=1
			}

				res.xp=+1;
      			dev.globalcommands+=1;

				res.save();
		} else {
			new economia({
				_id: interaction.member.user.id,
				xp: 1
			}).save();
		}
		
		if(dev) { dev.save() } else new system({
			_id: client.user.id,
			globalcommands: 1
		}).save();

    	const commandId = interaction.id;
    	const commandName = interaction.commandName;

    	await require(`./commands/${commandName}.js`).int(client, interaction).catch(console.error);
		}catch(e){console.log(e);};
  };
		});
	});
});

client.once('ready', () => {
	console.log('Ready!');
	console.log('bot is online');

  let activities = [
		'ATENÇÃO: ESTOU FUNCIONANDO APENAS EM SLASH COMMANDS! USE /help PARA SABER MAIS.'
	];
  
  let i = 0;
  
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {
    type: "WATCHING"
  }), 6e4);

  client.user.setStatus("online");
});

client.login(token);
