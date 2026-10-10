import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleAiCoach, handleGenerateImage } from './src/server/api.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Coach endpoint
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, history, style } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const result = await handleAiCoach({ message, history, style });
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/coach:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI coach response',
    });
  }
});

// High quality image generation endpoint (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await handleGenerateImage({ prompt, imageSize, aspectRatio });
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/generate-image:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate image',
    });
  }
});

// Serve frontend in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const isDirectRun =
  process.env.STANDALONE_SERVER === 'true' ||
  (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js')));

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Tazkir server listening on port ${PORT}`);
  });
}

export { app };
