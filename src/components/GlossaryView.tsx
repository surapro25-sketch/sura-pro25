import React, { useState } from 'react';
import { GLOSSARY, GlossaryItem } from '../data/story';
import { BookOpen, Volume2, Sparkles, Loader2, Bookmark } from 'lucide-react';
import { requestGeminiTTS } from '../utils/audioPlayer';

interface GlossaryViewProps {
  onPlayTrack: (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  }) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onPlayTrack }) => {
  const [loadingTerm, setLoadingTerm] = useState<string | null>(null);

  const handlePlayTerm = async (item: GlossaryItem) => {
    try {
      setLoadingTerm(item.term);
      const textToRead = `${item.term}። ${item.definition} በታሪኩ ውስጥ፡ ${item.context}`;

      const res = await requestGeminiTTS({
        text: textToRead,
        voice: 'Fenrir',
        style: 'Informative, poetic and clear Ethiopian educator voice',
      });

      onPlayTrack({
        title: `የቃላት መፍቻ፡ ${item.term}`,
        subtitle: item.phonetic,
        audioUrl: res.audioUrl,
        model: res.model,
      });
    } catch (err) {
      console.error('Term audio error:', err);
    } finally {
      setLoadingTerm(null);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#172033] via-[#101726] to-[#0d131f] border border-amber-900/40 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          የስነ-ጽሑፍ እና የባህል መፍቻ
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif-ethiopic">
          የቃላት እና የተምሳሌት ማብራሪያ (Literary Symbols & Glossary)
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
          በ "የባቡር ጣቢያው ጥላ" ልብ-ወለድ ውስጥ የተካተቱ ታሪካዊ ስፍራዎች፣ ባህላዊ መጠጦችና ተምሳሌታዊ ፍልስፍናዎች ማብራሪያ።
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GLOSSARY.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#111724]/90 border border-stone-800 hover:border-amber-900/50 transition-all shadow-md space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-amber-200 font-serif-ethiopic">
                    {item.term}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono italic">
                    {item.phonetic}
                  </p>
                </div>
                <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                  {idx + 1}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-amber-500" />
                  ትርጓሜ (Definition)
                </p>
                <p className="text-sm text-stone-200 leading-relaxed font-serif-ethiopic">
                  {item.definition}
                </p>
              </div>

              <div className="space-y-1 bg-stone-900/40 p-3 rounded-xl border border-stone-800/60">
                <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  በታሪኩ ውስጥ ያለው ሚና (Literary Context)
                </p>
                <p className="text-xs sm:text-sm text-stone-300 font-serif-ethiopic italic">
                  "{item.context}"
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePlayTerm(item)}
              disabled={loadingTerm === item.term}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-300 hover:text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loadingTerm === item.term ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>በማዘጋጀት ላይ...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ማብራሪያውን በድምፅ አድምጥ (TTS)</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
