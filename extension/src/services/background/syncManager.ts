import { getLocal, setLocal } from '../storage/local';
import { OfflineAction } from '../../hooks/useOfflineQueue';
import { markUnitAsRead as apiMarkUnitAsRead } from '../api/units';
import { createPlan as apiCreatePlan } from '../api/plans';
import { CreatePlanRequest } from '../../types/api';

const OFFLINE_QUEUE_KEY = 'offlineActionsQueue';

export const syncOfflineActions = async () => {
  const queuedActions: OfflineAction[] = await getLocal(OFFLINE_QUEUE_KEY) || [];
  if (queuedActions.length === 0) {
    console.log('No offline actions to sync.');
    return;
  }

  console.log(`Attempting to sync ${queuedActions.length} offline actions.`);
  const successfulActions: OfflineAction[] = [];
  const failedActions: OfflineAction[] = [];

  for (const action of queuedActions) {
    try {
      switch (action.type) {
        case 'markUnitAsRead':
          await apiMarkUnitAsRead(action.payload.unitId);
          console.log(`Successfully synced 'markUnitAsRead' for unit: ${action.payload.unitId}`);
          successfulActions.push(action);
          break;
        case 'createPlan':
          await apiCreatePlan(action.payload.planData as CreatePlanRequest);
          console.log(`Successfully synced 'createPlan' for plan: ${action.payload.planData.books[0]}...`);
          successfulActions.push(action);
          break;
        // Add other action types here
        default:
          console.warn(`Unknown offline action type: ${action.type}`);
          failedActions.push(action); // Treat as failed if unknown
      }
    } catch (error) {
      console.error(`Failed to sync action ${action.type} with payload ${JSON.stringify(action.payload)}:`, error);
      failedActions.push(action);
    }
  }

  // Update the queue in local storage: remove successful, keep failed for retry
  const remainingActions = queuedActions.filter(
    (action) => !successfulActions.includes(action)
  );
  await setLocal(OFFLINE_QUEUE_KEY, remainingActions);

  if (successfulActions.length > 0) {
    console.log(`Synced ${successfulActions.length} actions successfully.`);
  }
  if (failedActions.length > 0) {
    console.warn(`${failedActions.length} actions failed to sync and will be retried later.`);
  }
};