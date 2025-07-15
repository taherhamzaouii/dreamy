import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Dream {
    id: string;
    date: string; // ISO date string
    dreamText: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface DreamStore {
    dreams: Dream[];
    addDream: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateDream: (id: string, updates: Partial<Dream>) => void;
    getDreamByDate: (date: string) => Dream | undefined;
    getDreamDates: () => Date[];
    deleteDream: (id: string) => void;
    clearAllDreams: () => void;
}

export const useDreamStore = create<DreamStore>()(
    persist(
        (set, get) => ({
            dreams: [],

            addDream: (dreamData) => {
                const newDream: Dream = {
                    ...dreamData,
                    id: `dream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    dreams: [...state.dreams, newDream],
                }));
            },

            updateDream: (id, updates) => {
                set((state) => ({
                    dreams: state.dreams.map((dream) =>
                        dream.id === id
                            ? { ...dream, ...updates, updatedAt: new Date() }
                            : dream
                    ),
                }));
            },

            getDreamByDate: (date) => {
                const dreams = get().dreams;
                return dreams.find((dream) => dream.date === date);
            },

            getDreamDates: () => {
                const dreams = get().dreams;
                return dreams
                    .filter((dream) => dream.imageUrl) // Only return dates with completed dreams
                    .map((dream) => new Date(dream.date))
                    .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first
            },

            deleteDream: (id) => {
                set((state) => ({
                    dreams: state.dreams.filter((dream) => dream.id !== id),
                }));
            },

            clearAllDreams: () => {
                set({ dreams: [] });
            },
        }),
        {
            name: 'dream-storage', // localStorage key
            version: 1,
        }
    )
);
