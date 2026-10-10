type CantReadStateProps = {
  message?: string;
  onRetry: () => void;
};

export default function CantReadState({
  message = "We could not safely read the label.",
  onRetry,
}: CantReadStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
      <h2 className="text-xl font-semibold text-yellow-900">
        Cannot safely read label
      </h2>

      <p className="mt-2 text-sm text-yellow-800">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-4 w-full rounded-xl bg-yellow-700 px-4 py-3 font-semibold text-white"
      >
        Take another photo
      </button>
    </div>
  );
}