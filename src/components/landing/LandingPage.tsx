import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { StarField } from '../animations/StarField';
import { CosmicDust } from '../animations/CosmicDust';
import { CloudField } from '../animations/CloudField';
import { NebulaEffect } from '../animations/NebulaEffect';

export const LandingPage: React.FC = () => {
    const { isDarkMode, toggleTheme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 font-dm-sans ${isDarkMode
            ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
            }`}>

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

            {/* Theme Toggle Button */}
            <motion.button
                onClick={toggleTheme}
                className={`fixed top-8 right-8 p-4 rounded-full backdrop-blur-md border transition-all duration-300 ${isDarkMode
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isDarkMode ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                )}
            </motion.button>

            {/* Start Journaling Button */}
            <motion.button
                onClick={() => navigate('/calendar')}
                className={`fixed bottom-8 right-8 px-6 py-3 rounded-full backdrop-blur-md border font-medium ${isDarkMode
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
                        <span className={`transition-colors duration-1000 ${isDarkMode ? 'text-white' : 'text-pink-600'
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
