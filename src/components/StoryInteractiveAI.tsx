import React, { useState } from 'react';
import { Sparkles, MessageSquare, Feather, BookOpen, Volume2, Loader2, Send, Copy, Check } from 'lucide-react';
import { requestGeminiTTS } from '../utils/audioPlayer';

interface StoryInteractiveAIProps {
  onPlayTrack: (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  }) => void;
}

export const StoryInteractiveAI: React.FC<StoryInteractiveAIProps> = ({ onPlayTrack }) => {
  const [activeTab, setActiveTab] = useState<'epilogue' | 'poem' | 'ask'>('epilogue');
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: 'epilogue' | 'poem' | 'ask') => {
    try {
      setLoading(true);
      setError(null);
      setAiResponse(null);

      const res = await fetch('/api/story/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          query: type === 'ask' ? userQuery : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'AI generation failed');
      }

      const data = await res.json();
      setAiResponse(data.content);
    } catch (err: any) {
      console.error('AI call failed:', err);
      setError(err.message || 'ማመንጨት አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTTS = async () => {
    if (!aiResponse) return;
    try {
      setTtsLoading(true);
      const res = await requestGeminiTTS({
        text: aiResponse,
        voice: 'Fenrir',
        style: 'Inspiring, grand and emotional Amharic literary storytelling voice',
      });

      onPlayTrack({
        title: activeTab === 'epilogue' ? 'ቀጣዩ ምዕራፍ (በድሬዳዋ)' : activeTab === 'poem' ? 'የተቀነባበረ ግጥም' : 'የስነ-ጽሑፍ መልስ',
        subtitle: 'በ Gemini 3.8 Flash TTS የተተረከ',
        audioUrl: res.audioUrl,
        model: res.model,
      });
    } catch (err: any) {
      console.error('TTS failed:', err);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1b1c2e] via-[#131422] to-[#0e0f1a] border border-amber-900/40 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          gemini-3.8-flash & gemini-3.8-flash-tts
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif-ethiopic">
          የልብ-ወለዱ ፈጠራ እና የስነ-ጽሑፍ ላብራቶሪ
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
          በ Gemini 3.8 Flash አማካኝነት ስለ አማኑኤል እና ሌሊሴ ጉዞ ቀጣዩን ምዕራፍ ይፍጠሩ፣ ግጥም ያቀናብሩ ወይም የስነ-ጽሑፍ ትንታኔ ያግኙ። የተፈጠረውንም በ Gemini 3.8 Flash TTS ወዲያውኑ በድምፅ ያዳምጡ!
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveTab('epilogue');
            handleGenerate('epilogue');
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'epilogue'
              ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md'
              : 'bg-stone-900/40 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm font-serif-ethiopic">ቀጣይ ምዕራፍ (Epilogue)</span>
          </div>
          <p className="text-xs text-stone-400">ባቡሩ ድሬዳዋ ሲደርስ ምን ተፈጠረ?</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('poem');
            handleGenerate('poem');
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'poem'
              ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md'
              : 'bg-stone-900/40 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Feather className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm font-serif-ethiopic">የነጻነት ግጥም (Poetry)</span>
          </div>
          <p className="text-xs text-stone-400">ስለ ጥላውና ብርሃኑ የተሰናዳ ቅኔ</p>
        </button>

        <button
          onClick={() => setActiveTab('ask')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'ask'
              ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md'
              : 'bg-stone-900/40 hover:bg-stone-800 border-stone-800 text-stone-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm font-serif-ethiopic">የስነ-ጽሑፍ ጥያቄ (Ask AI)</span>
          </div>
          <p className="text-xs text-stone-400">ስለ ታሪኩ እና ገጸ-ባሕሪያቱ ጠይቁ</p>
        </button>
      </div>

      {/* Ask Question Input Box */}
      {activeTab === 'ask' && (
        <div className="bg-[#121926]/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            ስለ "የባቡር ጣቢያው ጥላ" ጥያቄዎን ያስገቡ፡
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate('ask')}
              placeholder="ለምሳሌ፡ የአማኑኤል የ5 ዓመት መጠባበቅ በስነ-ልቦና ረገድ ምን ያሳያል?"
              className="flex-1 bg-[#0a0e17] border border-stone-800 rounded-xl px-4 py-3 text-stone-100 font-serif-ethiopic text-sm focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={() => handleGenerate('ask')}
              disabled={loading || !userQuery.trim()}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>ጠይቅ</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Generated Result Card */}
      {loading && (
        <div className="p-12 rounded-3xl bg-[#121926]/70 border border-stone-800/80 flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <div className="space-y-1">
            <p className="text-base font-semibold text-stone-200 font-serif-ethiopic">
              በ Gemini 3.8 Flash እየተጻፈ ነው...
            </p>
            <p className="text-xs text-stone-400">ጥልቅ የአማርኛ ስነ-ጽሑፍ ይዘት እየተዋቀረ ነው</p>
          </div>
        </div>
      )}

      {aiResponse && !loading && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131b2c] to-[#0c121e] border border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                የተፈጠረ የስነ-ጽሑፍ ስራ
              </span>
              <span className="text-xs text-stone-400 font-mono">Gemini 3.8 Flash</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'ተቀድቷል' : 'ቅዳ'}</span>
              </button>
            </div>
          </div>

          {/* Response Text */}
          <div className="font-serif-ethiopic text-stone-100 text-lg sm:text-xl leading-loose whitespace-pre-wrap">
            {aiResponse}
          </div>

          {/* Action: TTS button */}
          <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-amber-400 font-serif-ethiopic">
              ይህን ጽሑፍ በከፍተኛ ጥራት የድምፅ ትረካ ማዳመጥ ይፈልጋሉ?
            </p>
            <button
              onClick={handlePlayTTS}
              disabled={ttsLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {ttsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>በ Gemini 3.8 Flash TTS እየተቀረጸ ነው...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>በድምፅ አድምጥ (Gemini TTS)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
