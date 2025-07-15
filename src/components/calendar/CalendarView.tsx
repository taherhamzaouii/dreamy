import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';

interface CalendarViewProps {
    dreamDates: Date[]; // Dates that have dream entries
}

export const CalendarView: React.FC<CalendarViewProps> = ({ dreamDates }) => {
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Memoize animation delays to prevent re-animation on re-renders
    const animationDelays = React.useMemo(() =>
        days.map((_, index) => index * 0.01),
        [days.length]
    );

    const hasDream = (date: Date) => {
        return dreamDates.some(dreamDate =>
            dreamDate.toDateString() === date.toDateString()
        );
    };

    // Check if we're at the current month to disable previous navigation
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const isCurrentMonth = currentDate.getTime() === currentMonth.getTime();

    const goToPreviousMonth = () => {
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        // Only allow going to previous month if it's not before the current month
        if (!isBefore(startOfMonth(previousMonth), currentMonth)) {
            setCurrentDate(previousMonth);
        }
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    return (
        <div className={`h-screen flex flex-col transition-all duration-1000 font-dm-sans ${isDarkMode
            ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white'
            : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 text-purple-900'
            }`}>

            {/* Header */}
            <div className="h-16 px-8 pt-8 flex-shrink-0">
                <div className="flex items-center justify-between h-full">
                    <button
                        onClick={() => navigate('/')}
                        className={`px-4 py-2 rounded-md backdrop-blur-md border transition-all duration-300 ${isDarkMode
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                            }`}
                    >
                        Back
                    </button>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={goToPreviousMonth}
                            disabled={isCurrentMonth}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isCurrentMonth
                                ? isDarkMode
                                    ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                                    : 'bg-purple-500/10 border-purple-500/20 text-purple-800/30 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <h1 className="text-xl font-semibold">
                            {format(currentDate, 'MMMM yyyy')}
                        </h1>

                        <button
                            onClick={goToNextMonth}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isDarkMode
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                : 'bg-purple-500/20 border-purple-500/30 text-purple-800 hover:bg-purple-500/30'
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="w-16" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium opacity-60 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => {
                            const hasEntry = hasDream(day);
                            const isCurrentDay = isToday(day);

                            return (
                                <motion.button
                                    key={day.toISOString()}
                                    onClick={() => {
                                        const dateString = format(day, 'yyyy-MM-dd');
                                        navigate(`/dream/${dateString}`);
                                    }}
                                    className={`
                                        aspect-square rounded-lg border transition-all duration-300 relative overflow-hidden
                                        ${isDarkMode
                                            ? 'border-white/20 hover:border-white/40'
                                            : 'border-purple-500/20 hover:border-purple-500/40'
                                        }
                                        ${hasEntry
                                            ? isDarkMode
                                                ? 'bg-purple-600/30 border-purple-400/50'
                                                : 'bg-purple-500/20 border-purple-500/50'
                                            : isDarkMode
                                                ? 'bg-white/5 hover:bg-white/10'
                                                : 'bg-white/20 hover:bg-white/30'
                                        }
                                        ${isCurrentDay
                                            ? isDarkMode
                                                ? 'ring-2 ring-blue-400'
                                                : 'ring-2 ring-purple-600'
                                            : ''
                                        }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: animationDelays[index] * 3 }}
                                >
                                    <div className="flex flex-col items-center justify-center h-full p-2">
                                        <span className={`text-lg font-medium ${isSameMonth(day, currentDate) ? 'opacity-100' : 'opacity-30'
                                            }`}>
                                            {format(day, 'd')}
                                        </span>

                                        {hasEntry && (
                                            <div className={`w-2 h-2 rounded-full mt-1 ${isDarkMode
                                                ? 'bg-purple-400'
                                                : 'bg-purple-600'
                                                }`} />
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
