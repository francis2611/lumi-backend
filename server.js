const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk').default ?? require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { systemPrompt, messages } = req.body;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('Clé au moment de la requête:', apiKey ? apiKey.substring(0, 15) + '...' : 'VIDE');
    const client = new Anthropic({ apiKey });
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
