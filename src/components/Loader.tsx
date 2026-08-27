import React, { FC } from "react";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const LoaderComponent: FC<LoaderProps> = ({
  message = "Loading data...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen
          ? "fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm"
          : "min-h-[250px] w-full"
      }`}
    >
      {/* Outer Pulse Glow & Multi-layer Ring */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Glow */}
        <div className="absolute h-16 w-16 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />

        {/* Outer Background Track */}
        <div className="h-12 w-12 rounded-full border-2 border-neutral-800" />

        {/* Primary Spinning Ring */}
        <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400/50" />

        {/* Inner Counter-spinning Accent */}
        <div className="absolute h-6 w-6 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-emerald-300" />
      </div>

      {/* Loading Label */}
      {message && (
        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoaderComponent;