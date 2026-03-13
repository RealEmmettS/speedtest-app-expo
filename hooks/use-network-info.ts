import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

interface NetworkInfo {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean;
}

export function useNetworkInfo(): NetworkInfo {
  const [info, setInfo] = useState<NetworkInfo>({
    type: 'UNKNOWN',
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) {
          setInfo({
            type: state.type ?? 'UNKNOWN',
            isConnected: state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable ?? true,
          });
        }
      } catch {
        // ignore
      }
    }

    check();
    const interval = setInterval(check, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return info;
}
