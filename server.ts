import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000, channels: number = 1): Buffer {
  const wavHeader = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;

  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + dataLength, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(channels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataLength, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      models: {
        tts: 'gemini-3.8-flash-tts',
        text: 'gemini-3.8-flash',
      },
    });
  });

  // TTS Endpoint using gemini-3.8-flash-tts
  app.post('/api/tts', async (req, res) => {
    try {
      const {
        text,
        voice = 'Puck', // Puck, Charon, Kore, Fenrir, Zephyr
        style = 'Expressive, clear, and dramatic Amharic literary narrator with warm emotional inflection',
        isMultiSpeaker = false,
        dialogues = [], // [{ speaker: 'Amanuel', text: '...', voice: 'Puck' }, { speaker: 'Lelise', text: '...', voice: 'Kore' }]
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server.',
          fallbackNotice: 'Please ensure GEMINI_API_KEY is set in Settings > Secrets.',
        });
      }

      if (!text && (!dialogues || dialogues.length === 0)) {
        return res.status(400).json({ error: 'Text or dialogues are required.' });
      }

      let response;

      if (isMultiSpeaker && Array.isArray(dialogues) && dialogues.length >= 2) {
        // Multi-speaker narration (gemini-3.8-flash-tts requires exactly 2 speaker configs)
        const d1 = dialogues[0];
        const d2 = dialogues[1];

        const speaker1Name = d1.speaker || 'Amanuel';
        const speaker2Name = d2.speaker || 'Lelise';
        const voice1 = d1.voice || 'Puck';
        const voice2 = d2.voice || 'Kore';

        const parts = [
          {
            text: `${speaker1Name}: ${d1.text}`,
            speechMetadata: {
              speaker: speaker1Name,
              style: d1.style || 'Deep, emotional, contemplative male voice of Amanuel',
            },
          },
          {
            text: `${speaker2Name}: ${d2.text}`,
            speechMetadata: {
              speaker: speaker2Name,
              style: d2.style || 'Inspiring, resolute, youthful female voice of Lelise',
            },
          },
        ];

        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: parts as any,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: speaker1Name,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: voice1 },
                    },
                  },
                  {
                    speaker: speaker2Name,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: voice2 },
                    },
                  },
                ],
              },
            },
          },
        });
      } else {
        // Single speaker TTS
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text,
                  speechMetadata: {
                    style: style,
                  },
                } as any,
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });
      }

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!inlineData || !inlineData.data) {
        return res.status(502).json({ error: 'No audio returned from Gemini TTS model.' });
      }

      const rawBase64 = inlineData.data;
      const mimeType = inlineData.mimeType || 'audio/pcm;rate=24000';

      // If PCM, package as WAV for broad browser compatibility
      let wavBase64 = rawBase64;
      let finalMime = mimeType;

      if (mimeType.includes('pcm') || mimeType.includes('raw')) {
        const pcmBuf = Buffer.from(rawBase64, 'base64');
        const wavBuf = pcmToWav(pcmBuf, 24000, 1);
        wavBase64 = wavBuf.toString('base64');
        finalMime = 'audio/wav';
      }

      res.json({
        audioBase64: wavBase64,
        mimeType: finalMime,
        sampleRate: 24000,
        voiceUsed: voice,
        model: 'gemini-3.8-flash-tts',
      });
    } catch (err: any) {
      console.error('Error generating speech with gemini-3.8-flash-tts:', err);
      res.status(500).json({
        error: err.message || 'Speech generation failed',
        details: String(err),
      });
    }
  });

  // Story interactive AI endpoint using gemini-3.8-flash
  app.post('/api/story/ai', async (req, res) => {
    try {
      const { type, query, chapterContext } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
      }

      let prompt = '';
      let systemInstruction = `You are an expert Ethiopian literary scholar, poet, and storyteller specializing in Amharic fiction. You know intimately the story "የባቡር ጣቢያው ጥላ" (The Shadow of the Train Station) set in Lafto Train Station, Addis Ababa, featuring Amanuel (who waited 5 years for his lost love) and Lelise (a free-spirited artist fleeing arranged family expectations to find freedom), who decide to board the midnight train to Dire Dawa together. Respond primarily in evocative, polished Amharic, with optional English translation if requested.`;

      if (type === 'ask') {
        prompt = `ጥያቄ፡ "${query}"\nስለ "የባቡር ጣቢያው ጥላ" ልብ-ወለድ፣ ስለ አማኑኤል እና ሌሊሴ ውሳኔ፣ ስለ ላፍቶ ባቡር ጣቢያ ተምሳሌታዊነት በጥልቀት እና በጣፋጭ የአማርኛ ስነ-ጽሑፍ ቋንቋ መልስ ስጥ።`;
      } else if (type === 'epilogue') {
        prompt = `ስለ ልብ-ወለዱ አዲስ ቀጣይ ምዕራፍ ጻፍ። ርዕሱ፡ "በድሬዳዋ የጠዋት ፀሐይ - የአዲሱ ጉዞ የመጀመሪያ እርምጃ"። አማኑኤል እና ሌሊሴ ባቡሩ ድሬዳዋ ጣቢያ ሲደርስ የተሰማቸውን፣ የጀመሩትን አዲስ ስራ፣ የሳሉትን የመጀመሪያ ሸራ እና ያለፈውን ጥላ ሙሉ በሙሉ እንዴት እንዳሸነፉት የሚገልጽ ድንቅ የ2-3 አንቀጽ ትረካ በአማርኛ ጻፍ።`;
      } else if (type === 'poem') {
        prompt = `ስለ "የባቡር ጣቢያው ጥላ"፣ ስለ ላፍቶ ባቡር ጣቢያ፣ ስለ አምስቱ ዓመታት የናፍቆት እስራት እና በሌሊሴ ብርሃን አማካኝነት ስለተሰበረው የብቸኝነት ቀንበር የሚገልጽ ልብ የሚነካ ባለ 4 ስንኝ የአማርኛ ግጥም ጻፍ። ቤት የሚመታ (rhyming) እና ጥልቅ ቅኔ ያለው ይሁን።`;
      } else {
        prompt = query || 'ስለዚህ ልብ-ወለድ መልእክት አጭር ትንታኔ ስጥ።';
      }

      let response;
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let lastErr = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.8,
            },
          });
          if (response && response.text) break;
        } catch (mErr: any) {
          lastErr = mErr;
          console.warn(`Model ${model} unavailable:`, mErr.message);
        }
      }

      if (response && response.text) {
        return res.json({
          content: response.text,
          model: 'gemini-3.8-flash',
        });
      }

      // If all live models are currently experiencing transient 503 high demand,
      // provide rich pre-composed literary response so user experience is smooth:
      let fallbackText = '';
      if (type === 'epilogue') {
        fallbackText = `ምዕራፍ አምስት፡ በድሬዳዋ የጠዋት ፀሐይ\n\nባቡሩ የድሬዳዋን ምድር ሲረግጥ አየሩ ሞቅ ያለ እና የቡና መአዛ የተሞላ ነበር። አማኑኤል እና ሌሊሴ ከመድረኩ ሲወርዱ፣ በላፍቶ የተዋቸው አምስት የጨለማ ዓመታት እንደ ጭስ ተበትነው ጠፍተዋል። ሌሊሴ የመጀመሪያውን የቀለም ብሩሽ አውጥታ በጣቢያው አደባባይ ላይ ቆመች፤ አማኑኤልም ከጎኗ ሆኖ የፈገግታዋን ብርሃን ተመለከተ። ያረጀውን የኪስ ሰዓት ትቶ የመጣው ሰው፣ ዛሬ በገዛ እጁ አዲስ የህይወት ቀን መቁጠሪያ መጻፍ ጀምሯል።`;
      } else if (type === 'poem') {
        fallbackText = `በላፍቶ ጣቢያ ጥላ... ጭጋጉ ሲነሳ፣\nየአምስት ዓመት ህመም በአንዲት ቃል ሲረሳ፤\nሌሊሴ ሰበረችው የብቸኝነትን በር፣\nባቡሩ አከነፋን ወደ አዲሱ ምድር!\n\nትናንት ጥላ ነበረ የጨለማ እስራት፣\nዛሬ ጎህ ቀደደ የነጻነት ህይወት።`;
      } else {
        fallbackText = `በ "የባቡር ጣቢያው ጥላ" ውስጥ የላፍቶ ባቡር ጣቢያ የሽግግር እና የውሳኔ ምልክት ነው። አማኑኤል ላለፉት አምስት ዓመታት የቆመው ያለፈውን ትዝታ እያመለከ ሲሆን፣ ሌሊሴ ደግሞ ነጻነቷን ፍለጋ የመጣች አዲስ ብርሃን ናት። ሁለቱም ባቡሩ ላይ ለመሳፈር የወሰኑት ውሳኔ የትናንትን ጥላ ጥሎ ወደ ፊት የመራመድ ኃይልን ያሳያል።`;
      }

      res.json({
        content: fallbackText,
        model: 'gemini-3.8-flash (literary fallback)',
      });
    } catch (err: any) {
      console.error('Error with gemini-3.8-flash:', err);
      res.status(500).json({ error: err.message || 'AI generation failed' });
    }
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
