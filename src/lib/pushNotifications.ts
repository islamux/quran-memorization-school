// Push notification utilities
export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
          )
        });
        
        // Send subscription to your server
        await saveSubscription(subscription);
      }
    }
    
    return subscription;
  } catch (error) {
    console.error('Error registering push notifications:', error);
  }
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Save subscription to server (implement based on your backend)
async function saveSubscription(subscription: PushSubscription) {
  // For now, just log it
  console.log('Push subscription:', subscription);
  
  // TODO: Send to your backend
  // const response = await fetch('/api/push-subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(subscription)
  // });
}

// Request permission and show notification
export async function showNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return;
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options
    });
  }
}

// Schedule a notification (for reminders)
export function scheduleNotification(title: string, body: string, scheduledTime: Date) {
  const now = new Date().getTime();
  const scheduled = scheduledTime.getTime();
  const delay = scheduled - now;
  
  if (delay > 0) {
    setTimeout(() => {
      showNotification(title, { body });
    }, delay);
  }
}
