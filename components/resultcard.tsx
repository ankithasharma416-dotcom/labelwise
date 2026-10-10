"use client";

import { useEffect, useState } from "react";

import SpeakButton from "@/components/speakbutton";
import SourceTextToggle from "@/components/sourcetexttoggle";
import type { Language } from "@/library/i18n";
import { translations } from "@/library/i18n";
import { isVoiceAvailable } from "@/library/speech";

type ResultCardProps = {
  productName: string;
  activeIngredient: string;
  cropName: string;
  doseMin: number;
  doseMax: number;
  doseUnit: string;
  harvestDate: string;
  phiDays: number;
  language: Language;
  sourceText: string;
};

export default function ResultCard({
  productName,
  activeIngredient,
  cropName,
  doseMin,
  doseMax,
  doseUnit,
  harvestDate,
  phiDays,
  language,
  sourceText,
}: ResultCardProps) {
  const t = translations[language];

  const [voiceMissing, setVoiceMissing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceMissing(true);
      return;
    }

    const check = () => setVoiceMissing(!isVoiceAvailable(language));

    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", check);
    };
  }, [language]);

  const doseText =
    doseMin === doseMax
      ? `${doseMin} ${doseUnit}`
      : `${doseMin}–${doseMax} ${doseUnit}`;

  const spokenText = [
    `${t.amount}: ${doseText}.`,
    `${t.harvest}: ${harvestDate}.`,
    `${t.wait} ${phiDays} ${t.days}`,
  ].join(" ");

  return (
    <div className="mt-6 rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
      <div className="rounded-lg bg-green-950 p-4 text-white">
        <p className="text-sm text-green-200">{t.product}</p>
        <h2 className="text-2xl font-bold">{productName}</h2>
        <p className="mt-1 text-sm text-green-100">{activeIngredient}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-stone-500">{t.crop}</p>
        <p className="text-lg font-bold text-stone-900">{cropName}</p>
      </div>

      <div className="mt-5 rounded-lg border-2 border-green-900 p-4">
        <p className="text-sm font-semibold text-stone-600">{t.amount}</p>
        <p className="mt-1 text-3xl font-extrabold text-green-900">
          {doseText}
        </p>
      </div>

      <div className="mt-5 rounded-lg bg-amber-400 p-4 text-stone-900">
        <p className="text-sm font-semibold">{t.harvest}</p>
        <p className="mt-1 text-2xl font-extrabold">{harvestDate}</p>
        <p className="mt-1 text-sm">
          {t.wait} {phiDays} {t.days}
        </p>
      </div>

      <p className="mt-5 text-sm text-stone-600">{t.followLabel}</p>

      {voiceMissing ? (
        <p className="mt-4 rounded-lg bg-stone-100 p-3 text-sm text-stone-700">
          {t.noVoice}
        </p>
      ) : (
        <SpeakButton text={spokenText} language={language} />
      )}

      <SourceTextToggle text={sourceText} />
    </div>
  );
}