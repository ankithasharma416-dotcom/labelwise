type BannedWarningProps = {
  activeIngredient: string;
  message: string;
};

export default function BannedWarning({
  activeIngredient,
  message,
}: BannedWarningProps) {
  return (
    <div className="mt-8 rounded-2xl border border-red-300 bg-red-50 p-5">
      <h2 className="text-xl font-bold text-red-900">
        Safety warning
      </h2>

      <p className="mt-2 text-red-800">
        {message}
      </p>

      <p className="mt-4 text-sm text-red-700">
        Active ingredient: {activeIngredient}
      </p>

      <p className="mt-3 text-sm font-semibold text-red-800">
        No spray amount has been calculated.
      </p>
    </div>
  );
}