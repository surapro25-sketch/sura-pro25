import React, { useState } from 'react';
import { CHARACTERS, CharacterProfile } from '../data/story';
import { User, Volume2, Sparkles, Loader2, Heart, Compass, ShieldAlert, Award } from 'lucide-react';
import { requestGeminiTTS } from '../utils/audioPlayer';

interface CharactersViewProps {
  onPlayTrack: (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  }) => void;
}

export const CharactersView: React.FC<CharactersViewProps> = ({ onPlayTrack }) => {
  const [loadingCharId, setLoadingCharId] = useState<string | null>(null);

  const handlePlayCharacterVoice = async (char: CharacterProfile) => {
    try {
      setLoadingCharId(char.id);

      const quote =
        char.id === 'amanuel'
          ? 'እኔ አማኑኤል እባላለሁ። ላለፉት አምስት ዓመታት በዚህ መድረክ ላይ ብዙ ሰዎችን አይቻለሁ፤ ነገር ግን ዛሬ የቆየውን ጥላዬን በጣቢያው ጥዬ አዲስ ጉዞ ጀምሬያለሁ።'
          : 'ስሜ ሌሊሴ ይባላል። እኔ የምሸሸው ከሰው ሳይሆን ከታነቀ ሕይወት ነው። የሌሎችን ሕልም ከመኖር ይልቅ በገዛ እጄ በሳልኩት የነጻነት መንገድ ላይ መራመድ ይበልጥብኛል!';

      const res = await requestGeminiTTS({
        text: quote,
        voice: char.geminiVoice,
        style: char.voiceStyle,
      });

      onPlayTrack({
        title: `${char.name} • ${char.role}`,
        subtitle: quote.slice(0, 45) + '...',
        audioUrl: res.audioUrl,
        speaker: char.id,
        model: res.model,
      });
    } catch (err: any) {
      console.error('Character voice failed:', err);
    } finally {
      setLoadingCharId(null);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#172033] via-[#101726] to-[#0d131f] border border-amber-900/40 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          የገጸ-ባሕሪያት ማኅደር
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif-ethiopic">
          የታሪኩ ተጓዦች፡ አማኑኤል እና ሌሊሴ
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
          በላፍቶ ባቡር ጣቢያ መድረክ ላይ የተገናኙት ሁለት ተቃራኒ ነፍሶች፤ አንዱ በትዝታና በጸጸት የታሰረ፣ ሌላዋ ደግሞ በነጻነት ጥማት የሮጠች።
        </p>
      </div>

      {/* Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CHARACTERS.map((char) => {
          const isAmanuel = char.id === 'amanuel';
          const theme = isAmanuel
            ? {
                cardBg: 'bg-gradient-to-b from-[#11192e] to-[#0c1120]',
                border: 'border-blue-900/50 hover:border-blue-600/60',
                accentBadge: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
                buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white',
                avatarBg: 'bg-blue-900/40 border-blue-700/50 text-blue-300',
              }
            : {
                cardBg: 'bg-gradient-to-b from-[#13221d] to-[#0d1613]',
                border: 'border-emerald-900/50 hover:border-emerald-600/60',
                accentBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
                buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
                avatarBg: 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300',
              };

          return (
            <div
              key={char.id}
              className={`rounded-3xl p-6 sm:p-7 border ${theme.cardBg} ${theme.border} transition-all duration-300 shadow-xl space-y-6 flex flex-col justify-between`}
            >
              <div className="space-y-5">
                {/* Avatar and Name */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-2xl font-bold font-serif-ethiopic shadow-inner ${theme.avatarBg}`}
                    >
                      {char.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif-ethiopic">
                        {char.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-mono">
                        {char.nameEn} • {char.age}
                      </p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.accentBadge}`}>
                        {char.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-300 leading-relaxed font-serif-ethiopic bg-stone-900/40 p-3.5 rounded-xl border border-stone-800/60">
                  {char.description}
                </p>

                {/* Backstory */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    ያለፈው ታሪክ (Backstory)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif-ethiopic">
                    {char.backstory}
                  </p>
                </div>

                {/* Motivation */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    ውስጣዊ መሻት (Core Motivation)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif-ethiopic">
                    {char.motivation}
                  </p>
                </div>

                {/* Traits */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    ባሕሪያት (Character Traits)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {char.traits.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-stone-900/80 border border-stone-800 text-stone-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Hear Character Voice via TTS */}
              <div className="pt-4 border-t border-stone-800/60">
                <button
                  onClick={() => handlePlayCharacterVoice(char)}
                  disabled={loadingCharId === char.id}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 ${theme.buttonBg}`}
                >
                  {loadingCharId === char.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ድምፁን በ Gemini TTS እያዘጋጀ ነው...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>የ{char.name}ን ድምፅ አድምጥ (Gemini TTS: {char.geminiVoice})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
