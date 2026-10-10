"use client";

import { useState } from "react";

type TankDateStepProps = {
  onSubmit: (tankLitres: number, sprayDate: string) => void;
};

export default function TankDateStep({
  onSubmit,
}: TankDateStepProps) {
  const [tankLitres, setTankLitres] = useState("");
  const [sprayDate, setSprayDate] = useState("");

  const tank = Number(tankLitres);

  const valid =
    tank >= 1 &&
    tank <= 200 &&
    sprayDate !== "";

  return (
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

      <h2 className="text-xl font-semibold text-gray-900">
        Enter spray details
      </h2>

      <label className="mt-5 block text-sm font-medium text-gray-700">
        Tank size (litres)
      </label>

      <input
        type="number"
        min="1"
        max="200"
        value={tankLitres}
        onChange={(e) => setTankLitres(e.target.value)}
        placeholder="Example: 15"
        className="mt-2 w-full rounded-xl border border-gray-300 p-3"
      />

      <label className="mt-5 block text-sm font-medium text-gray-700">
        Spray date
      </label>

      <input
        type="date"
        value={sprayDate}
        onChange={(e) => setSprayDate(e.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-300 p-3"
      />

      <button
        disabled={!valid}
        onClick={() => onSubmit(tank, sprayDate)}
        className="mt-6 w-full rounded-xl bg-green-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Analyze Label
      </button>

    </div>
  );
}