import { useState, useEffect, useCallback } from "react";

export const VOICE_SAMPLE_TEXT =
  "Hello! Thank you for calling. I'm your AI receptionist, here to help you schedule appointments, answer questions, and connect you with the right team. How can I assist you today?";

export const VOICE_SAMPLE_DURATION_S = 14;

function getLangCode(language: string, accent: string): string {
  if (language === "English") {
    const codes: Record<string, string> = {
      American:   "en-US",
      British:    "en-GB",
      Scottish:   "en-GB",
      Indian:     "en-IN",
      Australian: "en-AU",
      African:    "en-ZA",
    };
    return codes[accent] ?? "en-US";
  }
  return "en-US";
}

const FEMALE_HINTS = ["samantha", "victoria", "karen", "moira", "veena", "fiona", "tessa", "female", "zira", "hazel", "google uk english female"];
const MALE_HINTS   = ["alex", "daniel", "david", "james", "fred", "lee", "rishi", "male", "mark", "oliver", "tom"];

function pickBrowserVoice(
  voices: SpeechSynthesisVoice[],
  langCode: string,
  gender: string,
): SpeechSynthesisVoice | null {
  const exact   = voices.filter((v) => v.lang === langCode);
  const broader = voices.filter((v) => v.lang.startsWith(langCode.split("-")[0]));
  const pool    = exact.length ? exact : broader.length ? broader : voices.filter((v) => v.lang.startsWith("en"));
  if (!pool.length) return voices[0] ?? null;

  if (gender === "Female") {
    const match = pool.find((v) => FEMALE_HINTS.some((h) => v.name.toLowerCase().includes(h)));
    if (match) return match;
  } else if (gender === "Male") {
    const match = pool.find((v) => MALE_HINTS.some((h) => v.name.toLowerCase().includes(h)));
    if (match) return match;
  }

  return pool[0];
}

export type PlayVoiceParams = {
  id: string;
  language: string;
  accent: string;
  gender: string;
  speed?: number;
  /** Override the default sample text for this play call. */
  sampleText?: string;
};

export type VoiceSpeechHandle = {
  playingId: string | null;
  play: (params: PlayVoiceParams) => void;
  stop: () => void;
};

export function useVoiceSpeech(): VoiceSpeechHandle {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis?.getVoices() ?? [];
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setPlayingId(null);
  }, []);

  const play = useCallback(
    ({ id, language, accent, gender, speed = 1.0, sampleText }: PlayVoiceParams) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const utterance  = new SpeechSynthesisUtterance(sampleText ?? VOICE_SAMPLE_TEXT);
      const langCode   = getLangCode(language, accent);
      const voice      = pickBrowserVoice(voices, langCode, gender);

      if (voice) utterance.voice = voice;
      utterance.rate    = Math.max(0.1, Math.min(10, speed));
      utterance.onstart = () => setPlayingId(id);
      utterance.onend   = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    },
    [voices],
  );

  return { playingId, play, stop };
}
