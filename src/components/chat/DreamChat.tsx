import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useDreamStore } from '../../stores/dreamStore';
import { mistralService } from '../../services/mistralService';
import { format } from 'date-fns';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    imageUrl?: string;
    isGenerating?: boolean;
}

export const DreamChat: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();
    const { isDarkMode } = useThemeStore();
    const { addDream, updateDream, getDreamByDate } = useDreamStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentDreamId, setCurrentDreamId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Parse date from URL parameter
    const selectedDate = date ? new Date(date) : new Date();
    const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMessage: Message = {
            id: 'welcome',
            type: 'ai',
            content: `Hello! I'm Dreamy, your AI dream visualizer. I transform dreams into beautiful visual art. Share a dream with me from ${format(selectedDate, 'MMMM d, yyyy')}, and I'll bring it to life through imagery. What dream world shall we explore together?`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, [date]); // Use date string instead of selectedDate object

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isGenerating) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsGenerating(true);

        // Add generating message
        const generatingMessage: Message = {
            id: `generating-${Date.now()}`,
            type: 'ai',
            content: 'Creating your dream visualization...',
            timestamp: new Date(),
            isGenerating: true
        };

        setMessages(prev => [...prev, generatingMessage]);

        try {
            await generateDreamVisualization(userMessage.content);
        } catch (error) {
            console.error('Error generating dream:', error);
            // Remove generating message and show error
            setMessages(prev => prev.filter(msg => !msg.isGenerating));

            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                type: 'ai',
                content: 'Sorry, I encountered an error while creating your dream visualization. Please try again.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateDreamVisualization = async (dreamText: string) => {
        try {
            // Create or get existing dream entry
            let dreamId = currentDreamId;
            if (!dreamId) {
                // Create new dream entry
                addDream({
                    date: dateString,
                    dreamText: dreamText
                });

                // Get the newly created dream
                const newDream = getDreamByDate(dateString);
                if (newDream) {
                    dreamId = newDream.id;
                    setCurrentDreamId(dreamId);
                }
            }

            // Generate image using Mistral service (fallback to mock for development)
            let imageUrl: string;
            try {
                if (mistralService.hasApiKey()) {
                    imageUrl = await mistralService.generateDreamImage(dreamText);
                } else {
                    // Use mock image generation for development
                    imageUrl = await mistralService.generateMockImage(dreamText);
                }
            } catch (apiError) {
                console.warn('Mistral API failed, using mock image:', apiError);
                imageUrl = await mistralService.generateMockImage(dreamText);
            }

            // Remove generating message
            setMessages(prev => prev.filter(msg => !msg.isGenerating));

            // Add AI response with generated image
            const aiResponse: Message = {
                id: `ai-${Date.now()}`,
                type: 'ai',
                content: "Here's your dream visualization! I've captured the essence of your dream and transformed it into this beautiful artwork.",
                timestamp: new Date(),
                imageUrl: imageUrl
            };

            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            throw error; // Re-throw to be handled by the calling function
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleAcceptImage = (messageId: string) => {
        const message = messages.find(msg => msg.id === messageId);
        if (message && message.imageUrl && currentDreamId) {
            // Update the dream with the accepted image
            updateDream(currentDreamId, {
                imageUrl: message.imageUrl
            });

            // Navigate back to calendar
            navigate('/calendar');
        }
    };

    const handleRegenerateImage = async (messageId: string) => {
        const message = messages.find(msg => msg.id === messageId);
        if (!message || isGenerating) return;

        // Find the user message that prompted this image
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        let userPrompt = '';

        // Look backwards for the user message
        for (let i = messageIndex - 1; i >= 0; i--) {
            if (messages[i].type === 'user') {
                userPrompt = messages[i].content;
                break;
            }
        }

        if (!userPrompt) return;

        setIsGenerating(true);

        // Add generating message
        const generatingMessage: Message = {
            id: `regenerating-${Date.now()}`,
            type: 'ai',
            content: 'Regenerating your dream visualization...',
            timestamp: new Date(),
            isGenerating: true
        };

        setMessages(prev => [...prev, generatingMessage]);

        try {
            // Generate new image
            let imageUrl: string;
            try {
                if (mistralService.hasApiKey()) {
                    imageUrl = await mistralService.generateDreamImage(userPrompt);
                } else {
                    imageUrl = await mistralService.generateMockImage(userPrompt);
                }
            } catch (apiError) {
                console.warn('Mistral API failed, using mock image:', apiError);
                imageUrl = await mistralService.generateMockImage(userPrompt);
            }

            // Remove generating message
            setMessages(prev => prev.filter(msg => !msg.isGenerating));

            // Add new AI response with regenerated image
            const newAiResponse: Message = {
                id: `ai-regenerated-${Date.now()}`,
                type: 'ai',
                content: "Here's a new interpretation of your dream! I've created a fresh visualization with a different artistic approach.",
                timestamp: new Date(),
                imageUrl: imageUrl
            };

            setMessages(prev => [...prev, newAiResponse]);

        } catch (error) {
            console.error('Error regenerating image:', error);

            // Remove generating message and show error
            setMessages(prev => prev.filter(msg => !msg.isGenerating));

            const errorMessage: Message = {
                id: `regen-error-${Date.now()}`,
                type: 'ai',
                content: 'Sorry, I encountered an error while regenerating your dream visualization. Please try again.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className={`h-24 px-8 pt-8 flex-shrink-0 relative ${isDarkMode
                ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/80 via-slate-900/40 to-transparent'
                : 'bg-gradient-to-b from-blue-200/95 via-purple-200/80 via-purple-200/40 to-transparent'
                }`}>
                <div className="flex items-start justify-between h-16 relative z-10">
                    <motion.button
                        onClick={() => navigate('/calendar')}
                        className={`px-3 py-2 rounded-md backdrop-blur-md border transition-all duration-300 ${isDarkMode
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ← Back to Calendar
                    </motion.button>

                    <h1 className="text-xl font-semibold">
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </h1>

                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-6">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-2xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                                    {/* Message bubble */}
                                    <div className={`p-4 rounded-2xl backdrop-blur-md border ${message.type === 'user'
                                        ? isDarkMode
                                            ? 'bg-purple-600/30 border-purple-400/50 text-white'
                                            : 'bg-purple-500/20 border-purple-500/50 text-purple-900'
                                        : isDarkMode
                                            ? 'bg-white/10 border-white/20 text-white'
                                            : 'bg-white/30 border-white/50 text-purple-900'
                                        }`}>

                                        {/* Message content */}
                                        <p className="text-sm leading-relaxed">
                                            {message.content}
                                        </p>

                                        {/* Loading animation for generating messages */}
                                        {message.isGenerating && (
                                            <div className="flex items-center space-x-2 mt-3">
                                                <div className="flex space-x-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white/60' : 'bg-purple-600/60'}`}
                                                            animate={{
                                                                scale: [1, 1.2, 1],
                                                                opacity: [0.5, 1, 0.5]
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                delay: i * 0.2
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs opacity-60">Generating...</span>
                                            </div>
                                        )}

                                        {/* Generated image */}
                                        {message.imageUrl && (
                                            <div className="mt-4">
                                                <motion.img
                                                    src={message.imageUrl}
                                                    alt="Generated dream visualization"
                                                    className="w-full rounded-lg shadow-lg"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />

                                                {/* Image action buttons */}
                                                <div className="flex space-x-3 mt-3">
                                                    <motion.button
                                                        onClick={() => handleAcceptImage(message.id)}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isDarkMode
                                                            ? 'bg-green-600/30 border border-green-400/50 text-green-300 hover:bg-green-600/50'
                                                            : 'bg-green-500/20 border border-green-500/50 text-green-700 hover:bg-green-500/30'
                                                            }`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Accept
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => handleRegenerateImage(message.id)}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isDarkMode
                                                            ? 'bg-blue-600/30 border border-blue-400/50 text-blue-300 hover:bg-blue-600/50'
                                                            : 'bg-blue-500/20 border border-blue-500/50 text-blue-700 hover:bg-blue-500/30'
                                                            }`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Regenerate
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamp */}
                                    <div className={`text-xs opacity-50 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {format(message.timestamp, 'h:mm a')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6">
                <div>
                    <div className="flex space-x-4">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe your dream in detail..."
                                disabled={isGenerating}
                                className={`w-full p-4 rounded-2xl backdrop-blur-md border resize-none min-h-[60px] max-h-32 transition-all duration-300 ${isDarkMode
                                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40'
                                    : 'bg-white/30 border-white/50 text-purple-900 placeholder-purple-700/50 focus:border-purple-500/60'
                                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        <motion.button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isGenerating}
                            className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${!inputValue.trim() || isGenerating
                                ? 'opacity-50 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                            whileHover={!inputValue.trim() || isGenerating ? {} : { scale: 1.05 }}
                            whileTap={!inputValue.trim() || isGenerating ? {} : { scale: 0.95 }}
                        >
                            {isGenerating ? (
                                <div className="flex items-center space-x-2">
                                    <motion.div
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Generating...</span>
                                </div>
                            ) : (
                                'Send'
                            )}
                        </motion.button>
                    </div>

                    <p className={`text-xs mt-2 opacity-60 ${isDarkMode ? 'text-white' : 'text-purple-700'}`}>
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};
