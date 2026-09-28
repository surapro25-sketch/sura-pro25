import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CloudRain, Sparkles, Download, Gauge } from 'lucide-react';
import { ambienceSound } from '../utils/audioPlayer';

interface AudioPlayerBarProps {
  currentTrack: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    speaker?: string;
    model?: string;
  } | null;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onTrackEnded?: () => void;
  isAmbienceActive: boolean;
  onToggleAmbience: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onPlayPauseToggle,
  onTrackEnded,
  isAmbienceActive,
  onToggleAmbience,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play prevented:', err));
      }
    }
  }, [currentTrack?.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play prevented:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121926]/95 backdrop-blur-md border-t border-amber-900/40 text-stone-200 px-4 py-3 shadow-2xl transition-all duration-300">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => {
          onTrackEnded?.();
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Details */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-200 truncate font-serif-ethiopic">
              {currentTrack.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="truncate">{currentTrack.subtitle || 'የላፍቶ ጣቢያ ትረካ'}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-800/40 text-[10px] text-amber-300 shrink-0">
                Gemini 3.8 Flash TTS
              </span>
            </div>
          </div>
        </div>

        {/* Center Controls & Progress */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:w-2/5">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
              title="እንደገና ጀምር"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayPauseToggle}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
              title={isPlaying ? 'አቁም' : 'አጫውት'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded bg-stone-800/80 hover:bg-stone-700 text-xs font-mono text-amber-300 border border-stone-700/60 flex items-center gap-1"
                title="የድምፅ ፍጥነት"
              >
                <Gauge className="w-3.5 h-3.5" />
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-stone-900 border border-amber-900/40 rounded-lg p-1 shadow-xl flex flex-col gap-1 z-50">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 text-xs rounded text-left transition-colors ${
                        playbackSpeed === speed ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-stone-800 text-stone-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress Slider */}
          <div className="w-full flex items-center gap-2 text-xs text-stone-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Extra Controls */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-1/3">
          {/* Ambience Toggle */}
          <button
            onClick={onToggleAmbience}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              isAmbienceActive
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/20'
                : 'bg-stone-800/60 border-stone-700/50 text-stone-400 hover:text-stone-200'
            }`}
            title="የላፍቶ ጣቢያ የዝናብ እና የባቡር ድባብ"
          >
            <CloudRain className={`w-3.5 h-3.5 ${isAmbienceActive ? 'animate-bounce text-blue-400' : ''}`} />
            <span className="hidden md:inline font-sans-ethiopic">የጣቢያው ድባብ</span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded text-stone-400 hover:text-stone-200"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Download Audio */}
          {currentTrack.audioUrl && (
            <a
              href={currentTrack.audioUrl}
              download={`${currentTrack.title.replace(/\s+/g, '_')}_gemini_tts.wav`}
              className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
              title="ድምፁን አውርድ (.wav)"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
