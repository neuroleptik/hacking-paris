import React, { useState } from 'react';
import Image from 'next/image';

export const CHILIZ_TESTNET_PARAMS = {
  chainId: '0x15B32',
  chainName: 'Chiliz Spicy Testnet',
  nativeCurrency: { name: 'Chiliz', symbol: 'CHZ', decimals: 18 },
  rpcUrls: ['https://spicy-rpc.chiliz.com/'],
  blockExplorerUrls: ['https://testnet.chiliscan.com/']
};

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export default function ConnectChilizWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setError(null);
    setIsLoading(true);
    const ethProvider = (window as unknown as { ethereum?: EthereumProvider })
      .ethereum;
    if (!ethProvider) {
      setError('Metamask is not installed.');
      setIsLoading(false);
      return;
    }
    try {
      // Switch to Chiliz testnet or add it if not present
      await ethProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHILIZ_TESTNET_PARAMS.chainId }]
      });
    } catch (switchError: unknown) {
      const err = switchError as { code?: number; message?: string };
      if (err.code === 4902) {
        try {
          await ethProvider.request({
            method: 'wallet_addEthereumChain',
            params: [CHILIZ_TESTNET_PARAMS]
          });
        } catch {
          setError('Failed to add Chiliz testnet to Metamask.');
          setIsLoading(false);
          return;
        }
      } else {
        setError(
          `Failed to switch to Chiliz testnet. Code: ${err.code ?? 'unknown'} - ${err.message ?? ''}`
        );
        setIsLoading(false);
        return;
      }
    }
    try {
      const accounts = (await ethProvider.request({
        method: 'eth_requestAccounts'
      })) as string[];
      setAccount(accounts[0]);
    } catch {
      setError('Failed to connect wallet.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {account ? (
        <div className="text-sm text-green-600">Connected: {account}</div>
      ) : (
        <button
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-black hover:bg-primary/90 disabled:opacity-50"
          onClick={connectWallet}
          disabled={isLoading}
        >
          <Image
            src="/chiliz-logo.png"
            alt="Chiliz Logo"
            width={20}
            height={20}
          />
          {isLoading ? 'Connecting...' : 'Connect Chiliz Wallet'}
        </button>
      )}
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
}
