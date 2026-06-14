// Offline detection and Firebase fallback helper

export class OfflineHelper {
  private static isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

  static {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        OfflineHelper.isOnline = true;
        console.log('✓ Connection restored');
      });
      window.addEventListener('offline', () => {
        OfflineHelper.isOnline = false;
        console.log('✗ Connection lost - using local storage');
      });
    }
  }

  static isDeviceOnline(): boolean {
    return OfflineHelper.isOnline;
  }

  static shouldUseLocalStorage(): boolean {
    // Use localStorage if offline or Firebase not configured
    const hasFirebaseConfig = 
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    return !OfflineHelper.isOnline || !hasFirebaseConfig;
  }

  static logOfflineMode(): void {
    if (!OfflineHelper.isOnline) {
      console.warn('⚠️ Operating in offline mode - using local storage');
    }
  }

  // Firebase operation wrapper that handles offline gracefully
  static async withOfflineFallback<T>(
    firebaseOperation: () => Promise<T>,
    fallbackOperation: () => T | Promise<T>,
    operationName: string = 'Firebase operation'
  ): Promise<T> {
    // Skip Firebase if offline or not configured
    if (OfflineHelper.shouldUseLocalStorage()) {
      console.log(`${operationName}: Using local storage (offline or no Firebase config)`);
      return await fallbackOperation();
    }

    try {
      console.log(`${operationName}: Trying Firebase...`);
      const result = await Promise.race([
        firebaseOperation(),
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        )
      ]);
      console.log(`${operationName}: Firebase success`);
      return result;
    } catch (error: any) {
      console.warn(`${operationName}: Firebase failed, falling back to local storage`, error.message);
      try {
        return await fallbackOperation();
      } catch (fallbackError) {
        console.error(`${operationName}: Both Firebase and fallback failed`, fallbackError);
        throw fallbackError;
      }
    }
  }
}
