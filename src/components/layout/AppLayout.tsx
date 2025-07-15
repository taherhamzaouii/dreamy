import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';
import { SettingsModal } from '../settings/SettingsModal';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { isDarkMode, toggleTheme } = useThemeStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className={`relative transition-all duration-1000 font-dm-sans ${isDarkMode
            ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white'
            : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 text-purple-900'
            }`}>

            {/* Top Right Button Group */}
            <div className="fixed top-8 right-8 flex space-x-3 z-50">
                {/* Settings Button */}
                <motion.button
                    onClick={() => setIsSettingsOpen(true)}
                    className={`p-3 rounded-md backdrop-blur-md border transition-all duration-300 ${isDarkMode
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </motion.button>

                {/* Theme Toggle Button */}
                <motion.button
                    onClick={toggleTheme}
                    className={`p-3 rounded-md backdrop-blur-md border transition-all duration-300 ${isDarkMode
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isDarkMode ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    )}
                </motion.button>
            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Page Content */}
            {children}
        </div>
    );
};
