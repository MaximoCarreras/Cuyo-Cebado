import React from 'react';

const LogoCuyo = ({ className }) => {
    return (
        <svg
            viewBox="0 0 200 200"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Contenedor del Mate */}
            <path
                d="M60 120 C60 150 80 170 100 170 C120 170 140 150 140 120 C140 100 135 85 125 75 L100 50 L75 75 C65 85 60 100 60 120Z"
                fill="#D4A76A"
            />
            {/* Las Montañas de Cuyo */}
            <path
                d="M70 130 L90 105 L100 115 L115 95 L130 130 H70Z"
                fill="#3E2B1F"
                opacity="0.6"
            />
            {/* La Bombilla */}
            <path
                d="M110 60 L125 30"
                stroke="#D4A76A"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default LogoCuyo;