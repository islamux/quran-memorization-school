// Background sync utilities for offline data persistence
import { db } from '@/lib/dexieDB';

interface SyncData {
  id: string;
  type: 'student' | 'attendance' | 'teacher';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

// Queue data for sync when offline
export async function queueForSync(data: SyncData) {
  try {
    // Store in a sync queue table
    await db.syncQueue.add(data);
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-data');
    }
  } catch (error) {
    console.error('Error queuing for sync:', error);
  }
}

// Process sync queue when online
export async function processSyncQueue() {
  try {
    const syncQueue = await db.syncQueue.toArray();
    
    if (syncQueue.length === 0) return;
    
    // Process each item in queue
    for (const item of syncQueue) {
      try {
        // Send to server (implement based on your backend)
        await syncToServer(item);
        
        // Remove from queue after successful sync
        await db.syncQueue.delete(item.id);
      } catch (error) {
        console.error('Error syncing item:', item.id, error);
      }
    }
  } catch (error) {
    console.error('Error processing sync queue:', error);
  }
}

// Sync data to server
async function syncToServer(data: SyncData) {
  // TODO: Implement actual server sync
  console.log('Syncing to server:', data);
  
  // Example implementation:
  // const response = await fetch(`/api/${data.type}`, {
  //   method: data.action === 'delete' ? 'DELETE' : 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data.data)
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('Sync failed');
  // }
}

// Register periodic background sync
export async function registerPeriodicSync() {
  if ('serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Request permission
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });
      
      if (status.state === 'granted') {
        await registration.periodicSync.register('sync-data', {
          minInterval: 60 * 60 * 1000, // 1 hour
        });
      }
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
    }
  }
}

// Check online status and sync
export function setupOnlineSync() {
  window.addEventListener('online', () => {
    console.log('Back online, syncing data...');
    processSyncQueue();
  });
  
  // Check if online on load
  if (navigator.onLine) {
    processSyncQueue();
  }
}
