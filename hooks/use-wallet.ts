import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface UseWalletReturn {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  error: string | null;
  isLoading: boolean;
}

export function useWallet(): UseWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si MetaMask est installé
  const checkIfWalletIsInstalled = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return true;
    }
    return false;
  }, []);

  // Vérifier si le wallet est connecté
  const checkIfWalletIsConnected = useCallback(async () => {
    if (!checkIfWalletIsInstalled()) {
      return false;
    }

    try {
      const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion:', error);
      return false;
    }
  }, [checkIfWalletIsInstalled]);

  // Se connecter au wallet
  const connect = useCallback(async () => {
    if (!checkIfWalletIsInstalled()) {
      setError('MetaMask n\'est pas installé. Veuillez installer MetaMask pour continuer.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        setError('Aucun compte trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  }, [checkIfWalletIsInstalled]);

  // Se déconnecter
  const disconnect = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setError(null);
  }, []);

  // Signer un message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet non connecté');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la signature');
    }
  }, [isConnected, account]);

  // Écouter les changements de compte
  useEffect(() => {
    if (!checkIfWalletIsInstalled()) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // L'utilisateur s'est déconnecté
        disconnect();
      } else if (accounts[0] !== account) {
        // Le compte a changé
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = () => {
      // Recharger la page quand le réseau change
      window.location.reload();
    };

    window.ethereum!.on('accountsChanged', handleAccountsChanged);
    window.ethereum!.on('chainChanged', handleChainChanged);

    // Vérifier l'état initial de la connexion
    checkIfWalletIsConnected().then((connected) => {
      if (connected) {
        window.ethereum!.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        });
      }
    });

    return () => {
      window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum!.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkIfWalletIsInstalled, checkIfWalletIsConnected, disconnect, account]);

  return {
    isConnected,
    account,
    connect,
    disconnect,
    signMessage,
    error,
    isLoading
  };
}
