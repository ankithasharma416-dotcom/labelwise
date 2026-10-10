"use client";

import SpeakButton from "@/components/speakbutton";
import SourceTextToggle from "@/components/sourcetexttoggle";
import type { Language } from "@/library/i18n";
import { translations } from "@/library/i18n";

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
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-green-50 p-4">
        <p className="text-sm text-green-700">Product</p>
        <h2 className="text-2xl font-bold text-green-900">
          {productName}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {activeIngredient}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500">Crop</p>
        <p className="text-lg font-semibold">{cropName}</p>
      </div>

      <div className="mt-5 rounded-xl border border-green-200 p-4">
        <p className="text-sm text-gray-500">{t.amount}</p>
        <p className="mt-1 text-2xl font-bold text-green-800">
          {doseText}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm text-orange-700">{t.harvest}</p>
        <p className="mt-1 text-xl font-bold text-orange-900">
          {harvestDate}
        </p>
        <p className="mt-1 text-sm text-orange-800">
          {t.wait} {phiDays} {t.days}
        </p>
      </div>

      <p className="mt-5 text-sm text-gray-600">
        Follow all label precautions and protective equipment instructions.
        This result is based on the information read from the label.
      </p>

      <SpeakButton text={spokenText} language={language} />

      <SourceTextToggle text={sourceText} />
    </div>
  );
}