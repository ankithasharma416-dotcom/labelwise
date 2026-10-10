"use client";

import { useState } from "react";

type PhotoStepProps = {
  selectedCrop: string;
  onAnalyze: (file: File) => void;
};

export default function PhotoStep({
  selectedCrop,
  onAnalyze,
}: PhotoStepProps) {
  const [file, setFile] = useState<File | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  return (
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

      <h2 className="text-xl font-semibold text-gray-900">
        Take a photo of the label
      </h2>

      <p className="mt-2 text-gray-600">
        Make sure the pesticide name, dose and waiting period are clearly visible.
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="mt-5 w-full rounded-xl border border-gray-300 p-3"
      />

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Selected: {file.name}
          </p>

          <button
            onClick={() => onAnalyze(file)}
            className="mt-4 w-full rounded-xl bg-green-700 px-4 py-3 font-semibold text-white"
          >
            Analyze Label
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        Selected crop: {selectedCrop}
      </p>

    </div>
  );
}