'use client';

import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_CONFIG } from '@/lib/contract';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.testnet); // Use mainnet for production
      setIsConnected(true);
    }
    setIsLoading(false);
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: APP_CONFIG.name,
        icon: window.location.origin + APP_CONFIG.icon,
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.testnet); // Use mainnet for production
        setIsConnected(true);
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setAddress(null);
    setIsConnected(false);
  };

  return {
    address,
    isConnected,
    isLoading,
    connect,
    disconnect,
    userSession,
  };
}

