require("dotenv").config();
const token = process.env.TOKEN;
const  { Client, GatewayIntentBits } =require('discord.js');
const client = new Client({
     intents: [GatewayIntentBits.Guilds,
               GatewayIntentBits.GuildMessages,
             GatewayIntentBits.MessageContent] 
    });


client.on('messageCreate',message =>{
    if(message.author.bot) return;
    message.reply({
        content:"Hi from Bot",
    })
})



client.login(token);