export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <span className="text-lg">⚠️</span>
      <div>
        <p className="text-sm font-medium text-red-800">Something went wrong</p>
        <p className="mt-0.5 text-sm text-red-600">{message}</p>
      </div>
    </div>
  );
}