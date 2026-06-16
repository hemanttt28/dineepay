export default function ColaCup({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="cupGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#D93025" />
                    <stop offset="1" stopColor="#8B0000" />
                </linearGradient>
                <linearGradient id="lidGradient" x1="100" y1="0" x2="100" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#EEEEEE" />
                    <stop offset="1" stopColor="#BDBDBD" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Straw */}
            <path d="M120 40 L160 -20 L150 -30 L105 40 Z" fill="#FFC107" />

            {/* Cup Body */}
            <path
                d="M40 60 L60 380 C62 390 70 400 100 400 C130 400 138 390 140 380 L160 60 Z"
                fill="url(#cupGradient)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
            />

            {/* Lid */}
            <path
                d="M30 60 L170 60 L165 30 C165 20 160 10 100 10 C40 10 35 20 35 30 L30 60 Z"
                fill="url(#lidGradient)"
            />

            {/* Branding */}
            <text
                x="100"
                y="220"
                textAnchor="middle"
                fill="white"
                fontSize="40"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                transform="rotate(-5 100 220)"
                style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))" }}
            >
                COLA
            </text>

            {/* Highlights/Reflections for 3D effect */}
            <path
                d="M50 70 L65 370"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.3"
            />
            <ellipse cx="100" cy="35" rx="60" ry="15" fill="white" opacity="0.1" />
        </svg>
    );
}
