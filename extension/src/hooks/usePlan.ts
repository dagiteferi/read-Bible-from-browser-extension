import { useState, useEffect } from 'react';
import { getPlanProgress } from '../services/api/plans';
import { markUnitAsRead as apiMarkUnitAsRead } from '../services/api/units';
import { Plan, Progress } from '../types/plan'; // Assuming these types exist

export const usePlan = (planId: string | null) => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshPlan = async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch plan details and progress
      // For now, just fetching progress
      const planProgress = await getPlanProgress(planId);
      setProgress(planProgress);
      // setCurrentPlan(...); // In a real scenario, you'd fetch the plan details too
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const markUnitRead = async (unitId: string) => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      await apiMarkUnitAsRead(unitId);
      await refreshPlan(); // Refresh progress after marking unit as read
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlan();
  }, [planId]);

  return { currentPlan, progress, loading, error, refreshPlan, markUnitRead };
};
