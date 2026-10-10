"use client";

import { useState } from "react";

import type { Language } from "@/library/i18n";
import { translations } from "@/library/i18n";

type TankDateStepProps = {
  language: Language;
  onSubmit: (tankLitres: number, sprayDate: string) => void;
};

export default function TankDateStep({
  language,
  onSubmit,
}: TankDateStepProps) {
  const t = translations[language];

  const [tankLitres, setTankLitres] = useState("");
  const [sprayDate, setSprayDate] = useState("");

  const tank = Number(tankLitres);

  const valid = tank >= 1 && tank <= 200 && sprayDate !== "";

  return (
    <div className="mt-6 rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-stone-900">{t.enterSpray}</h2>

      <label className="mt-5 block text-sm font-semibold text-stone-700">
        {t.tankSize}
      </label>

      <input
        type="number"
        min="1"
        max="200"
        value={tankLitres}
        onChange={(e) => setTankLitres(e.target.value)}
        placeholder={t.tankPlaceholder}
        className="mt-2 w-full rounded-lg border-2 border-stone-300 p-3 text-stone-900 focus:border-green-900 focus:outline-none"
      />

      <label className="mt-5 block text-sm font-semibold text-stone-700">
        {t.sprayDate}
      </label>

      <input
        type="date"
        value={sprayDate}
        onChange={(e) => setSprayDate(e.target.value)}
        className="mt-2 w-full rounded-lg border-2 border-stone-300 p-3 text-stone-900 focus:border-green-900 focus:outline-none"
      />

      <button
        disabled={!valid}
        onClick={() => onSubmit(tank, sprayDate)}
        className="mt-6 w-full rounded-lg bg-green-900 px-4 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
      >
        {t.analyze}
      </button>
    </div>
  );
}