import React from 'react';
import { motion } from 'framer-motion';

interface NebulaEffectProps {
    isDarkMode: boolean;
}

export const NebulaEffect: React.FC<NebulaEffectProps> = ({ isDarkMode }) => {
    if (!isDarkMode) {
        return (
            <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                    background: [
                        'radial-gradient(ellipse at 30% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 60%)',
                        'radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 60%)',
                        'radial-gradient(ellipse at 20% 60%, rgba(196, 181, 253, 0.4) 0%, transparent 60%)',
                        'radial-gradient(ellipse at 30% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 60%)'
                    ]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        );
    }

    return (
        <>
            {/* Nebula Effect with Fade */}
            <motion.div
                className="absolute inset-0 opacity-40"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
                        'radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.3) 0%, transparent 60%)',
                        'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)',
                        'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%)'
                    ]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Additional Fade Layer for Depth */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
                animate={{
                    opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </>
    );
};
