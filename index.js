require("dotenv").config();
const token = process.env.TOKEN;
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🗂️ Store chat history per user
const conversationHistory = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const userId = message.author.id;

    // Get user history or start new
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);

    // Add user message
    history.push({ role: "user", parts: [{ text: message.content }] });

    // Send the full history to Gemini
    const result = await model.generateContent({
      contents: history,
    });

    const response = result.response.text();

    // Save Gemini’s reply into history
    history.push({ role: "model", parts: [{ text: response }] });

    // Limit history size (avoid memory bloat)
    if (history.length > 20) {
      history.shift(); // remove oldest
    }

    await message.reply(response);
  } catch (err) {
    console.error("Error generating response:", err);
    await message.reply("⚠️ Sorry, I couldn't process that.");
  }
});

client.login(token);
