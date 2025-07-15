import React from 'react';
import { motion } from 'framer-motion';

interface Cloud {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

interface CloudFieldProps {
    cloudCount?: number;
}

export const CloudField: React.FC<CloudFieldProps> = ({ cloudCount = 8 }) => {
    const clouds = React.useMemo(() =>
        Array.from({ length: cloudCount }, (_, i) => ({
            id: i,
            x: Math.random() * 150 - 50, // Start between -50 and 100 (some off-screen)
            y: Math.random() * 100,
            size: Math.random() * 40 + 30, // 30-70px
            duration: Math.random() * 15 + 20, // 20-35 seconds
            delay: Math.random() * 10
        })), [cloudCount]
    );

    return (
        <>
            {clouds.map((cloud) => (
                <motion.div
                    key={`cloud-${cloud.id}`}
                    className="absolute opacity-60"
                    style={{
                        top: `${cloud.y}%`,
                        left: `${cloud.x}%`,
                    }}
                    animate={{
                        x: [0, window.innerWidth + cloud.size * 2],
                        y: [0, -10, 10, 0],
                    }}
                    transition={{
                        x: {
                            duration: cloud.duration,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        y: {
                            duration: cloud.duration / 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    {/* Cloud made of overlapping circles */}
                    <div className="relative">
                        {/* Main cloud body */}
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: cloud.size,
                                height: cloud.size * 0.6,
                                left: 0,
                                top: cloud.size * 0.2
                            }}
                        />
                        {/* Left puff */}
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: cloud.size * 0.7,
                                height: cloud.size * 0.7,
                                left: cloud.size * -0.3,
                                top: cloud.size * 0.1
                            }}
                        />
                        {/* Right puff */}
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: cloud.size * 0.8,
                                height: cloud.size * 0.8,
                                left: cloud.size * 0.4,
                                top: cloud.size * 0.05
                            }}
                        />
                        {/* Top center puff */}
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: cloud.size * 0.5,
                                height: cloud.size * 0.5,
                                left: cloud.size * 0.25,
                                top: cloud.size * -0.1
                            }}
                        />
                        {/* Bottom smoothing puff */}
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: cloud.size * 0.4,
                                height: cloud.size * 0.3,
                                left: cloud.size * 0.3,
                                top: cloud.size * 0.4
                            }}
                        />
                    </div>
                </motion.div>
            ))}
        </>
    );
};
