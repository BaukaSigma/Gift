import React from 'react';

export default function Background() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', backgroundColor: '#F49EBB' }}>
            <svg width="100%" height="100%">
                <defs>
                    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="60%" stopColor="#FFEAF2" />
                        <stop offset="100%" stopColor="#FFD3E2" />
                    </linearGradient>

                    {/* Solid 3D drop shadow instead of blurry gaussian drop shadow for clean look */}
                    <filter id="solidShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="3" dy="4" stdDeviation="0" floodColor="#D86386" floodOpacity="0.4" />
                    </filter>

                    <g id="heart">
                        {/* The white border and fill of the heart */}
                        <path
                            d="M 0 -15 C -15 -35 -40 -15 -20 5 L 0 25 L 20 5 C 40 -15 15 -35 0 -15 Z"
                            fill="url(#heartGrad)"
                            stroke="#FFFFFF"
                            strokeWidth="5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            filter="url(#solidShadow)"
                        />
                        {/* Glossy highlight */}
                        <path
                            d="M -15 -10 C -22 -20 -10 -25 -5 -18"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            opacity="0.9"
                        />
                        {/* Small dot highlight */}
                        <circle cx="8" cy="-14" r="2.5" fill="#FFFFFF" opacity="0.9" />
                    </g>

                    <g id="sparkle">
                        <path
                            d="M 0 -10 Q 0 0 -10 0 Q 0 0 0 10 Q 0 0 10 0 Q 0 0 0 -10 Z"
                            fill="#FFFFFF"
                            opacity="0.8"
                        />
                    </g>

                    {/* Increased pattern size to 800x600 to give lots of room. 
              Elements are kept carefully away from the X/Y borders to prevent clipping! */}
                    <pattern id="beautifulPattern" width="800" height="600" patternUnits="userSpaceOnUse">
                        {/* Beautiful smooth waves */}
                        <path d="M 0 100 Q 200 150 400 100 T 800 100 L 800 180 Q 600 230 400 180 T 0 180 Z" fill="#F9B2CB" opacity="0.6" />
                        <path d="M 0 350 Q 200 400 400 350 T 800 350 L 800 430 Q 600 480 400 430 T 0 430 Z" fill="#F9B2CB" opacity="0.6" />
                        <path d="M 0 600 Q 200 650 400 600 T 800 600 L 800 680 Q 600 730 400 680 T 0 680 Z" fill="#F9B2CB" opacity="0.6" />

                        {/* Tilted, puffy hearts positioned strictly inside [30, 770] x [30, 570] to avoid pattern edge clipping */}
                        <use href="#heart" transform="translate(100, 150) scale(1.4) rotate(-20)" />
                        <use href="#sparkle" transform="translate(180, 120) scale(1.2)" />
                        <use href="#sparkle" transform="translate(50, 200) scale(0.8)" />

                        <use href="#heart" transform="translate(550, 100) scale(1.8) rotate(15)" />
                        <use href="#sparkle" transform="translate(480, 70) scale(1.5)" />

                        <use href="#heart" transform="translate(350, 300) scale(1.2) rotate(-10)" />
                        <use href="#sparkle" transform="translate(410, 260) scale(1)" />
                        <use href="#sparkle" transform="translate(300, 350) scale(0.9)" />

                        <use href="#heart" transform="translate(150, 480) scale(1.6) rotate(25)" />
                        <use href="#sparkle" transform="translate(230, 440) scale(1.1)" />

                        <use href="#heart" transform="translate(650, 450) scale(1.3) rotate(-15)" />
                        <use href="#sparkle" transform="translate(730, 490) scale(1.3)" />
                        <use href="#sparkle" transform="translate(590, 400) scale(0.8)" />

                        {/* Fill empty spaces safely */}
                        <use href="#heart" transform="translate(350, 520) scale(0.9) rotate(35)" />
                        <use href="#heart" transform="translate(750, 250) scale(1) rotate(-30)" />
                    </pattern>
                </defs>

                {/* The rect covers the whole screen and is painted with the seamless pattern */}
                <rect width="100%" height="100%" fill="url(#beautifulPattern)" />
            </svg>
        </div>
    );
}
