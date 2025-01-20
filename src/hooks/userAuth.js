// useAuth.js
import { useState, useEffect } from 'react';
import { magic } from '../utils/Magic';
import { useLocation } from 'react-router-dom';

const useAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      setIsConnected(isLoggedIn);

      if (isLoggedIn) {
        const accounts = await magic.user.getInfo();
        setAccount(accounts.publicAddress);
      }
    };

    checkIfUserIsLoggedIn();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await magic.wallet.connectWithUI();
      setIsConnected(true);
      setAccount(accounts[0]);

      // Only reload if the URL does not contain "/android"
      if (!location.pathname.includes('/android')) {
        setInterval(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return { isConnected, account, connectWallet };
};

export default useAuth;
