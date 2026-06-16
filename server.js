const express = require('express');
const cors = require('cors');
const { default: Anthropic } = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/chat', async (req, res) => {
  const { systemPrompt, messages } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.slice(-20),
    });
    const reply = response.content[0].text;
    res.json({ reply });
  } catch (err) {
    console.error('Erreur:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Lumi Backend en ligne ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌟 Lumi Backend démarré sur le port ${PORT}`);
  console.log(`🔑 API Key présente: ${!!process.env.ANTHROPIC_API_KEY}`);
  console.log(`🔑 Début de la clé: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) : 'NON DÉFINIE'}`);
});
