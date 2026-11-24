import React from 'react';

const Logo = ({ width = 150, showText = true }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${width}px` }}>
      <svg 
        viewBox="0 0 200 120" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        <g stroke="#000" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* Back/Outer Petals */}
          <path d="M100 110 C40 110, 10 70, 10 50 C30 70, 60 80, 100 110" fill="#f48fb1" />
          <path d="M100 110 C160 110, 190 70, 190 50 C170 70, 140 80, 100 110" fill="#f48fb1" />
          
          <path d="M100 110 C50 90, 20 40, 40 20 C60 40, 80 70, 100 110" fill="#f06292" />
          <path d="M100 110 C150 90, 180 40, 160 20 C140 40, 120 70, 100 110" fill="#f06292" />

          {/* Central Petal */}
          <path d="M100 110 C80 60, 80 20, 100 5 C120 20, 120 60, 100 110" fill="#ec407a" />
          
          {/* Inner Geometric Lines */}
          <path d="M100 110 L100 5" fill="none" />
          <path d="M100 110 L40 20" fill="none" />
          <path d="M100 110 L160 20" fill="none" />
          <path d="M100 110 L10 50" fill="none" />
          <path d="M100 110 L190 50" fill="none" />
          
          {/* Cross lines for geometric effect */}
          <path d="M100 60 L60 50 L40 20" fill="none" />
          <path d="M100 60 L140 50 L160 20" fill="none" />
          <path d="M100 40 L70 30" fill="none" />
          <path d="M100 40 L130 30" fill="none" />
          <path d="M60 80 L25 60" fill="none" />
          <path d="M140 80 L175 60" fill="none" />
        </g>
      </svg>
      {showText && (
        <span style={{ 
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '800',
          fontSize: `${width * 0.22}px`, 
          color: '#000', 
          marginTop: '-10px',
          letterSpacing: '-0.5px'
        }}>
          narishakti
        </span>
      )}
    </div>
  );
};

export default Logo;
