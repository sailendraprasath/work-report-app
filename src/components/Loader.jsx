export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-purple-900">
      <div className="relative">
        {/* Glow background */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-purple-600 rounded-full"></div>

        {/* Glass Card */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl text-center w-[280px]">
          {/* Animated Ring */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Pulse circle */}
            <div className="absolute w-16 h-16 rounded-full bg-purple-500/20 animate-ping"></div>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl font-semibold tracking-wide">
            Please wait
          </h2>

          {/* Animated dots */}
          <p className="text-gray-300 mt-2 flex justify-center gap-1">
            Loading
            <span className="animate-bounce">.</span>
            <span className="animate-bounce [animation-delay:0.2s]">.</span>
            <span className="animate-bounce [animation-delay:0.4s]">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
