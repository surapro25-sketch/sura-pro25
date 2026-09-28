import React, { useState } from 'react';
import { CHAPTERS, NOVEL_META } from './data/story';
import { Header } from './components/Header';
import { ChapterReader } from './components/ChapterReader';
import { TTSStudio } from './components/TTSStudio';
import { CharactersView } from './components/CharactersView';
import { GlossaryView } from './components/GlossaryView';
import { StoryInteractiveAI } from './components/StoryInteractiveAI';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ambienceSound } from './utils/audioPlayer';
import { Train, Clock, MapPin, Sparkles, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reader' | 'tts' | 'characters' | 'glossary' | 'ai'>('reader');
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const [isAmbienceActive, setIsAmbienceActive] = useState<boolean>(false);

  // Audio State
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
    paragraphId?: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleToggleAmbience = () => {
    if (isAmbienceActive) {
      ambienceSound.stop();
      setIsAmbienceActive(false);
    } else {
      ambienceSound.start(0.25);
      setIsAmbienceActive(true);
    }
  };

  const handlePlayTrack = (track: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
    paragraphId?: string;
  }) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTrackEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-stone-100 flex flex-col font-sans-ethiopic selection:bg-amber-500 selection:text-stone-950">
      {/* Station Background Aesthetic Gradient & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,15,23,0.85)_100%)]" />
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAmbienceActive={isAmbienceActive}
        onToggleAmbience={handleToggleAmbience}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 z-10">
        {/* Top Story Summary Card */}
        {activeTab === 'reader' && (
          <div className="mb-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#172033]/90 via-[#101726]/90 to-[#0e1420]/90 border border-amber-900/40 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-amber-400" />
                    አጭር የአማርኛ ልብ-ወለድ
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {NOVEL_META.setting}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    ምሽት 11:50
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 font-serif-ethiopic tracking-tight">
                  {NOVEL_META.title}
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 font-serif-ethiopic italic max-w-3xl leading-relaxed">
                  {NOVEL_META.synopsisAm}
                </p>
              </div>

              {/* Quick Audio CTA */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('tts')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>የድምፅ ስቱዲዮ (TTS)</span>
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-mono text-center">
                  <Sparkles className="w-3 h-3" />
                  <span>Gemini 3.8 Flash TTS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'reader' && (
          <ChapterReader
            chapters={CHAPTERS}
            currentChapterId={currentChapterId}
            onSelectChapter={setCurrentChapterId}
            onPlayTrack={handlePlayTrack}
            currentPlayingId={currentTrack?.paragraphId || null}
            isPlaying={isPlaying}
            onTogglePlayPause={handlePlayPauseToggle}
            fontSize={fontSize}
            showTranslations={showTranslations}
            onToggleTranslations={() => setShowTranslations(!showTranslations)}
          />
        )}

        {activeTab === 'tts' && (
          <TTSStudio
            onPlayTrack={handlePlayTrack}
            isPlaying={isPlaying}
            onTogglePlayPause={handlePlayPauseToggle}
          />
        )}

        {activeTab === 'characters' && (
          <CharactersView onPlayTrack={handlePlayTrack} />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView onPlayTrack={handlePlayTrack} />
        )}

        {activeTab === 'ai' && (
          <StoryInteractiveAI onPlayTrack={handlePlayTrack} />
        )}
      </main>

      {/* Floating Audio Player Bar */}
      <AudioPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        onTrackEnded={handleTrackEnded}
        isAmbienceActive={isAmbienceActive}
        onToggleAmbience={handleToggleAmbience}
      />
    </div>
  );
}
