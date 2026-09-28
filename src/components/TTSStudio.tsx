import React, { useState } from 'react';
import { Mic, Play, Pause, Loader2, Sparkles, Volume2, Download, Copy, Check, MessageSquare } from 'lucide-react';
import { requestGeminiTTS } from '../utils/audioPlayer';

interface TTSStudioProps {
  onPlayTrack: (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  }) => void;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
}

export const TTSStudio: React.FC<TTSStudioProps> = ({
  onPlayTrack,
  isPlaying,
  onTogglePlayPause,
}) => {
  const [activeMode, setActiveMode] = useState<'single' | 'dialogue'>('single');
  const [inputText, setInputText] = useState(
    'በላፍቶ ባቡር ጣቢያ ላይ የቀዘቀዘው የምሽት ጭጋግ እንደ ቀጭን ነጠላ ተዘርግቷል። የባቡሩ መምጫ ሰዓት ሲደርስ ሁለቱም ያለፉትን ትዝታዎች ወደ ጎን በመተው አብረው አዲስ ጉዞ ለመጀመር ወሰኑ።'
  );
  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [selectedStyle, setSelectedStyle] = useState('ድራማዊ ትረካ');

  // Dialogue mode states
  const [amanuelDialogue, setAmanuelDialogue] = useState(
    'አምስት ዓመታት በዚህ ጣቢያ የሞተውን ጥላ ስጠብቅ ኖርኩ፤ ዛሬ ግን ከእጅሽ ጋር አዲስ ጉዞ ጀመርኩ።'
  );
  const [leliseDialogue, setLeliseDialogue] = useState(
    'የባቡር ጣቢያ የመሸጋገሪያ በር እንጂ የመቃብር ስፍራ አይደለም አማኑኤል! ባቡሩ መጣ፤ ወደ ብርሃኑ እንግባ!'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const VOICES = [
    { id: 'Puck', name: 'አማኑኤል (Puck)', desc: 'ጥልቅ፣ አሳቢ፣ የወንድ ድምፅ', gender: 'ወንድ' },
    { id: 'Kore', name: 'ሌሊሴ (Kore)', desc: 'ብርሃናማ፣ ገላጭ፣ የሴት ድምፅ', gender: 'ሴት' },
    { id: 'Fenrir', name: 'ተራኪ (Fenrir)', desc: 'ክብደት ያለው የስነ-ጽሑፍ ትረካ ድምፅ', gender: 'ወንድ' },
    { id: 'Zephyr', name: 'ጸጥተኛ (Zephyr)', desc: 'ለስላሳ እና የሰከነ ድምፅ', gender: 'ገለልተኛ' },
    { id: 'Charon', name: 'ጥንታዊ (Charon)', desc: 'ጥልቅ ማሚቶ ያለው የድምፅ ቀለም', gender: 'ወንድ' },
  ];

  const STYLES = [
    { id: 'ድራማዊ ትረካ', prompt: 'Dramatic, vivid, emotional and deeply expressive Amharic literary reading' },
    { id: 'የናፍቆት ስሜት', prompt: 'Melancholic, slow-paced, nostalgic and deeply sincere voice filled with longing' },
    { id: 'የተረጋጋ ወግ', prompt: 'Calm, gentle, soothing bedtime story narrator voice' },
    { id: 'የነጻነት ድል', prompt: 'Triumphant, uplifting, energetic and inspiring speaking tone' },
  ];

  const PRESET_QUOTES = [
    {
      title: 'የአማኑኤል የ5 ዓመታት ናፍቆት',
      text: 'አምስት ዓመታት... በየሳምንቱ አርብ በዚህ ወንበር ላይ እቀመጣለሁ። ባቡሮቹ ይመጣሉ፣ ሰዎችን ያራግፋሉ፤ እኔ ግን የቆምኩት በጊዜ ውስጥ ሳይሆን በጠፋ ተስፋ ጥላ ስር ነው።',
      voice: 'Puck',
    },
    {
      title: 'የሌሊሴ የነጻነት ጥሪ',
      text: 'አመለጠሁ... በመጨረሻ አመለጠሁ! ቤተሰቦቼ ያሰመሩልኝን የውሸት ክብርና የጋብቻ ሰንሰለት ቆርጬ ጣልኩት። እኔ ሰዓሊ ነኝ፤ ቀለሜ ደግሞ በነጻ አየር ላይ ብቻ ነው የሚፈነዳው!',
      voice: 'Kore',
    },
    {
      title: 'የጋራ ቃል ኪዳን በባቡሩ በር ላይ',
      text: 'ትናንት ጥላ ነበረ፤ ዛሬ ግን በጋራ የምንጽፈው አዲስ መጽሐፍ ነው። ወደ ድሬዳዋ የሚከንፈው ባቡር የነጻነታችን ጎህ ነው!',
      voice: 'Fenrir',
    },
  ];

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const styleObj = STYLES.find((s) => s.id === selectedStyle);
      const stylePrompt = styleObj ? styleObj.prompt : 'Expressive Amharic reading';

      if (activeMode === 'dialogue') {
        const res = await requestGeminiTTS({
          isMultiSpeaker: true,
          dialogues: [
            {
              speaker: 'Amanuel',
              text: amanuelDialogue,
              voice: 'Puck',
              style: 'Deep, emotional and contemplative male voice',
            },
            {
              speaker: 'Lelise',
              text: leliseDialogue,
              voice: 'Kore',
              style: 'Inspiring, resolute and youthful female voice',
            },
          ],
        });

        setGeneratedAudioUrl(res.audioUrl);
        onPlayTrack({
          title: 'የአማኑኤል እና የሌሊሴ ውይይት (ባለ 2 ድምፅ ድራማ)',
          subtitle: 'Gemini 3.8 Flash TTS • Multi-Speaker',
          audioUrl: res.audioUrl,
          model: res.model,
        });
      } else {
        if (!inputText.trim()) {
          setError('እባክዎ የሚነበበውን ጽሑፍ ያስገቡ።');
          return;
        }

        const res = await requestGeminiTTS({
          text: inputText,
          voice: selectedVoice,
          style: stylePrompt,
        });

        setGeneratedAudioUrl(res.audioUrl);
        onPlayTrack({
          title: `የድምፅ ትረካ (${selectedVoice})`,
          subtitle: inputText.slice(0, 45) + '...',
          audioUrl: res.audioUrl,
          speaker: selectedVoice,
          model: res.model,
        });
      }
    } catch (err: any) {
      console.error('Studio TTS error:', err);
      setError(err.message || 'ድምፅ ማመንጨት አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Studio Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#172033] via-[#111726] to-[#0e1420] border border-amber-900/40 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              gemini-3.8-flash-tts
            </span>
            <span className="text-xs text-stone-400">የከፍተኛ ጥራት የድምፅ ስቱዲዮ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif-ethiopic">
            የአማርኛ ድምፅ መፍጠሪያ ስቱዲዮ (TTS Studio)
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            በ Gemini 3.8 Flash TTS አማካኝነት ማንኛውንም የአማርኛ ጽሑፍ ወደ ሕያውና ስሜት ቀስቃሽ የድምፅ ትረካ ይቀይሩ። ባለ አንድ ድምፅ ንባብ ወይም በአማኑኤል እና በሌሊሴ መካከል የሚደረግ ባለ ሁለት ድምፅ የድራማ ቅላጼ መፍጠር ይችላሉ።
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
        <button
          onClick={() => setActiveMode('single')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeMode === 'single'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>ባለ አንድ ድምፅ ትረካ</span>
        </button>

        <button
          onClick={() => setActiveMode('dialogue')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeMode === 'dialogue'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>ባለ ሁለት ተዋናይ ድምፅ (Amanuel & Lelise Dialogue)</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-800 text-red-200 p-4 rounded-2xl text-sm flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="text-xs underline ml-4">
            ዝጋ
          </button>
        </div>
      )}

      {activeMode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#121926]/90 border border-stone-800/80 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  የሚነበብ የአማርኛ ጽሑፍ
                </label>
                <button
                  onClick={handleCopy}
                  className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'ተቀድቷል' : 'ቅዳ'}</span>
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                placeholder="የሚነበበውን የአማርኛ ጽሑፍ እዚህ ይጻፉ..."
                className="w-full bg-[#0a0e17] border border-stone-800 rounded-xl p-4 text-stone-100 font-serif-ethiopic text-base sm:text-lg focus:border-amber-500 focus:outline-none transition-colors resize-y leading-relaxed"
              />

              <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>የቃላት ብዛት፡ {inputText.trim().split(/\s+/).filter(Boolean).length}</span>
                <span>የፊደላት ብዛት፡ {inputText.length}</span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                ከተመረጡት የታሪኩ ጥቅሶች ውስጥ ይምረጡ፡
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_QUOTES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(item.text);
                      setSelectedVoice(item.voice);
                    }}
                    className="p-3 rounded-xl bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 text-left transition-colors group"
                  >
                    <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate mt-1 font-serif-ethiopic">
                      {item.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice & Style Settings */}
          <div className="space-y-4">
            {/* Voice Selection */}
            <div className="bg-[#121926]/90 border border-stone-800/80 rounded-2xl p-5 shadow-lg space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                የድምፅ ምርጫ (Voice)
              </label>
              <div className="space-y-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      selectedVoice === v.id
                        ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-sm'
                        : 'bg-stone-900/40 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{v.name}</p>
                      <p className="text-[11px] text-stone-400">{v.desc}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                      {v.gender}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Style */}
            <div className="bg-[#121926]/90 border border-stone-800/80 rounded-2xl p-5 shadow-lg space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                የንባብ ቅላጼ (Style)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedStyle === s.id
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-900/60 hover:bg-stone-800 border-stone-800 text-stone-300'
                    }`}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>በ Gemini TTS እየተዘጋጀ ነው...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>ድምፁን አመንጭ (Generate Audio)</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Dialogue Multi-Speaker Mode */
        <div className="bg-[#121926]/90 border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-300 font-serif-ethiopic flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              ባለ ሁለት ተዋናይ ድምፅ (Amanuel & Lelise Screenplay TTS)
            </h3>
            <p className="text-xs text-stone-400">
              gemini-3.8-flash-tts ባለ 2 ተናጋሪ ድምፅ ውቅርን (multiSpeakerVoiceConfig) በመጠቀም አማኑኤልን እና ሌሊሴን በአንድ የድምፅ ማዕቀፍ ውስጥ ያነጋግራል!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amanuel's line */}
            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60">
                  አማኑኤል (Voice: Puck)
                </span>
                <span className="text-[11px] text-stone-400">ድምፅ 1</span>
              </div>
              <textarea
                value={amanuelDialogue}
                onChange={(e) => setAmanuelDialogue(e.target.value)}
                rows={4}
                className="w-full bg-[#0a0e17] border border-blue-900/40 rounded-xl p-3 text-stone-100 font-serif-ethiopic text-sm sm:text-base focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Lelise's line */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                  ሌሊሴ (Voice: Kore)
                </span>
                <span className="text-[11px] text-stone-400">ድምፅ 2</span>
              </div>
              <textarea
                value={leliseDialogue}
                onChange={(e) => setLeliseDialogue(e.target.value)}
                rows={4}
                className="w-full bg-[#0a0e17] border border-emerald-900/40 rounded-xl p-3 text-stone-100 font-serif-ethiopic text-sm sm:text-base focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>ባለ 2 ድምፅ ድራማውን እያዘጋጀ ነው...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>ባለ ሁለት ተዋናይ ድምፅ አመንጭ (Generate Dual-Voice TTS)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
