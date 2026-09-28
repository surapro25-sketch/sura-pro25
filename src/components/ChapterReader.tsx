import React, { useState } from 'react';
import { Chapter, ParagraphItem } from '../data/story';
import { Play, Pause, Loader2, Volume2, Languages, Clock, BookOpen, User, Sparkles, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { requestGeminiTTS } from '../utils/audioPlayer';

interface ChapterReaderProps {
  chapters: Chapter[];
  currentChapterId: number;
  onSelectChapter: (id: number) => void;
  onPlayTrack: (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  }) => void;
  currentPlayingId: string | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  fontSize: 'small' | 'medium' | 'large';
  showTranslations: boolean;
  onToggleTranslations: () => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
  onPlayTrack,
  currentPlayingId,
  isPlaying,
  onTogglePlayPause,
  fontSize,
  showTranslations,
  onToggleTranslations,
}) => {
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];
  const [loadingParagraphId, setLoadingParagraphId] = useState<string | null>(null);
  const [loadingChapterAudio, setLoadingChapterAudio] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Font size classes
  const fontClasses = {
    small: 'text-base sm:text-lg leading-relaxed',
    medium: 'text-lg sm:text-xl leading-loose',
    large: 'text-xl sm:text-2xl leading-loose',
  }[fontSize];

  // Play individual paragraph using gemini-3.8-flash-tts
  const handlePlayParagraph = async (p: ParagraphItem) => {
    if (currentPlayingId === p.id && isPlaying) {
      onTogglePlayPause();
      return;
    }
    if (currentPlayingId === p.id && !isPlaying) {
      onTogglePlayPause();
      return;
    }

    try {
      setLoadingParagraphId(p.id);
      setErrorNotice(null);

      // Determine voice & style based on speaker
      let voice = 'Fenrir'; // narrator voice
      let style = 'Clear, evocative and atmospheric Amharic literary narrator';

      if (p.speaker === 'amanuel') {
        voice = 'Puck';
        style = 'Weary, nostalgic, thoughtful and sincere Ethiopian male voice';
      } else if (p.speaker === 'lelise') {
        voice = 'Kore';
        style = 'Vibrant, resolute, poetic and emotionally free young Ethiopian woman';
      }

      const res = await requestGeminiTTS({
        text: p.text,
        voice,
        style,
      });

      onPlayTrack({
        title: `${p.speaker === 'amanuel' ? 'አማኑኤል' : p.speaker === 'lelise' ? 'ሌሊሴ' : 'ተራኪ'} - ምዕራፍ ${currentChapter.geeNum}`,
        subtitle: p.text.slice(0, 45) + '...',
        audioUrl: res.audioUrl,
        speaker: p.speaker,
        model: res.model,
      });
    } catch (err: any) {
      console.error('TTS generation failed:', err);
      setErrorNotice(err.message || 'ድምፅ ማመንጨት አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoadingParagraphId(null);
    }
  };

  // Play entire chapter with gemini-3.8-flash-tts
  const handlePlayEntireChapter = async (dualSpeaker: boolean = false) => {
    try {
      setLoadingChapterAudio(true);
      setErrorNotice(null);

      if (dualSpeaker) {
        // Multi-speaker dialogue with gemini-3.8-flash-tts (Amanuel & Lelise)
        const amanuelDialogue = currentChapter.paragraphs
          .filter((p) => p.speaker === 'amanuel')
          .map((p) => p.text)
          .join(' ');
        const leliseDialogue = currentChapter.paragraphs
          .filter((p) => p.speaker === 'lelise')
          .map((p) => p.text)
          .join(' ');

        if (amanuelDialogue && leliseDialogue) {
          const res = await requestGeminiTTS({
            isMultiSpeaker: true,
            dialogues: [
              {
                speaker: 'Amanuel',
                text: amanuelDialogue,
                voice: 'Puck',
                style: 'Deep, nostalgic Ethiopian man',
              },
              {
                speaker: 'Lelise',
                text: leliseDialogue,
                voice: 'Kore',
                style: 'Brave, youthful, inspiring Ethiopian woman',
              },
            ],
          });

          onPlayTrack({
            title: `ምዕራፍ ${currentChapter.geeNum}፡ ${currentChapter.title} (ባለ ሁለት ተዋናይ ድምፅ)`,
            subtitle: 'አማኑኤል (Puck) እና ሌሊሴ (Kore)',
            audioUrl: res.audioUrl,
            model: res.model,
          });
          return;
        }
      }

      // Single narrator for the full chapter
      const fullText = currentChapter.paragraphs.map((p) => p.text).join(' \n');
      const res = await requestGeminiTTS({
        text: fullText,
        voice: 'Fenrir',
        style: 'Grand, emotional and dramatic Amharic audiobook narrator reading the full chapter with pacing',
      });

      onPlayTrack({
        title: `ምዕራፍ ${currentChapter.geeNum}፡ ${currentChapter.title}`,
        subtitle: `${currentChapter.time} • ሙሉ ምዕራፍ ትረካ`,
        audioUrl: res.audioUrl,
        model: res.model,
      });
    } catch (err: any) {
      console.error('Full chapter TTS failed:', err);
      setErrorNotice(err.message || 'ሙሉውን ምዕራፍ ማመንጨት አልተሳካም።');
    } finally {
      setLoadingChapterAudio(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Chapter Selection Tabs */}
      <div className="bg-[#121926]/90 border border-amber-900/30 rounded-2xl p-2 sm:p-3 backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {chapters.map((ch) => {
            const isActive = ch.id === currentChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch.id)}
                className={`p-3 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-900/50 to-amber-950/80 border border-amber-500/60 shadow-md text-amber-100'
                    : 'bg-stone-900/40 hover:bg-stone-800/60 border border-stone-800/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'}`}>
                    ምዕራፍ {ch.geeNum}
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-500/70" />
                    {ch.time.split(' ')[1] || ch.time}
                  </span>
                </div>
                <h3 className="text-sm font-semibold truncate font-serif-ethiopic mt-1">
                  {ch.title}
                </h3>
                <p className="text-[11px] text-stone-400 truncate mt-0.5">
                  {ch.titleEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {errorNotice && (
        <div className="bg-red-950/60 border border-red-800/60 text-red-200 p-4 rounded-xl text-sm flex items-center justify-between">
          <p>{errorNotice}</p>
          <button
            onClick={() => setErrorNotice(null)}
            className="text-xs underline ml-4 hover:text-white"
          >
            ዝጋ
          </button>
        </div>
      )}

      {/* Chapter Banner & Hero Quote */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-900/40 bg-gradient-to-b from-[#182030] via-[#101622] to-[#0c1018] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                ምዕራፍ {currentChapter.geeNum}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {currentChapter.time} • ላፍቶ ባቡር ጣቢያ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-ethiopic text-stone-100">
              {currentChapter.title}
            </h1>
            <p className="text-sm sm:text-base text-amber-400/90 font-serif-ethiopic italic max-w-2xl">
              "{currentChapter.summary}"
            </p>
          </div>

          {/* Chapter Narration Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handlePlayEntireChapter(false)}
              disabled={loadingChapterAudio}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loadingChapterAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>ሙሉ ምዕራፍ አድምጥ</span>
            </button>

            {/* If chapter has both Amanuel & Lelise, allow dual-speaker option */}
            {currentChapter.paragraphs.some((p) => p.speaker === 'amanuel') &&
              currentChapter.paragraphs.some((p) => p.speaker === 'lelise') && (
                <button
                  onClick={() => handlePlayEntireChapter(true)}
                  disabled={loadingChapterAudio}
                  className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-amber-500/40 text-amber-300 font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  title="በአማኑኤል እና በሌሊሴ ባለ ሁለት ተዋናይ ድምፅ አድምጥ"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ባለ 2 ድምፅ ድራማ</span>
                </button>
              )}

            <button
              onClick={onToggleTranslations}
              className={`p-2.5 rounded-xl border text-sm flex items-center gap-1.5 transition-all ${
                showTranslations
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                  : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
              title="የእንግሊዝኛ ትርጉም አሳይ / ደብቅ"
            >
              <Languages className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Quote Card */}
        {currentChapter.keyQuote && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-3">
            <Quote className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm sm:text-base text-amber-200 font-serif-ethiopic italic">
                "{currentChapter.keyQuote.text}"
              </p>
              <p className="text-xs font-semibold text-amber-400/80">
                — {currentChapter.keyQuote.speaker}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Paragraphs List */}
      <div className="space-y-6">
        {currentChapter.paragraphs.map((p, idx) => {
          const isThisParagraphActive = currentPlayingId === p.id;
          const isLoadingThis = loadingParagraphId === p.id;

          const speakerTheme = {
            narrator: {
              badgeBg: 'bg-stone-800/90 text-stone-300 border-stone-700',
              label: 'ተራኪ (Narrator)',
              borderColor: 'border-stone-800/60 hover:border-amber-900/40',
              avatarBg: 'bg-stone-700/60 text-stone-300',
            },
            amanuel: {
              badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-800/50',
              label: 'አማኑኤል (Amanuel)',
              borderColor: 'border-blue-900/40 hover:border-blue-700/60',
              avatarBg: 'bg-blue-900/50 text-blue-300',
            },
            lelise: {
              badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50',
              label: 'ሌሊሴ (Lelise)',
              borderColor: 'border-emerald-900/40 hover:border-emerald-700/60',
              avatarBg: 'bg-emerald-900/50 text-emerald-300',
            },
          }[p.speaker];

          return (
            <div
              key={p.id}
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 relative group ${
                isThisParagraphActive
                  ? 'bg-gradient-to-r from-amber-950/40 to-stone-900/90 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.008]'
                  : `bg-[#111724]/80 ${speakerTheme.borderColor} hover:bg-[#151d2d]/90 shadow-sm`
              }`}
            >
              {/* Header row: Speaker badge & audio action */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${speakerTheme.avatarBg}`}>
                    {p.speaker === 'amanuel' ? 'አ' : p.speaker === 'lelise' ? 'ሌ' : 'ተ'}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${speakerTheme.badgeBg}`}>
                    {speakerTheme.label}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">#{idx + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayParagraph(p)}
                    disabled={isLoadingThis}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isThisParagraphActive && isPlaying
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700/60'
                    }`}
                    title="በ Gemini TTS አድምጥ"
                  >
                    {isLoadingThis ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isThisParagraphActive && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span className="hidden sm:inline">
                      {isThisParagraphActive && isPlaying ? 'አቁም' : 'አድምጥ (TTS)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Main Amharic Text */}
              <p className={`font-serif-ethiopic text-stone-100 ${fontClasses} tracking-normal`}>
                {p.text}
              </p>

              {/* English Translation */}
              {showTranslations && p.translation && (
                <div className="mt-3 pt-3 border-t border-stone-800/60 text-stone-400 text-sm italic font-sans leading-relaxed">
                  <span className="text-amber-500/80 not-italic font-semibold mr-1.5">[En]:</span>
                  {p.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chapter Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-amber-900/30">
        {currentChapterId > 1 ? (
          <button
            onClick={() => onSelectChapter(currentChapterId - 1)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ቀዳሚ ምዕራፍ ({chapters[currentChapterId - 2]?.title})</span>
          </button>
        ) : (
          <div />
        )}

        {currentChapterId < chapters.length ? (
          <button
            onClick={() => onSelectChapter(currentChapterId + 1)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>ቀጣይ ምዕራፍ ({chapters[currentChapterId]?.title})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs text-amber-400/80 font-serif-ethiopic">
            የልብ-ወለዱ ፍጻሜ • አዲስ ጉዞ ተጀመረ!
          </div>
        )}
      </div>
    </div>
  );
};
