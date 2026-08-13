import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

/* global process */

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: false }));

const getFirstNonEmpty = (keys = []) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return '';
};

const getOpenRouterApiKey = () =>
  getFirstNonEmpty([
    'OPENROUTER_API_KEY',
    'OPEN_ROUTER_API_KEY',
    'OPENROUTER_KEY',
    'VITE_OPENROUTER_API_KEY',
  ]);

const getGeminiApiKey = () => getFirstNonEmpty(['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY']);
const getGroqApiKey = () => getFirstNonEmpty(['GROQ_API_KEY', 'VITE_GROQ_API_KEY']);
const looksLikeOpenRouterKey = (value = '') => /^sk-or-v1-/i.test(value.trim());
const looksLikeGroqKey = (value = '') => /^gsk_/i.test(value.trim());

const normalizeProvider = (value = '') => {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'openrouter' || normalized === 'gemini' || normalized === 'groq') {
    return normalized;
  }
  return '';
};

const getProviderConfig = () => {
  const forcedProvider = normalizeProvider(process.env.AI_PROVIDER || '');
  const openRouterApiKey = getOpenRouterApiKey();
  const geminiApiKey = getGeminiApiKey();
  const groqApiKey = getGroqApiKey();

  if (forcedProvider === 'gemini') {
    return { provider: 'gemini', apiKey: geminiApiKey };
  }

  if (forcedProvider === 'groq') {
    return { provider: 'groq', apiKey: groqApiKey };
  }

  if (forcedProvider === 'openrouter') {
    return { provider: 'openrouter', apiKey: openRouterApiKey };
  }

  if (!openRouterApiKey && looksLikeOpenRouterKey(groqApiKey)) {
    return { provider: 'openrouter', apiKey: groqApiKey };
  }

  if (!groqApiKey && looksLikeGroqKey(openRouterApiKey)) {
    return { provider: 'groq', apiKey: openRouterApiKey };
  }

  // Prefer local GROQ/GEMINI keys before OpenRouter to avoid stale global OPENROUTER_API_KEY values.
  if (groqApiKey) {
    return {
      provider: 'groq',
      apiKey: groqApiKey,
    };
  }

  if (geminiApiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiApiKey,
    };
  }

  if (openRouterApiKey) {
    return {
      provider: 'openrouter',
      apiKey: openRouterApiKey,
    };
  }

  return {
    provider: 'none',
    apiKey: '',
  };
};

const escapeXml = (value = '') =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const parseDataUrl = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    data: match[2],
  };
};

const getGeminiText = (response) => {
  if (typeof response?.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const text = parts
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
    if (text) return text;
  }

  return '';
};

const getAssistantReply = async (message, options = {}) => {
  const normalized = (message || '').trim();
  if (!normalized) {
    throw new Error('Message is required.');
  }

  const { provider, apiKey } = getProviderConfig();
  if (!apiKey) {
    throw new Error('Missing AI API key. Set OPENROUTER_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY in .env.');
  }

  if (provider === 'groq' && looksLikeOpenRouterKey(apiKey)) {
    throw new Error('GROQ_API_KEY appears to be an OpenRouter key. Move it to OPENROUTER_API_KEY or set AI_PROVIDER=openrouter.');
  }

  if (provider === 'openrouter' && looksLikeGroqKey(apiKey)) {
    throw new Error('OPENROUTER_API_KEY appears to be a Groq key. Move it to GROQ_API_KEY or set AI_PROVIDER=groq.');
  }

  if (provider === 'gemini') {
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt =
      'You are NariShakti Assistant. Reply in simple, respectful Hinglish or Hindi/English based on user language. Keep answers practical and concise for women-focused support topics.';

    const result = await ai.models.generateContent({
      model,
      contents: `${systemPrompt}\n\nUser: ${normalized}`,
    });

    const text = getGeminiText(result);
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return text;
  }

  if (provider === 'groq') {
    const model = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile';
    const temperature = Number.isFinite(options.temperature) ? options.temperature : 0.5;
    const maxTokens = Number(options.maxTokens) > 0 ? Number(options.maxTokens) : 250;
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content:
            'You are NariShakti Assistant. Reply in simple, respectful Hinglish or Hindi/English based on user language. Keep answers practical and concise for women-focused support topics.',
        },
        { role: 'user', content: normalized },
      ],
    });

    return (
      completion?.choices?.[0]?.message?.content?.trim() ||
      'Maaf kijiye, abhi jawab generate nahi ho paaya. Kripya dobara try karein.'
    );
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || 'openrouter/auto';
  const temperature = Number.isFinite(options.temperature) ? options.temperature : 0.5;
  const maxTokens = Number(options.maxTokens) > 0 ? Number(options.maxTokens) : 250;
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 25000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'NariShakti Assistant',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'system',
            content:
              'You are NariShakti Assistant. Reply in simple, respectful Hinglish or Hindi/English based on user language. Keep answers practical and concise for women-focused support topics.',
          },
          { role: 'user', content: normalized },
        ],
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: { message: raw } };
    }
  }

  if (!response.ok) {
    const providerError = data?.error?.message || data?.error || 'OpenRouter request failed.';
    throw new Error(`OpenRouter error: ${providerError}`);
  }

  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    'Maaf kijiye, abhi jawab generate nahi ho paaya. Kripya dobara try karein.'
  );
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const reply = await getAssistantReply(message);

    return res.json({ reply });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'AI request timed out. Please try again.' });
    }
    const detail = error?.message || String(error);
    console.error('AI chat error:', detail);
    return res.status(500).json({ error: `Failed to get AI response: ${detail}` });
  }
});

app.post('/api/ocr-image', async (req, res) => {
  const { provider, apiKey } = getProviderConfig();
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'Missing AI API key. Set OPENROUTER_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY in .env.' });
  }

  try {
    const { imageDataUrl, outputLanguage } = req.body || {};
    if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'imageDataUrl must be a valid image data URL.' });
    }

    if (provider === 'groq') {
      return res.status(400).json({
        error: 'OCR image extraction is not supported with GROQ_API_KEY. Use OPENROUTER_API_KEY or GEMINI_API_KEY for OCR.',
      });
    }

    if (provider === 'gemini') {
      const parsed = parseDataUrl(imageDataUrl);
      if (!parsed) {
        return res.status(400).json({ error: 'imageDataUrl must be a valid base64 image data URL.' });
      }

      const visionModel = process.env.GEMINI_VISION_MODEL?.trim() || process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
      const ai = new GoogleGenAI({ apiKey });
      const prompt =
        outputLanguage === 'hindi'
          ? 'Extract text from this document image. Keep Hindi/English as written. Return plain text only with line breaks.'
          : 'Extract text from this document image. Return plain text only with line breaks.';

      const result = await ai.models.generateContent({
        model: visionModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: parsed.mimeType,
                  data: parsed.data,
                },
              },
            ],
          },
        ],
      });

      const text = getGeminiText(result);
      if (!text) {
        return res.status(422).json({ error: 'No text could be extracted from image.' });
      }

      return res.json({ text });
    }

    const visionModel = process.env.OPENROUTER_VISION_MODEL?.trim() || 'google/gemini-2.0-flash-001';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    let response;
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'NariShakti OCR',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: visionModel,
          temperature: 0,
          max_tokens: 1800,
          messages: [
            {
              role: 'system',
              content:
                'You are an OCR engine. Extract text from the image accurately. Return ONLY plain text exactly as read. Preserve line breaks. Do not explain.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text:
                    outputLanguage === 'hindi'
                      ? 'Extract text from this document image. Keep Hindi/English as written. Return plain text only.'
                      : 'Extract text from this document image. Return plain text only.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageDataUrl,
                  },
                },
              ],
            },
          ],
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    const raw = await response.text();
    let data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = { error: { message: raw } };
      }
    }

    if (!response.ok) {
      const providerError = data?.error?.message || data?.error || 'Vision OCR request failed.';
      return res.status(500).json({ error: `Vision OCR failed: ${providerError}` });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!text) {
      return res.status(422).json({ error: 'No text could be extracted from image.' });
    }

    return res.json({ text });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Vision OCR timed out. Please try with a smaller/clearer image.' });
    }
    const detail = error?.message || String(error);
    console.error('Vision OCR error:', detail);
    return res.status(500).json({ error: `Vision OCR failed: ${detail}` });
  }
});

app.get('/api/whatsapp/status', (_req, res) => {
  const providerConfig = getProviderConfig();
  const whatsappNumber = (process.env.TWILIO_WHATSAPP_NUMBER || '').trim();
  const sandboxJoinCode = (process.env.TWILIO_SANDBOX_JOIN_CODE || '').trim();
  const baseUrl = (process.env.PUBLIC_BASE_URL || '').trim();
  const webhookUrl = baseUrl ? `${baseUrl}/api/whatsapp/webhook` : '';

  return res.json({
    configured: Boolean(providerConfig.apiKey && whatsappNumber),
    hasApiKey: Boolean(providerConfig.apiKey),
    provider: providerConfig.provider,
    hasWhatsappNumber: Boolean(whatsappNumber),
    hasJoinCode: Boolean(sandboxJoinCode),
    webhookUrl,
    whatsappNumber,
    sandboxJoinCode,
  });
});

app.get('/api/provider-status', (_req, res) => {
  const { provider, apiKey } = getProviderConfig();
  return res.json({
    hasApiKey: Boolean(apiKey),
    provider,
    configured: provider !== 'none' && Boolean(apiKey),
  });
});

app.post('/api/whatsapp/test', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const reply = await getAssistantReply(message);
    return res.json({ reply });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'AI request timed out. Please try again.' });
    }
    const detail = error?.message || String(error);
    console.error('WhatsApp test error:', detail);
    return res.status(500).json({ error: `WhatsApp test failed: ${detail}` });
  }
});

app.post('/api/whatsapp/webhook', async (req, res) => {
  res.set('Content-Type', 'text/xml');

  try {
    const incoming = String(req.body?.Body || '').trim();
    const fallbackPrompt = 'Namaste! Aap apna sawaal bhejiye, main madad karti hoon.';
    // Twilio webhook requests should complete quickly; keep generation short and fast.
    const reply = incoming
      ? await getAssistantReply(incoming, { timeoutMs: 4500, maxTokens: 140, temperature: 0.3 })
      : fallbackPrompt;

    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(reply)}</Message></Response>`);
  } catch (error) {
    const detail = error?.message || String(error);
    console.error('WhatsApp webhook error:', detail);
    const failMessage =
      'Maaf kijiye, abhi response dene me issue aa raha hai. Thodi der baad dobara try karein.';
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(failMessage)}</Message></Response>`);
  }
});

app.listen(port, () => {
  console.log(`AI backend running at http://localhost:${port}`);
});