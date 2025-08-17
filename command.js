require("dotenv").config();
const token = process.env.TOKEN;
const  { REST, Routes } = require('discord.js') ;

const commands = [
  {
    name: 'create',
    description: 'create a new short URL',
  },
];

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(1406696143232172042), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}