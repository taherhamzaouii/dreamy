import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { StarField } from '../animations/StarField';
import { CosmicDust } from '../animations/CosmicDust';
import { CloudField } from '../animations/CloudField';
import { NebulaEffect } from '../animations/NebulaEffect';

export const LandingPage: React.FC = () => {
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Dark Mode Background Elements */}
            {isDarkMode && (
                <>
                    <StarField starCount={15} />
                    <CosmicDust particleCount={30} />
                </>
            )}

            {/* Light Mode Background Elements */}
            {!isDarkMode && (
                <CloudField cloudCount={8} />
            )}

            {/* Nebula/Gradient Effects */}
            <NebulaEffect isDarkMode={isDarkMode} />

            {/* Start Journaling Button */}
            <motion.button
                onClick={() => navigate('/calendar')}
                className={`fixed bottom-8 right-8 px-6 py-3 rounded-md backdrop-blur-md border font-medium ${isDarkMode
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                    }`}
                style={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
            >
                Start Journaling
            </motion.button>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen p-8">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.h1
                        className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-1000 ${isDarkMode ? 'text-white' : 'text-purple-900'
                            }`}
                        animate={{
                            scale: [1, 1.02, 1],
                            opacity: isDarkMode ? [1, 0.7, 1] : 1
                        }}
                        transition={{
                            scale: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            },
                            opacity: {
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        Transform your dreams
                        <br />
                        <span className={`transition-colors duration-1000 ${isDarkMode ? 'text-white' : 'text-purple-700'
                            }`}>
                            into visual stories
                        </span>
                    </motion.h1>

                    <motion.p
                        className={`text-lg md:text-xl mb-8 transition-colors duration-1000 ${isDarkMode ? 'text-white' : 'text-purple-700'
                            }`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isDarkMode ? [1, 0.6, 1] : 1
                        }}
                        transition={{
                            duration: 5,
                            delay: isDarkMode ? 1 : 1,
                            repeat: isDarkMode ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    >
                        Journal your dreams and watch AI transform them into stunning artwork.
                    </motion.p>

                </motion.div>
            </div>
        </div>
    );
};
