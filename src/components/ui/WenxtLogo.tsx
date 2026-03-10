const WenxtLogo = ({ className }: { className?: string }) => (
    <svg 
        className={className} 
        width="400" 
        height="300" 
        viewBox="0 0 400 300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="wenxt_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00CBD1" />
                <stop offset="100%" stopColor="#00E676" />
            </linearGradient>
        </defs>

        <path 
            d="M60 80L110 210L160 100L210 210L260 90L340 70C330 110 300 160 270 230L210 330L140 160L80 280L60 80Z"
            fill="url(#wenxt_grad)" 
        />

        <text 
            x="200" 
            y="240" 
            textAnchor="middle" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="54" 
            fill="#0072BC" 
            letterSpacing="2"
        >
            WENXT
        </text>

        <text 
            x="200" 
            y="280" 
            textAnchor="middle" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="500" 
            fontSize="26" 
            fill="#00A896" 
            letterSpacing="3"
        >
            Technologies
        </text>
    </svg>
);

export default WenxtLogo;