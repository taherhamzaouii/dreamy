import React from 'react';
import { motion } from 'framer-motion';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    twinkleDelay: number;
    opacity: number;
}

interface StarFieldProps {
    starCount?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ starCount = 15 }) => {
    const stars = React.useMemo(() =>
        Array.from({ length: starCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            twinkleDelay: Math.random() * 4,
            opacity: Math.random() * 0.8 + 0.2
        })), [starCount]
    );

    return (
        <>
            {stars.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                    }}
                    animate={{
                        opacity: [star.opacity, star.opacity * 0.2, star.opacity],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.twinkleDelay
                    }}
                >
                    <svg
                        width={star.size * 12}
                        height={star.size * 12}
                        viewBox="0 0 24 24"
                        className="text-white drop-shadow-lg"
                        style={{
                            filter: `drop-shadow(0 0 ${star.size * 3}px rgba(255, 255, 255, 0.6))`
                        }}
                    >
                        <path
                            d="M12 1 C16 8, 16 8, 23 12 C16 16, 16 16, 12 23 C8 16, 8 16, 1 12 C8 8, 8 8, 12 1 Z"
                            fill="currentColor"
                        />
                    </svg>
                </motion.div>
            ))}
        </>
    );
};
