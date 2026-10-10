import { GoogleGenAI } from '@google/genai';

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function handleAiCoach(body: {
  message: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
  style?: 'gentle' | 'balanced' | 'firm';
}) {
  const ai = getAiClient();
  const styleInstruction = 
    body.style === 'firm' 
      ? 'আপনার বাচনভঙ্গি হবে দৃঢ় ও সংকল্পবদ্ধ, লক্ষ্য অর্জনে সোচ্চার কিন্তু শ্রদ্ধাশীল।'
      : body.style === 'gentle'
      ? 'আপনার বাচনভঙ্গি হবে অত্যন্ত কোমল, সান্ত্বনাসূচক ও স্নেহময়।'
      : 'আপনার বাচনভঙ্গি হবে ভারসাম্যপূর্ণ, আন্তরিক ও অনুপ্রেরণাদায়ক।';

  const systemInstruction = `You are the Tazkir Smart Islamic Coach (তাজকির স্মার্ট ইসলামিক এআই কোচ).
Your purpose is to provide authentic, respectful, supportive spiritual companionship, daily motivation, habit building (Fajr wake-up, 5 daily prayers, Quran recitation, morning/evening adhkar, digital wellbeing, reducing social media screen time).

Language: Primarily Bengali (বাংলা), unless the user addresses you in English.
Style guideline: ${styleInstruction}

Strict Islamic content integrity:
- Quote authentic Quran and Sahih Hadith accurately with references where applicable (e.g., সূরা আল-বাকারা, সহিহ বুখারী).
- Clearly distinguish between divine scripture and personal self-discipline guidance.
- Do NOT issue legal fatwas or rulings on disputed matters; advise consulting knowledgeable local scholars.
- Emphasize Tazkir's core motto: "স্মরণে শান্তি, জীবনে বরকত" (Peace in remembrance, blessing in life).`;

  const contents: any[] = [];
  if (body.history && Array.isArray(body.history)) {
    for (const h of body.history.slice(-8)) {
      contents.push({
        role: h.role,
        parts: [{ text: h.text }],
      });
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: body.message }],
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
    },
  });

  return {
    reply: response.text || 'আল্লাহর স্মরণে অন্তর প্রশান্ত হোক। কোনো নির্দেশনা দিতে পারলে জানাবেন।',
  };
}

export async function handleGenerateImage(body: {
  prompt: string;
  imageSize?: '1K' | '2K' | '4K';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}) {
  const ai = getAiClient();
  const prompt = body.prompt;
  const imageSize = body.imageSize || '1K';
  const aspectRatio = body.aspectRatio || '1:1';

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `${prompt}. High resolution Islamic art, serene atmosphere, intricate details, elegant aesthetics.`,
        },
      ],
    },
    config: {
      imageConfig: {
        imageSize,
        aspectRatio,
      },
    },
  });

  let imageUrl: string | null = null;
  let mimeType = 'image/png';
  let textExplanation = '';

  const candidates = response.candidates;
  if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textExplanation += part.text;
      }
    }
  }

  if (!imageUrl) {
    throw new Error('Image could not be generated. ' + (textExplanation || 'No image data returned.'));
  }

  return {
    imageUrl,
    imageSize,
    aspectRatio,
    mimeType,
    text: textExplanation,
  };
}
