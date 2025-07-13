'use client';

import { useEffect, useState } from 'react';
import { Loader2, ZapIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendStakeTransactions } from '@/lib/crypto/send-transactions';

// Types pour Ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}

interface StakeModalProps {
  club: {
    token: string;
    name: string;
    symbol: string;
    totalStaked: string;
  } | null;
  personalStakes: {
    address: string;
    totalStaked: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
  onStakeSuccess?: () => void;
}

export function StakeModal({
  club,
  personalStakes,
  isOpen,
  onClose,
  onStakeSuccess
}: StakeModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const handleStake = async () => {
    if (!club || !amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      toast.error("You don't have enough tokens to stake this amount");
      return;
    }

    // Demander à l'utilisateur de signer le message
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const account = accounts[0];

        const message = `I want to stake ${amount} ${club.symbol} tokens. Timestamp: ${Date.now()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, account]
        });

        setIsLoading(true);
        try {
          console.log('Sending staking request:', {
            tokenAddress: club.token,
            amount: amount
          });

          const response = await fetch('/api/stake', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tokenAddress: club.token,
              amount: amount
            })
          });

          console.log('Response status:', response.status);
          const result = await response.json();
          console.log('Response result:', result);

          if (response.ok && result.data) {
            const data = result.data;

            if (data.readyForTransactions) {
              // Mode production - envoyer de vraies transactions
              console.log('🚀 Envoi de vraies transactions blockchain...');

              try {
                const transactionResult = await sendStakeTransactions(
                  data.transactionData.approve,
                  data.transactionData.stake,
                  data.userWalletAddress
                );

                if (transactionResult.success) {
                  const hashDisplay = transactionResult.transactionHash
                    ? `${transactionResult.transactionHash.slice(0, 10)}...`
                    : 'Transaction confirmée';

                  toast.success(
                    `Staking réussi ! Hash: ${hashDisplay} - Frais: ${data.estimatedTotalCost} CHZ`
                  );

                  window.location.reload();

                  console.log(
                    '✅ Vraies transactions confirmées:',
                    transactionResult
                  );
                } else {
                  toast.error(`Erreur transaction: ${transactionResult.error}`);
                  console.error(
                    '❌ Erreur transaction:',
                    transactionResult.error
                  );
                }
              } catch (error) {
                toast.error("Erreur lors de l'envoi des transactions");
                console.error('❌ Erreur envoi transactions:', error);
              }
            } else {
              // Fallback - afficher les estimations
              toast.success(
                `Signatures vérifiées - Coût estimé: ${data.estimatedTotalCost} CHZ`
              );
            }

            console.log('Staking result:', data);
            onClose();
            setAmount('');

            if (onStakeSuccess) {
              onStakeSuccess();
            }
          } else {
            const errorMessage = result.error || 'Error during staking';
            toast.error(errorMessage);
            console.error('Staking error:', result);
          }
        } catch (error) {
          console.error('Error during staking:', error);
          toast.error('Error during staking');
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error during signature:', error);
        toast.error('Error during message signature');
      }
    } else {
      toast.error('Wallet not connected. Please connect MetaMask.');
    }
  };

  // Récupérer le solde de l'utilisateur quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && club) {
      fetchUserBalance();
    }
  }, [isOpen, club]);

  const fetchUserBalance = async () => {
    if (!club) return;

    setIsLoadingBalance(true);
    try {
      const response = await fetch('/api/user-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenAddress: club.token
        })
      });

      const { data } = await response.json();
      if (response.ok) {
        setUserBalance(data.balance);
      } else {
        console.error('Error retrieving balance:', data.error);
        setUserBalance('0');
      }
    } catch (error) {
      console.error('Error retrieving balance:', error);
      setUserBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(userBalance);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ZapIcon className="size-5" />
            Stake {club?.symbol} tokens
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount to stake</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={userBalance}
                step="0.000001"
                disabled={isLoadingBalance}
              />
              <Button
                variant="outline"
                onClick={handleMaxClick}
                className="shrink-0"
                disabled={isLoadingBalance}
              >
                {isLoadingBalance ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Max'
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Available balance:{' '}
              {isLoadingBalance
                ? 'Loading...'
                : `${userBalance} ${club?.symbol}`}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <h4 className="mb-2 font-semibold">Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Club:</span>
                <span>{club?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount to stake:</span>
                <span>
                  {amount || '0'} {club?.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current total staked:</span>
                <span>
                  {parseInt(
                    personalStakes
                      .find(
                        (stake) =>
                          stake.address.toLowerCase() ==
                          club?.token.toLowerCase()
                      )
                      ?.totalStaked.toLocaleString() || '0'
                  )}{' '}
                  {club?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Transaction fees:</span>
                <span>~0.001-0.005 CHZ</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                ⚠️ In test mode, no real transaction is performed
              </div>
            </div>
          </div>

          <Button
            onClick={handleStake}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Staking in progress...
              </>
            ) : (
              <>
                <ZapIcon className="mr-2 size-4" />
                Stake {amount || '0'} {club?.symbol}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
