"use client";

import { useState } from "react";

type SourceTextToggleProps = {
  text: string;
};

export default function SourceTextToggle({
  text,
}: SourceTextToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-5">
      <button
        onClick={() => setShow(!show)}
        className="text-sm font-semibold text-green-700"
      >
        {show ? "Hide source text" : "Show source text"}
      </button>

      {show && (
        <div className="mt-3 rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-700">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}