import type { Language } from "./i18n";

const languageCodes: Record<Language, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Kannada: "kn-IN",
};

export function speak(
  text: string,
  language: Language
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = languageCodes[language];
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
}