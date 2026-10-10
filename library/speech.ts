import type { Language } from "./i18n";

const languageCodes: Record<Language, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Kannada: "kn-IN",
};

function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function normalize(lang: string): string {
  return lang.toLowerCase().replace("_", "-");
}

function findVoice(language: Language): SpeechSynthesisVoice | null {
  const code = normalize(languageCodes[language]);
  const prefix = code.split("-")[0];
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((v) => normalize(v.lang) === code) ??
    voices.find((v) => normalize(v.lang).startsWith(prefix)) ??
    null
  );
}

/**
 * True if the device has a voice for this language.
 * If the browser hasn't loaded its voice list yet, we assume yes.
 */
export function isVoiceAvailable(language: Language): boolean {
  if (!canSpeak()) {
    return false;
  }

  const voices = window.speechSynthesis.getVoices();

  if (voices.length === 0) {
    return true;
  }

  return findVoice(language) !== null;
}

export function speak(text: string, language: Language): boolean {
  if (!canSpeak() || !isVoiceAvailable(language)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findVoice(language);

  if (voice) {
    utterance.voice = voice;
  }

  utterance.lang = languageCodes[language];
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (!canSpeak()) {
    return;
  }

  window.speechSynthesis.cancel();
}