export const IconOnly = ({ className = "w-8 h-8" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 64 64" 
    className={className}
    fill="none"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="bridgeGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="18" r="6" stroke="#2563eb" />
    <path d="M 10 38 C 10 28, 30 28, 30 38" stroke="#2563eb" />
    <circle cx="44" cy="18" r="6" stroke="#16a34a" />
    <path d="M 34 38 C 34 28, 54 28, 54 38" stroke="#16a34a" />
    <path d="M 6 52 Q 32 40 58 52" stroke="url(#bridgeGradient)" strokeWidth="5" />
    <path d="M 20 47 L 20 60" stroke="#2563eb" />
    <path d="M 44 47 L 44 60" stroke="#16a34a" />
  </svg>
);

export const FullLogo = ({ iconClassName = "w-10 h-10", showTagline = true }) => (
  <div className="flex items-center gap-3">
    <IconOnly className={iconClassName} />
    <div>
      <h1 className="text-2xl tracking-tight leading-none">
        <span className="font-bold text-[#2563eb]">Donate</span>
        <span className="font-light text-[#16a34a]">Bridge</span>
      </h1>
      {showTagline && (
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Connecting Donors with NGOs</p>
      )}
    </div>
  </div>
);
