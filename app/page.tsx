"use client";

import { useState } from "react";

import PhotoStep from "@/components/photostep";
import TankDateStep from "@/components/tankdatestep";
import ResultCard from "@/components/resultcard";
import CantReadState from "@/components/cantreadstate";
import BannedWarning from "@/components/bannedwarning";

import {
  calculateDoseRange,
  calculateHarvestDate,
} from "@/library/calc";

import type { Language } from "@/library/i18n";
import { translations } from "@/library/i18n";

const cropIds = [
  "tomato",
  "chilli",
  "brinjal",
  "okra",
  "cabbage",
  "potato",
  "onion",
  "cotton",
  "other",
] as const;

type AnalysisResult =
  | {
      status: "ok";
      productName: string;
      activeIngredient: string;
      cropName: string;
      doseMin: number;
      doseMax: number;
      doseUnit: string;
      harvestDate: string;
      phiDays: number;
      sourceText: string;
    }
  | {
      status: "banned";
      activeIngredient: string;
      message: string;
    };

/**
 * Shrinks a photo in the browser before upload.
 * Keeps requests under Vercel's ~4.5 MB body limit
 * and makes Gemini calls faster.
 * Falls back to the original file if anything fails.
 */
async function shrinkImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8)
    );
    if (!blob) return file;

    return new File([blob], "label.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [language, setLanguage] = useState<Language>("English");
  const [photo, setPhoto] = useState<File | null>(null);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  async function handleAnalyze(tankLitres: number, sprayDate: string) {
    if (!photo) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const upload = await shrinkImage(photo);

      const formData = new FormData();
      formData.append("image", upload);
      formData.append("selectedCrop", selectedCrop);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "banned") {
        setResult({
          status: "banned",
          activeIngredient: data.activeIngredient,
          message: data.message,
        });
        setStep(5);
        return;
      }

      if (data.status === "crop_not_labeled") {
        setError(t.cropNotListed);
        setStep(6);
        return;
      }

      if (data.status === "cant_read") {
        setError(t.cannotRead);
        setStep(6);
        return;
      }

      if (!response.ok || data.status !== "ok") {
        console.error("API status:", response.status);
        console.error("API response:", data);

        throw new Error(
          data.message ||
            data.reason ||
            `Analysis failed with status ${response.status}.`
        );
      }

      const entry = data.entry;

      if (
        entry.dose_unit !== "ml_per_litre" &&
        entry.dose_unit !== "g_per_litre"
      ) {
        setError(t.unitNotSupported);
        setStep(6);
        return;
      }

      const dose = calculateDoseRange(
        entry.dose_min,
        entry.dose_max,
        tankLitres,
        entry.dose_unit
      );

      const harvestDate = calculateHarvestDate(
        sprayDate,
        entry.phi_days
      );

      setResult({
        status: "ok",
        productName: data.label.product_name.value,
        activeIngredient: data.label.active_ingredient.value,
        cropName: entry.crop_label_text,
        doseMin: dose.min,
        doseMax: dose.max,
        doseUnit: dose.unit,
        harvestDate,
        phiDays: entry.phi_days,
        sourceText: [
          data.label.product_name.source_text,
          data.label.active_ingredient.source_text,
          entry.dose_source_text,
          entry.phi_source_text,
          ...data.label.ppe.map(
            (item: { source_text: string }) => item.source_text
          ),
          ...data.label.warnings.map(
            (item: { source_text: string }) => item.source_text
          ),
        ]
          .filter(Boolean)
          .join("\n"),
      });

      setStep(5);
    } catch (err) {
      console.error(err);
      setError(t.analyzeFailed);
      setStep(6);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7]">
      <header className="bg-green-950 px-5 py-6 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight">
            LabelWise
          </h1>
          <p className="mt-2 text-sm text-green-100">{t.tagline}</p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pb-10">
        {step === 1 && (
          <div className="mt-6 rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900">
              {t.chooseLanguage}
            </h2>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="mt-3 w-full rounded-lg border-2 border-stone-300 p-3 text-stone-900 focus:border-green-900 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी</option>
              <option value="Kannada">ಕನ್ನಡ</option>
            </select>

            <h2 className="mt-6 text-xl font-bold text-stone-900">
              {t.chooseCrop}
            </h2>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="mt-3 w-full rounded-lg border-2 border-stone-300 p-3 text-stone-900 focus:border-green-900 focus:outline-none"
            >
              <option value="">{t.selectCrop}</option>
              {cropIds.map((id) => (
                <option key={id} value={id}>
                  {t.crops[id]}
                </option>
              ))}
            </select>

            <button
              disabled={!selectedCrop}
              onClick={() => setStep(2)}
              className="mt-6 w-full rounded-lg bg-green-900 px-4 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
            >
              {t.continue}
            </button>
          </div>
        )}

        {step === 2 && (
          <PhotoStep
            selectedCrop={selectedCrop}
            onAnalyze={(file) => {
              setPhoto(file);
              setStep(3);
            }}
          />
        )}

        {step === 3 && !loading && (
          <TankDateStep language={language} onSubmit={handleAnalyze} />
        )}

        {loading && (
          <div className="mt-6 rounded-xl border border-stone-300 bg-white p-5 text-center shadow-sm">
            <p className="font-bold text-stone-900">{t.reading}</p>
          </div>
        )}

        {step === 5 && result?.status === "ok" && (
          <ResultCard
            productName={result.productName}
            activeIngredient={result.activeIngredient}
            cropName={result.cropName}
            doseMin={result.doseMin}
            doseMax={result.doseMax}
            doseUnit={result.doseUnit}
            harvestDate={result.harvestDate}
            phiDays={result.phiDays}
            language={language}
            sourceText={result.sourceText}
          />
        )}

        {step === 5 && result?.status === "banned" && (
          <BannedWarning
            activeIngredient={result.activeIngredient}
            message={result.message}
          />
        )}

        {step === 6 && !loading && (
          <CantReadState
            message={error}
            onRetry={() => {
              setError("");
              setStep(2);
            }}
          />
        )}
      </main>
    </div>
  );
}