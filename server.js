const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { systemPrompt, messages } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  console.log('Requête reçue');
  console.log('Clé présente:', !!apiKey);
  console.log('Début clé:', apiKey ? apiKey.substring(0, 15) : 'VIDE');

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY non définie sur le serveur' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.slice(-20),
      }),
    });

    const data = await response.json();
    console.log('Réponse Anthropic status:', response.status);

    if (!response.ok) {
      console.error('Erreur Anthropic:', JSON.stringify(data));
      return res.status(500).json({ error: data.error?.message || 'Erreur API' });
    }

    const reply = data.content[0].text;
    res.json({ reply });
  } catch (err) {
    console.error('Erreur fetch:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Lumi Backend en ligne ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌟 Lumi Backend démarré sur le port ${PORT}`);
  const allKeys = Object.keys(process.env).filter(k => k.includes('ANTHROP') || k.includes('API'));
  console.log('Variables env liées API:', allKeys);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 15) + '...' : 'NON DÉFINIE'}`);
});
