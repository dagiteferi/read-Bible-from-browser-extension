import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plan, Progress } from '../types/plan';
import { getPlanProgress } from '../services/api/plans';
import { markUnitAsRead as apiMarkUnitAsRead } from '../services/api/units';
import { getLocal, setLocal } from '../services/storage/local';
import { useOfflineQueue } from '../hooks/useOfflineQueue'; // Import the hook
import { CreatePlanRequest } from '../types/api';
import { createPlan as apiCreatePlan } from '../services/api/plans';


interface PlanContextType {
  currentPlan: Plan | null;
  progress: Progress | null;
  loading: boolean;
  error: Error | null;
  refreshPlan: () => Promise<void>;
  markUnitRead: (unitId: string) => Promise<void>;
  setActivePlan: (plan: Plan | null) => void;
  createPlan: (planData: CreatePlanRequest) => Promise<Plan | null>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const ACTIVE_PLAN_KEY = 'activePlan';

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { queueOfflineAction, isOnline } = useOfflineQueue(); // Use the offline queue hook

  useEffect(() => {
    const loadActivePlan = async () => {
      const storedPlan = await getLocal(ACTIVE_PLAN_KEY);
      if (storedPlan) {
        setCurrentPlan(storedPlan);
      }
    };
    loadActivePlan();
  }, []);

  useEffect(() => {
    if (currentPlan) {
      refreshPlan();
    }
  }, [currentPlan?.id]); // Refresh when active plan changes

  const setActivePlan = async (plan: Plan | null) => {
    console.log('[PlanContext] Setting active plan:', plan?.id || 'null');
    setCurrentPlan(plan);
    if (plan) {
      await setLocal(ACTIVE_PLAN_KEY, plan);
    } else {
      await setLocal(ACTIVE_PLAN_KEY, null);
    }
    // Refresh to update UI and notify background
    chrome.runtime.sendMessage({ action: 'refreshPlan' });
  };

  const refreshPlan = async () => {
    if (!currentPlan?.id) return;
    setLoading(true);
    setError(null);
    try {
      const planProgress = await getPlanProgress(currentPlan.id);
      setProgress(planProgress);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const markUnitRead = async (unitId: string) => {
    if (!currentPlan?.id) return;
    setLoading(true);
    setError(null);
    if (!isOnline) {
      queueOfflineAction({ type: 'markUnitAsRead', payload: { unitId } });
      setError(new Error('You are offline. Action queued for sync.'));
      setLoading(false);
      return;
    }
    try {
      await apiMarkUnitAsRead(unitId);
      await refreshPlan(); // Refresh progress after marking unit as read
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: CreatePlanRequest): Promise<Plan | null> => {
    setLoading(true);
    setError(null);
    if (!isOnline) {
      queueOfflineAction({ type: 'createPlan', payload: { planData } });
      setError(new Error('You are offline. Plan creation queued for sync.'));
      setLoading(false);
      return null;
    }
    try {
      const response = await apiCreatePlan(planData);
      const newPlan: Plan = {
        ...planData,
        id: response.plan_id,
        max_verses_per_unit: planData.max_verses_per_unit || 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setActivePlan(newPlan);
      return newPlan;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanContext.Provider value={{ currentPlan, progress, loading, error, refreshPlan, markUnitRead, setActivePlan, createPlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
};