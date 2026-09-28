// Sound and Speech Player utilities for "የባቡር ጣቢያው ጥላ"

class StationAmbienceGenerator {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private rainNode: AudioNode | null = null;
  private trainGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private intervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generates soothing pink noise simulating rain falling on Lafto station tin roof
  public start(volume: number = 0.25) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isRunning) return;

      this.isRunning = true;
      this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);

      // Buffer for rain sound (pink noise filtered)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter to simulate rain on roof
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(this.masterGain);
      whiteNoise.start(0);
      this.rainNode = whiteNoise;

      // Distant rhythmic rail clatter
      this.trainGain = this.ctx.createGain();
      this.trainGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.trainGain.connect(this.masterGain);

      this.scheduleRailRumble();
    } catch (e) {
      console.warn('Ambience sound could not start:', e);
    }
  }

  private scheduleRailRumble() {
    if (!this.ctx || !this.trainGain || !this.isRunning) return;

    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.trainGain || !this.isRunning) return;
      try {
        const now = this.ctx.currentTime;
        // Two subtle rhythmic taps
        const osc = this.ctx.createOscillator();
        const tapGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(75, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

        tapGain.gain.setValueAtTime(0.08, now);
        tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(tapGain);
        tapGain.connect(this.trainGain);
        osc.start(now);
        osc.stop(now + 0.2);

        // Echo tap
        setTimeout(() => {
          if (!this.ctx || !this.trainGain || !this.isRunning) return;
          const now2 = this.ctx.currentTime;
          const osc2 = this.ctx.createOscillator();
          const tapGain2 = this.ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(65, now2);
          osc2.frequency.exponentialRampToValueAtTime(30, now2 + 0.15);

          tapGain2.gain.setValueAtTime(0.05, now2);
          tapGain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.15);

          osc2.connect(tapGain2);
          tapGain2.connect(this.trainGain);
          osc2.start(now2);
          osc2.stop(now2 + 0.18);
        }, 180);
      } catch (err) {
        // ignore
      }
    }, 2800);
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.rainNode) {
      try {
        (this.rainNode as any).stop();
      } catch (e) {}
      this.rainNode = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  }

  public getStatus() {
    return this.isRunning;
  }
}

export const ambienceSound = new StationAmbienceGenerator();

// Audio caching so generated paragraphs / chapters play instantly
const audioCache = new Map<string, string>();

export async function requestGeminiTTS(payload: {
  text?: string;
  voice?: string;
  style?: string;
  isMultiSpeaker?: boolean;
  dialogues?: Array<{ speaker: string; text: string; voice?: string; style?: string }>;
}): Promise<{ audioUrl: string; model: string; voiceUsed: string }> {
  const cacheKey = JSON.stringify(payload);
  if (audioCache.has(cacheKey)) {
    return {
      audioUrl: audioCache.get(cacheKey)!,
      model: 'gemini-3.8-flash-tts (cached)',
      voiceUsed: payload.voice || 'Puck',
    };
  }

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `TTS Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const binaryString = atob(data.audioBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
  const objectUrl = URL.createObjectURL(blob);
  audioCache.set(cacheKey, objectUrl);

  return {
    audioUrl: objectUrl,
    model: data.model || 'gemini-3.8-flash-tts',
    voiceUsed: data.voiceUsed || payload.voice || 'Puck',
  };
}
