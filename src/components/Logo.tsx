interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "full", className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { height: 32, iconSize: 24, fontSize: "text-base" },
    md: { height: 40, iconSize: 32, fontSize: "text-lg" },
    lg: { height: 56, iconSize: 48, fontSize: "text-2xl" },
  };

  const currentSize = sizes[size];

  if (variant === "icon") {
    return (
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>

        {/* Main Circle */}
        <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />

        {/* Palm Leaf - Tropical Element */}
        <path
          d="M24 14 C24 14, 20 18, 18 22 C16 26, 16 28, 16 28 M24 14 C24 14, 28 18, 30 22 C32 26, 32 28, 32 28"
          stroke="url(#accentGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Marketing Chart Bars */}
        <rect x="16" y="26" width="4" height="8" rx="1" fill="white" opacity="0.9" />
        <rect x="22" y="22" width="4" height="12" rx="1" fill="white" opacity="0.95" />
        <rect x="28" y="24" width="4" height="10" rx="1" fill="white" />

        {/* Automation Connection Dots */}
        <circle cx="18" cy="25" r="1.5" fill="#F59E0B" />
        <circle cx="24" cy="21" r="1.5" fill="#F59E0B" />
        <circle cx="30" cy="23" r="1.5" fill="#F59E0B" />
        
        {/* Connecting Lines */}
        <path
          d="M18 25 L24 21 L30 23"
          stroke="#F59E0B"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="accentGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>

        <circle cx="24" cy="24" r="22" fill="url(#logoGradientFull)" />

        <path
          d="M24 14 C24 14, 20 18, 18 22 C16 26, 16 28, 16 28 M24 14 C24 14, 28 18, 30 22 C32 26, 32 28, 32 28"
          stroke="url(#accentGradientFull)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        <rect x="16" y="26" width="4" height="8" rx="1" fill="white" opacity="0.9" />
        <rect x="22" y="22" width="4" height="12" rx="1" fill="white" opacity="0.95" />
        <rect x="28" y="24" width="4" height="10" rx="1" fill="white" />

        <circle cx="18" cy="25" r="1.5" fill="#F59E0B" />
        <circle cx="24" cy="21" r="1.5" fill="#F59E0B" />
        <circle cx="30" cy="23" r="1.5" fill="#F59E0B" />
        
        <path
          d="M18 25 L24 21 L30 23"
          stroke="#F59E0B"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className={`font-bold text-foreground ${currentSize.fontSize}`}>
          TropiMarketing
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          AutoMarketing Local
        </span>
      </div>
    </div>
  );
}
