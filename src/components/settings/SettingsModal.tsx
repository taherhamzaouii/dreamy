import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';
import { mistralService } from '../../services/mistralService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { isDarkMode } = useThemeStore();
    const [apiKey, setApiKey] = useState('');
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load existing API key when modal opens
            const existingKey = mistralService.getApiKey();
            if (existingKey) {
                setApiKey(existingKey);
            }
        }
    }, [isOpen]);

    const handleTestConnection = async () => {
        if (!apiKey.trim()) return;

        setIsTestingConnection(true);
        setConnectionStatus('idle');

        try {
            // Temporarily set the API key for testing
            const originalKey = mistralService.getApiKey();
            mistralService.setApiKey(apiKey.trim());

            const isConnected = await mistralService.testConnection();

            if (isConnected) {
                setConnectionStatus('success');
            } else {
                setConnectionStatus('error');
                // Restore original key if test failed
                if (originalKey) {
                    mistralService.setApiKey(originalKey);
                }
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            setConnectionStatus('error');
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            if (apiKey.trim()) {
                mistralService.setApiKey(apiKey.trim());
            }

            // Close modal after saving
            setTimeout(() => {
                setIsSaving(false);
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error saving settings:', error);
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setConnectionStatus('idle');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    className={`relative w-full max-w-md rounded-2xl backdrop-blur-md border p-6 ${isDarkMode
                        ? 'bg-slate-900/90 border-white/20 text-white'
                        : 'bg-white/90 border-purple-500/30 text-purple-900'
                        }`}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Settings</h2>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode
                                ? 'hover:bg-white/10'
                                : 'hover:bg-purple-500/10'
                                }`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* API Key Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mistral AI API Key
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Mistral API key..."
                                className={`w-full p-3 rounded-lg backdrop-blur-md border transition-all duration-300 ${isDarkMode
                                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40'
                                    : 'bg-white/30 border-white/50 text-purple-900 placeholder-purple-700/50 focus:border-purple-500/60'
                                    }`}
                            />
                            <p className={`text-xs mt-2 opacity-60`}>
                                Get your API key from{' '}
                                <a
                                    href="https://console.mistral.ai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:opacity-80"
                                >
                                    Mistral AI Console
                                </a>
                            </p>
                        </div>

                        {/* Test Connection */}
                        <div className="flex items-center space-x-3">
                            <motion.button
                                onClick={handleTestConnection}
                                disabled={!apiKey.trim() || isTestingConnection}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${!apiKey.trim() || isTestingConnection
                                    ? 'opacity-50 cursor-not-allowed'
                                    : isDarkMode
                                        ? 'bg-blue-600/30 border border-blue-400/50 text-blue-300 hover:bg-blue-600/50'
                                        : 'bg-blue-500/20 border border-blue-500/50 text-blue-700 hover:bg-blue-500/30'
                                    }`}
                                whileHover={!apiKey.trim() || isTestingConnection ? {} : { scale: 1.05 }}
                                whileTap={!apiKey.trim() || isTestingConnection ? {} : { scale: 0.95 }}
                            >
                                {isTestingConnection ? (
                                    <div className="flex items-center space-x-2">
                                        <motion.div
                                            className="w-3 h-3 border border-current border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <span>Testing...</span>
                                    </div>
                                ) : (
                                    'Test Connection'
                                )}
                            </motion.button>

                            {/* Connection Status */}
                            {connectionStatus === 'success' && (
                                <div className="flex items-center space-x-1 text-green-500 text-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Connected</span>
                                </div>
                            )}

                            {connectionStatus === 'error' && (
                                <div className="flex items-center space-x-1 text-red-500 text-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>Failed</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className={`p-3 rounded-lg ${isDarkMode
                            ? 'bg-blue-600/10 border border-blue-400/20'
                            : 'bg-blue-500/10 border border-blue-500/20'
                            }`}>
                            <p className="text-xs opacity-80">
                                💡 Without an API key, the app will use mock images for development.
                                Add your Mistral API key to generate real AI artwork from your dreams.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 mt-6">
                        <motion.button
                            onClick={handleClose}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isDarkMode
                                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                : 'bg-purple-500/20 border border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>

                        <motion.button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isSaving
                                ? 'opacity-50 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                            whileHover={isSaving ? {} : { scale: 1.02 }}
                            whileTap={isSaving ? {} : { scale: 0.98 }}
                        >
                            {isSaving ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <motion.div
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Save'
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
