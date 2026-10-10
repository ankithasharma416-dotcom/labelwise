"use client";

import type { Language } from "@/library/i18n";
import { speak, stopSpeaking } from "@/library/speech";

type SpeakButtonProps = {
  text: string;
  language: Language;
};

export default function SpeakButton({
  text,
  language,
}: SpeakButtonProps) {
  return (
    <div className="mt-5 flex gap-3">
      <button
        onClick={() => speak(text, language)}
        className="flex-1 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white"
      >
        🔊 Listen
      </button>

      <button
        onClick={stopSpeaking}
        className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700"
      >
        Stop
      </button>
    </div>
  );
}