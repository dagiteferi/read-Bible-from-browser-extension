import { useState, useEffect } from 'react';
import { getPlanProgress } from '../services/api/plans';
import { markUnitAsRead as apiMarkUnitAsRead } from '../services/api/units';
import { Plan, Progress } from '../types/plan';
import { useOfflineQueue } from './useOfflineQueue'; // Import the hook

export const usePlan = (planId: string | null) => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { queueOfflineAction, isOnline } = useOfflineQueue(); // Use the offline queue hook

  const refreshPlan = async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      const planProgress = await getPlanProgress(planId);
      setProgress(planProgress);
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

  useEffect(() => {
    refreshPlan();
  }, [planId]);

  return { currentPlan, progress, loading, error, refreshPlan, markUnitRead, setCurrentPlan };
};