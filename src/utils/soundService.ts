/**
 * Notification Sound Service
 * Synthesizes specialized, acoustic audio notification alerts using the Web Audio API
 * without requiring any external audio files.
 *
 * Provides distinct audio profiles for:
 * 1. 'payment_approval' / 'payment': Cash Payment Checkout ("Cha-Ching!" Cash Register + Coin Cascade)
 * 2. 'registration': iPhone SMS Bell ("Ding-Ding!" Crystal Chime)
 * 3. 'inbox' / 'message' / 'secretariat': Android SMS Tone (Marimba Pop Dual-Tone)
 * 4. 'elite_vip' / 'elite': Royal Trumpet Fanfare & Crowd Applause / Cheering
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export type NotificationSoundType = 
  | 'payment_approval' 
  | 'payment' 
  | 'approval' 
  | 'checkout' 
  | 'registration' 
  | 'iphone' 
  | 'inbox' 
  | 'message' 
  | 'secretariat' 
  | 'android' 
  | 'elite_vip' 
  | 'elite' 
  | 'vip' 
  | 'broadcast' 
  | string;

/**
 * Play a rich, distinct acoustic audio alert matching the requested profile.
 */
export function playNotificationSound(type: NotificationSoundType = 'registration'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const soundKind = (type || 'registration').toLowerCase();

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.45, now);
    masterGain.connect(ctx.destination);

    if (
      soundKind.includes('payment') || 
      soundKind.includes('approval') || 
      soundKind.includes('checkout') || 
      soundKind.includes('cash')
    ) {
      // =========================================================================
      // 1. CASH PAYMENT CHECKOUT SOUND ("Cha-Ching!" Cash Register & Coin Cascade)
      // =========================================================================
      
      // Phase 1: Mechanical Cash Drawer Strike & Latch Slide (0.00s)
      playDrawerSlide(ctx, masterGain, now);

      // Phase 2: First Chime Strike "Cha-" (0.10s) - E6 (1318.51 Hz) + G#6 (1661.22 Hz)
      playBellPulse(ctx, masterGain, now + 0.10, 1318.51, 1661.22, 'triangle', 0.55, 0.18);

      // Phase 3: High Resonant Cash Register Chime "-Ching!" (0.22s) - B6 (1975.53 Hz) + E7 (2637.02 Hz) + G#7 (3322.44 Hz)
      playBellPulse(ctx, masterGain, now + 0.22, 1975.53, 2637.02, 'sine', 0.70, 0.85);
      playBellPulse(ctx, masterGain, now + 0.22, 3322.44, 3951.07, 'sine', 0.40, 0.60);

      // Phase 4: Silver Coin Cascade Bounces (0.28s to 0.48s)
      playCoinCascade(ctx, masterGain, now + 0.28);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([100, 40, 150]); } catch { /* silent */ }
      }

    } else if (
      soundKind.includes('elite') || 
      soundKind.includes('vip') || 
      soundKind.includes('trumpet') || 
      soundKind.includes('applause')
    ) {
      // =========================================================================
      // 4. ELITE VIP GUEST REGISTRATION (Royal Trumpet Fanfare & Crowd Applause)
      // =========================================================================

      // Part A: Royal Brass Trumpet Fanfare Sequence
      // Note 1 (0.00s): Staccato C4 (261.63 Hz) + G4 (392.00 Hz) + C5 (523.25 Hz)
      playBrassChord(ctx, masterGain, now + 0.00, [261.63, 392.00, 523.25], 0.12, 0.50);

      // Note 2 (0.14s): Staccato E4 (329.63 Hz) + G4 (392.00 Hz) + E5 (659.25 Hz)
      playBrassChord(ctx, masterGain, now + 0.14, [329.63, 392.00, 659.25], 0.12, 0.55);

      // Note 3 (0.28s): Ascending G4 (392.00 Hz) + C5 (523.25 Hz) + G5 (783.99 Hz)
      playBrassChord(ctx, masterGain, now + 0.28, [392.00, 523.25, 783.99], 0.15, 0.60);

      // Grand Triumphant Sustained Hold (0.46s to 1.60s): C5 + E5 + G5 + C6
      playBrassChord(ctx, masterGain, now + 0.46, [523.25, 659.25, 783.99, 1046.50], 1.15, 0.75, true);

      // Part B: Celebratory Crowd Applause & Cheering Whistles (0.50s to 2.20s)
      playCrowdApplauseAndCheering(ctx, masterGain, now + 0.50, 1.70);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([150, 70, 150, 70, 300]); } catch { /* silent */ }
      }

    } else if (
      soundKind.includes('inbox') || 
      soundKind.includes('message') || 
      soundKind.includes('secretariat') || 
      soundKind.includes('android')
    ) {
      // =========================================================================
      // 3. SECRETARIAT MESSAGE INBOX SOUND (Android SMS Marimba Pop Tone)
      // =========================================================================

      // Pop 1 (0.00s): Warm G5 (783.99 Hz) with tactile pitch-bend pop
      playMarimbaPop(ctx, masterGain, now + 0.00, 783.99, 0.45, 0.10);

      // Pop 2 (0.08s): Bright C6 (1046.50 Hz)
      playMarimbaPop(ctx, masterGain, now + 0.08, 1046.50, 0.55, 0.12);

      // Pop 3 (0.16s): High Resolving E6 (1318.51 Hz)
      playMarimbaPop(ctx, masterGain, now + 0.16, 1318.51, 0.65, 0.28);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([80, 40, 80]); } catch { /* silent */ }
      }

    } else {
      // =========================================================================
      // 2. GENERAL REGISTRATION SOUND (iPhone SMS Bell "Ding-Ding!")
      // =========================================================================

      // Strike 1 ("Ding 1" - 0.00s): E6 (1318.51 Hz) + Pure 3rd Harmonic (2637 Hz)
      playIPhoneBellPulse(ctx, masterGain, now + 0.00, 1318.51, 0.55, 0.18);

      // Strike 2 ("Ding 2" - 0.12s): Higher B6 (1975.53 Hz) + Pure 3rd Harmonic (3951 Hz)
      playIPhoneBellPulse(ctx, masterGain, now + 0.12, 1975.53, 0.65, 0.50);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([100, 50, 120]); } catch { /* silent */ }
      }
    }
  } catch (err) {
    console.debug('Notification sound playback note:', err);
  }
}

// =============================================================================
// SYNTHESIZER HELPER FUNCTIONS
// =============================================================================

/**
 * iPhone SMS Crystal Bell Pulse (pure sine wave with crystal harmonics)
 */
function playIPhoneBellPulse(
  ctx: AudioContext,
  destination: GainNode,
  startTime: number,
  freq: number,
  gainLevel: number,
  durationSec: number
) {
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, startTime);

  gain1.gain.setValueAtTime(0.001, startTime);
  gain1.gain.linearRampToValueAtTime(gainLevel, startTime + 0.003);
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  osc1.connect(gain1);
  gain1.connect(destination);
  osc1.start(startTime);
  osc1.stop(startTime + durationSec + 0.02);

  // High Crystal Harmonic Overtone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2.0, startTime);

  gain2.gain.setValueAtTime(0.001, startTime);
  gain2.gain.linearRampToValueAtTime(gainLevel * 0.35, startTime + 0.002);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + (durationSec * 0.6));

  osc2.connect(gain2);
  gain2.connect(destination);
  osc2.start(startTime);
  osc2.stop(startTime + durationSec + 0.02);
}

/**
 * Android Marimba Tactile Pop Tone
 */
function playMarimbaPop(
  ctx: AudioContext,
  destination: GainNode,
  startTime: number,
  freq: number,
  gainLevel: number,
  durationSec: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Sine-Triangle mix for woody tactile marimba sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.05, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.02);

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + durationSec + 0.02);
}

/**
 * Cash Register Mechanical Drawer Slide Sound
 */
function playDrawerSlide(ctx: AudioContext, destination: GainNode, startTime: number) {
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200, startTime);
  filter.Q.setValueAtTime(3.0, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start(startTime);
  noise.stop(startTime + 0.09);
}

/**
 * Silver Coin Cascade Bouncing Effects
 */
function playCoinCascade(ctx: AudioContext, destination: GainNode, startTime: number) {
  const coinFreqs = [3520.00, 4186.01, 4698.63, 5274.04];
  const delays = [0.00, 0.05, 0.11, 0.17];

  delays.forEach((delay, idx) => {
    const f = coinFreqs[idx % coinFreqs.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, startTime + delay);

    const level = 0.30 * Math.pow(0.75, idx);
    gain.gain.setValueAtTime(0.001, startTime + delay);
    gain.gain.linearRampToValueAtTime(level, startTime + delay + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + delay + 0.12);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime + delay);
    osc.stop(startTime + delay + 0.14);
  });
}

/**
 * Synthesizes a majestic Trumpet Brass chord with lowpass filter envelope sweep & vibrato
 */
function playBrassChord(
  ctx: AudioContext,
  destination: GainNode,
  startTime: number,
  freqs: number[],
  durationSec: number,
  volume: number,
  addVibrato: boolean = false
) {
  freqs.forEach(freq => {
    const oscSaw = ctx.createOscillator();
    const oscTri = ctx.createOscillator();
    const gain = ctx.createGain();

    oscSaw.type = 'sawtooth';
    oscTri.type = 'triangle';

    oscSaw.frequency.setValueAtTime(freq, startTime);
    oscTri.frequency.setValueAtTime(freq * 1.001, startTime); // slight detune for rich brass resonance

    if (addVibrato) {
      // 5.5 Hz vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, startTime);
      lfoGain.gain.setValueAtTime(freq * 0.008, startTime);

      lfo.connect(lfoGain);
      lfoGain.connect(oscSaw.frequency);
      lfoGain.connect(oscTri.frequency);
      lfo.start(startTime + 0.15); // Vibrato kicks in smoothly after 150ms
      lfo.stop(startTime + durationSec + 0.05);
    }

    // Resonant Filter Sweep for Authentic Brass Envelope
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, startTime);
    filter.frequency.linearRampToValueAtTime(freq * 4.5, startTime + 0.04);
    filter.frequency.exponentialRampToValueAtTime(freq * 2.2, startTime + durationSec);

    // Envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume / freqs.length, startTime + 0.03);
    gain.gain.setValueAtTime(volume / freqs.length, startTime + durationSec * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    oscSaw.connect(filter);
    oscTri.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    oscSaw.start(startTime);
    oscTri.start(startTime);
    oscSaw.stop(startTime + durationSec + 0.05);
    oscTri.stop(startTime + durationSec + 0.05);
  });
}

/**
 * Crowd Applause & Cheering Synthesizer
 */
function playCrowdApplauseAndCheering(
  ctx: AudioContext,
  destination: GainNode,
  startTime: number,
  durationSec: number
) {
  // 1. Noise Generator for Hand Claps
  const bufferSize = ctx.sampleRate * durationSec;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate dense clapping noise with stochastic bursts
  for (let i = 0; i < bufferSize; i++) {
    const rand = Math.random() * 2 - 1;
    // Rhythmic clap burst density
    const burst = Math.pow(Math.sin(i / 120), 4) > 0.45 ? 1.8 : 0.6;
    data[i] = rand * burst;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(1800, startTime);
  bandpass.Q.setValueAtTime(1.2, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(0.35, startTime + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  noise.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(destination);

  noise.start(startTime);
  noise.stop(startTime + durationSec + 0.05);

  // 2. High Pitch-Slide Cheering Whistles
  const whistleDelays = [0.15, 0.40, 0.75];
  whistleDelays.forEach(delay => {
    const osc = ctx.createOscillator();
    const wGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, startTime + delay);
    osc.frequency.exponentialRampToValueAtTime(2600, startTime + delay + 0.15);
    osc.frequency.exponentialRampToValueAtTime(1900, startTime + delay + 0.35);

    wGain.gain.setValueAtTime(0.001, startTime + delay);
    wGain.gain.linearRampToValueAtTime(0.12, startTime + delay + 0.05);
    wGain.gain.exponentialRampToValueAtTime(0.0001, startTime + delay + 0.35);

    osc.connect(wGain);
    wGain.connect(destination);

    osc.start(startTime + delay);
    osc.stop(startTime + delay + 0.38);
  });
}

function playBellPulse(
  ctx: AudioContext,
  destination: GainNode,
  startTime: number,
  freqFundamental: number,
  freqHarmonic: number,
  waveType: OscillatorType,
  gainLevel: number,
  durationSec: number
) {
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = waveType;
  osc1.frequency.setValueAtTime(freqFundamental, startTime);
  osc1.frequency.exponentialRampToValueAtTime(freqFundamental * 0.992, startTime + durationSec);

  gain1.gain.setValueAtTime(0.001, startTime);
  gain1.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  osc1.connect(gain1);
  gain1.connect(destination);

  osc1.start(startTime);
  osc1.stop(startTime + durationSec + 0.05);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freqHarmonic, startTime);

  gain2.gain.setValueAtTime(0.001, startTime);
  gain2.gain.linearRampToValueAtTime(gainLevel * 0.6, startTime + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + (durationSec * 0.85));

  osc2.connect(gain2);
  gain2.connect(destination);

  osc2.start(startTime);
  osc2.stop(startTime + durationSec + 0.05);
}
