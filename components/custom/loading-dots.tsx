export default function LoadingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-fade animate-delay-[0ms]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-fade animate-delay-[750ms]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-fade animate-delay-[1500ms]" />
    </div>
  );
}
