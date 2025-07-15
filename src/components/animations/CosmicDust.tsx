import React from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

interface CosmicDustProps {
    particleCount?: number;
}

export const CosmicDust: React.FC<CosmicDustProps> = ({ particleCount = 30 }) => {
    const particles = React.useMemo(() =>
        Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 20 + 25,
            delay: Math.random() * 10
        })), [particleCount]
    );

    return (
        <>
            {particles.map((particle) => (
                <motion.div
                    key={`dust-${particle.id}`}
                    className="absolute rounded-full bg-purple-300 opacity-20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                        opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay
                    }}
                />
            ))}
        </>
    );
};
