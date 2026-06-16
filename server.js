/**
 * 🌟 LUMI — Serveur Backend
 * Reçoit les messages du chat et appelle l'API Claude (Anthropic)
 * Déployer sur Railway.app (gratuit pour commencer)
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Mets ta clé API Claude ici ──────────────────────────────────────────────
// Obtiens-la sur : https://console.anthropic.com
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-ant-METS-TA-CLE-ICI';

// ── Route principale : reçoit un message, retourne la réponse de Lumi ────────
app.post('/chat', async (req, res) => {
  const { systemPrompt, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages manquants' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Rapide et peu coûteux
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.slice(-20), // Garde les 20 derniers messages pour le contexte
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Erreur API Anthropic:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.[0]?.text || "Je suis là pour toi 💬";
    res.json({ reply });

  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur de connexion' });
  }
});

// ── Vérification que le serveur tourne ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'Lumi Backend en ligne ✅', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌟 Lumi Backend démarré sur le port ${PORT}`);
});
