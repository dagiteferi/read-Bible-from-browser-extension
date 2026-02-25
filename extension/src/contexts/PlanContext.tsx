import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Progress } from '../types/plan';
import { getPlanProgress } from '../services/api/plans';
import { markUnitAsRead as apiMarkUnitAsRead } from '../services/api/units';
import { getLocal, setLocal } from '../services/storage/local';

interface PlanContextType {
  currentPlan: Plan | null;
  progress: Progress | null;
  loading: boolean;
  error: Error | null;
  refreshPlan: () => Promise<void>;
  markUnitRead: (unitId: string) => Promise<void>;
  setActivePlan: (plan: Plan | null) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const ACTIVE_PLAN_KEY = 'activePlan';

export const PlanProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    setCurrentPlan(plan);
    if (plan) {
      await setLocal(ACTIVE_PLAN_KEY, plan);
    } else {
      await setLocal(ACTIVE_PLAN_KEY, null);
    }
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
    try {
      await apiMarkUnitAsRead(unitId);
      await refreshPlan();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanContext.Provider value={{ currentPlan, progress, loading, error, refreshPlan, markUnitRead, setActivePlan }}>
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
