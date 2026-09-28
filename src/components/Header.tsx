import React from 'react';
import { BookOpen, Mic, Users, Bookmark, Sparkles, CloudRain, Type, Train } from 'lucide-react';

interface HeaderProps {
  activeTab: 'reader' | 'tts' | 'characters' | 'glossary' | 'ai';
  onSelectTab: (tab: 'reader' | 'tts' | 'characters' | 'glossary' | 'ai') => void;
  isAmbienceActive: boolean;
  onToggleAmbience: () => void;
  fontSize: 'small' | 'medium' | 'large';
  onChangeFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isAmbienceActive,
  onToggleAmbience,
  fontSize,
  onChangeFontSize,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c1018]/90 backdrop-blur-md border-b border-amber-900/40 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Novel Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold font-serif-ethiopic text-stone-100 tracking-tight flex items-center gap-2">
                  የባቡር ጣቢያው ጥላ
                </h1>
                <p className="text-[11px] text-amber-400 font-mono">
                  ላፍቶ ባቡር ጣቢያ • አዲስ አበባ
                </p>
              </div>
            </div>

            {/* Quick Ambience Toggle on mobile */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onToggleAmbience}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                  isAmbienceActive
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
                title="የጣቢያው ዝናብ ድምፅ"
              >
                <CloudRain className={`w-4 h-4 ${isAmbienceActive ? 'animate-bounce text-blue-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => onSelectTab('reader')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ሙሉ ንባብ</span>
            </button>

            <button
              onClick={() => onSelectTab('tts')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'tts'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>የድምፅ ስቱዲዮ (TTS)</span>
            </button>

            <button
              onClick={() => onSelectTab('characters')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'characters'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ገጸ-ባሕሪያት</span>
            </button>

            <button
              onClick={() => onSelectTab('glossary')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'glossary'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>የቃላት መፍቻ</span>
            </button>

            <button
              onClick={() => onSelectTab('ai')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>የፈጠራ ላብ</span>
            </button>
          </nav>

          {/* Desktop Controls (Ambience & Font Size) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleAmbience}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                isAmbienceActive
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="የላፍቶ ጣቢያ የዝናብ እና ሀዲድ ድምፅ"
            >
              <CloudRain className={`w-3.5 h-3.5 ${isAmbienceActive ? 'animate-bounce text-blue-400' : ''}`} />
              <span>የጣቢያ ድባብ {isAmbienceActive ? 'በርቷል' : 'ጠፍቷል'}</span>
            </button>

            {/* Font Size controls */}
            <div className="flex items-center bg-stone-900/80 border border-stone-800 rounded-xl p-0.5">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeFontSize(s)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    fontSize === s ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title={`የፊደል መጠን፡ ${s}`}
                >
                  {s === 'small' ? 'ሀ' : s === 'medium' ? 'ሀ+' : 'ሀ++'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
