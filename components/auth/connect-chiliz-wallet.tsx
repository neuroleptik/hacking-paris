import React, { useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getNonce, verifySignature } from '@/actions/auth/manage-nonce';
import { Routes } from '@/constants/routes';
import { type CompleteUserOnboardingSchema } from '@/schemas/onboarding/complete-user-onboarding-schema';

import { Button } from '../ui/button';
import { CompleteProfileStep } from './login/complete-profile-step';
import { VerifyEmailCard } from './verify-email/verify-email-card';

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

export default function ConnectChilizWallet(props: { step: number }) {
  //get la session
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(props.step);
  const [email, setEmail] = useState<string | null>(null);

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
      console.log(accounts);
      const nonce = await getNonce(accounts[0]);
      console.log(nonce);

      const signature = await ethProvider.request({
        method: 'personal_sign',
        params: [nonce, accounts[0]]
      });

      // Envoyer au backend pour vérification
      const verifyRes = await verifySignature({
        address: accounts[0],
        signature: signature as string
      });

      console.log(verifyRes);
      if (verifyRes.success) {
        if (verifyRes.shouldRedirect) {
          window.location.href = Routes.Dashboard;
        } else {
          if (verifyRes.step === 1) {
            console.log('Step 1');
            setStep(1);
          } else if (verifyRes.step === 2) {
            console.log('Step 2');
            setStep(2);
          } else if (verifyRes.step === 3) {
            console.log('Step 3');
            setStep(3);
          }
        }
      }

      setAccount(accounts[0]);
    } catch {
      setError('Failed to connect wallet.');
    }
    setIsLoading(false);
  };

  const handleProfileSubmit = async (data: CompleteUserOnboardingSchema) => {
    setIsLoading(true);
    try {
      // Ici vous pouvez ajouter la logique pour traiter les données du profil
      // Par exemple, appeler une action pour sauvegarder le profil utilisateur
      console.log('Profile data submitted:', data);
      setStep(2);
      setEmail(data.email ?? '');

      // Rediriger ou mettre à jour l'état après la soumission
      // setStep(2);
      // await signUp({
      //   email: data.email,
      //   name: data.name,
      //   walletAddress: account
      // });
    } catch (err) {
      setError('Failed to save profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {step === 1 ? (
        <CompleteProfileStep onFormSubmit={handleProfileSubmit} />
      ) : step === 2 && email ? (
        <VerifyEmailCard email={email} />
      ) : (
        <Button
          className="flex items-center gap-2 rounded border px-4 py-2"
          onClick={connectWallet}
          variant="outline"
          disabled={isLoading}
        >
          <Image
            src="/chiliz-logo.png"
            alt="Chiliz Logo"
            width={20}
            height={20}
          />
          {isLoading ? 'Connecting...' : 'Connect Chiliz Wallet'}
        </Button>
      )}
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
}
