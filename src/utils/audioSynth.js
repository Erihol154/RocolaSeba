// Audio Engine supporting Real Track Audio Samples (iTunes MP3/AAC) + Vinyl Crackle Simulation

class VinylSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.crackleNode = null;
    this.audioElement = null;
    this.isPlaying = false;
    this.timerId = null;
    this.onEndedCallback = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playVinylSound(audioUrl = null, onEnded = null) {
    // 1. Immediately halt any currently playing audio/crackle
    this.stopVinylSound();
    this.init();

    this.onEndedCallback = onEnded;
    this.isPlaying = true;
    const now = this.audioCtx.currentTime;

    // 2. Vinyl Crackle Noise Generation
    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        if (Math.random() < 0.003) {
          output[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          output[i] = (Math.random() * 2 - 1) * 0.02;
        }
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 3.0;

      const crackleGain = this.audioCtx.createGain();
      crackleGain.gain.setValueAtTime(0.01, now);
      crackleGain.gain.linearRampToValueAtTime(0.12, now + 0.8);

      whiteNoise.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(this.audioCtx.destination);
      whiteNoise.start(now);
      this.crackleNode = { source: whiteNoise, gain: crackleGain, filter };
    } catch (e) {
      console.log('Crackle init error:', e);
    }

    // 3. Play Real Track Audio Sample if available
    if (audioUrl) {
      this.audioElement = new Audio(audioUrl);
      this.audioElement.volume = 0.85;

      this.audioElement.onended = () => {
        this.stopVinylSound();
      };

      this.audioElement.onerror = () => {
        // If sample fails to load, fallback to 10 second vinyl crackle simulation
        this.timerId = setTimeout(() => {
          this.stopVinylSound();
        }, 10000);
      };

      this.audioElement.play().catch(e => {
        console.log('Audio playback stream error:', e);
        this.timerId = setTimeout(() => {
          this.stopVinylSound();
        }, 10000);
      });
    } else {
      // No audio preview URL: play vintage crackle for 12 seconds
      this.timerId = setTimeout(() => {
        this.stopVinylSound();
      }, 12000);
    }
  }

  stopVinylSound() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.onended = null;
        this.audioElement.onerror = null;
        this.audioElement.currentTime = 0;
      } catch (e) {}
      this.audioElement = null;
    }

    if (this.crackleNode) {
      try {
        this.crackleNode.source.stop();
        this.crackleNode.source.disconnect();
        this.crackleNode.gain.disconnect();
      } catch (e) {}
      this.crackleNode = null;
    }

    this.isPlaying = false;

    if (this.onEndedCallback) {
      const callback = this.onEndedCallback;
      this.onEndedCallback = null;
      callback();
    }
  }
}

export const vinylAudioEngine = new VinylSoundEngine();
