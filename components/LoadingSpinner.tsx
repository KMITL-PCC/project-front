export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative size-12">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute left-[47%] top-0 h-[25%] w-[10%] animate-spinner rounded-full bg-orange-500"
            style={{
              transform: `rotate(${i * 30}deg) translateY(0)`,
              transformOrigin: "50% 200%",
              animationDelay: `${-1.1 + i * 0.083}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}