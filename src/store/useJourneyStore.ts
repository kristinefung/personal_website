import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { JourneyResponse } from '@/types/api';
import { journeyApi } from '@/service/journeyService';

interface JourneyState {
    journeys: JourneyResponse[];
    isLoading: boolean;
    error: string | null;
    selectedJourney: JourneyResponse | null;
    fetchJourneys: () => Promise<void>;
    addJourney: (journeyData: any) => Promise<void>;
    updateJourney: (id: number, journeyData: any) => Promise<void>;
    deleteJourney: (id: number) => Promise<void>;
    setSelectedJourney: (journey: JourneyResponse | null) => void;
}

export const useJourneyStore = create<JourneyState>()(
    devtools(
        (set) => ({
            journeys: [],
            isLoading: false,
            error: null,
            selectedJourney: null,
            fetchJourneys: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const data = await journeyApi.getAllJourneys();
                    set({ journeys: data, isLoading: false });
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to load journeys', isLoading: false });
                }
            },
            addJourney: async (journeyData) => {
                try {
                    set({ isLoading: true, error: null });
                    const newJourney = await journeyApi.createJourney(journeyData);
                    set((state) => ({
                        journeys: [...state.journeys, newJourney],
                        isLoading: false
                    }));
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to add journey', isLoading: false });
                }
            },
            updateJourney: async (id, journeyData) => {
                try {
                    set({ isLoading: true, error: null });
                    const updatedJourney = await journeyApi.updateJourney(id, journeyData);
                    set((state) => ({
                        journeys: state.journeys.map(journey =>
                            journey.id === id ? updatedJourney : journey
                        ),
                        isLoading: false
                    }));
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to update journey', isLoading: false });
                }
            },
            deleteJourney: async (id) => {
                try {
                    set({ isLoading: true, error: null });
                    await journeyApi.deleteJourney(id);
                    set((state) => ({
                        journeys: state.journeys.filter(journey => journey.id !== id),
                        isLoading: false
                    }));
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to delete journey', isLoading: false });
                }
            },
            setSelectedJourney: (journey) => {
                set({ selectedJourney: journey });
            }
        })
    )
); 