import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createClient } from '@/lib/supabase/client';
import type { DrinkLog, DrinkType, BathroomLog, BathroomType } from '@/types';

interface HydroStore {
  todayLogs: DrinkLog[];
  todayBathroomLogs: BathroomLog[];
  dailyGoal: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTodayLogs: () => Promise<void>;
  addLog: (drinkType: DrinkType, amountMl: number) => Promise<void>;
  addBathroomLog: (bathroomType: BathroomType, note?: string) => Promise<void>;
  setDailyGoal: (goal: number) => void;
  reset: () => void;
}

function getTodayStart(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export const useHydroStore = create<HydroStore>((set, get) => ({
  todayLogs: [],
  todayBathroomLogs: [],
  dailyGoal: 2000,
  isLoading: false,
  error: null,

  fetchTodayLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ todayLogs: [], todayBathroomLogs: [], isLoading: false });
        return;
      }

      const todayStart = getTodayStart();

      // Fetch drink logs and bathroom logs in parallel
      const [drinkResult, bathroomResult] = await Promise.all([
        supabase
          .from('drink_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', todayStart)
          .order('logged_at', { ascending: false }),
        supabase
          .from('bathroom_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', todayStart)
          .order('logged_at', { ascending: false }),
      ]);

      if (drinkResult.error) throw drinkResult.error;

      set({
        todayLogs: drinkResult.data || [],
        todayBathroomLogs: bathroomResult.data || [],
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addLog: async (drinkType: DrinkType, amountMl: number) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Ensure profile exists (upsert)
    await supabase
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    // Optimistic update
    const tempId = crypto.randomUUID();
    const tempLog: DrinkLog = {
      id: tempId,
      user_id: user.id,
      drink_type: drinkType,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      todayLogs: [tempLog, ...state.todayLogs],
    }));

    try {
      const { data, error } = await supabase
        .from('drink_logs')
        .insert({
          user_id: user.id,
          drink_type: drinkType,
          amount_ml: amountMl,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp log with real one
      set((state) => ({
        todayLogs: state.todayLogs.map((log) =>
          log.id === tempId ? data : log
        ),
      }));
    } catch (error) {
      // Rollback optimistic update
      set((state) => ({
        todayLogs: state.todayLogs.filter((log) => log.id !== tempId),
        error: (error as Error).message,
      }));
      throw error;
    }
  },

  addBathroomLog: async (bathroomType: BathroomType, note?: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Ensure profile exists (upsert)
    await supabase
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    // Optimistic update
    const tempId = crypto.randomUUID();
    const tempLog: BathroomLog = {
      id: tempId,
      user_id: user.id,
      bathroom_type: bathroomType,
      note,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      todayBathroomLogs: [tempLog, ...state.todayBathroomLogs],
    }));

    try {
      const { data, error } = await supabase
        .from('bathroom_logs')
        .insert({
          user_id: user.id,
          bathroom_type: bathroomType,
          note,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp log with real one
      set((state) => ({
        todayBathroomLogs: state.todayBathroomLogs.map((log) =>
          log.id === tempId ? data : log
        ),
      }));
    } catch (error) {
      // Rollback optimistic update
      set((state) => ({
        todayBathroomLogs: state.todayBathroomLogs.filter((log) => log.id !== tempId),
        error: (error as Error).message,
      }));
      throw error;
    }
  },

  setDailyGoal: (goal: number) => set({ dailyGoal: goal }),

  reset: () => set({ todayLogs: [], todayBathroomLogs: [], isLoading: false, error: null }),
}));

// Hooks with stable selectors
export function useTotalMl() {
  return useHydroStore((state) =>
    state.todayLogs.reduce((sum, log) => sum + log.amount_ml, 0)
  );
}

export function useDrinkTypeBreakdown() {
  return useHydroStore(
    useShallow((state) => {
      const water = state.todayLogs
        .filter((l) => l.drink_type === 'water')
        .reduce((s, l) => s + l.amount_ml, 0);
      const coffee = state.todayLogs
        .filter((l) => l.drink_type === 'coffee')
        .reduce((s, l) => s + l.amount_ml, 0);
      const soda = state.todayLogs
        .filter((l) => l.drink_type === 'soda')
        .reduce((s, l) => s + l.amount_ml, 0);
      const alcohol = state.todayLogs
        .filter((l) => l.drink_type === 'alcohol')
        .reduce((s, l) => s + l.amount_ml, 0);
      const other = state.todayLogs
        .filter((l) => l.drink_type === 'other')
        .reduce((s, l) => s + l.amount_ml, 0);

      return { water, coffee, soda, alcohol, other };
    })
  );
}

export function useRecentLogs() {
  return useHydroStore(useShallow((state) => state.todayLogs.slice(0, 5)));
}

export function useProgress() {
  return useHydroStore((state) => {
    const total = state.todayLogs.reduce((sum, log) => sum + log.amount_ml, 0);
    return Math.min((total / state.dailyGoal) * 100, 100);
  });
}

export function useDailyGoal() {
  return useHydroStore((state) => state.dailyGoal);
}

export function useBathroomStats() {
  return useHydroStore(
    useShallow((state) => {
      const pee = state.todayBathroomLogs.filter((l) => l.bathroom_type === 'pee').length;
      const poop = state.todayBathroomLogs.filter((l) => l.bathroom_type === 'poop').length;
      return { pee, poop, total: pee + poop };
    })
  );
}

export function useRecentBathroomLogs() {
  return useHydroStore(useShallow((state) => state.todayBathroomLogs.slice(0, 3)));
}
