'use client';

import { useState, useEffect } from 'react';
import { ZapIcon, Loader2 } from 'lucide-react';

// Types pour Ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StakeModalProps {
  club: {
    token: string;
    name: string;
    symbol: string;
    totalStaked: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StakeModal({ club, isOpen, onClose }: StakeModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const handleStake = async () => {
    if (!club || !amount || parseFloat(amount) <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      toast.error("Vous n'avez pas assez de tokens pour staker ce montant");
      return;
    }

    // Demander à l'utilisateur de signer le message
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const message = `Je veux staker ${amount} ${club.symbol} tokens. Timestamp: ${Date.now()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, account]
        });

            setIsLoading(true);
    try {
      console.log('Sending staking request:', {
        tokenAddress: club.token,
        amount: amount,
        signature: signature,
        message: message,
      });

      const response = await fetch('/api/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress: club.token,
          amount: amount,
          signature: signature,
          message: message,
        }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);
      console.log(result)
      if (response.ok) {
        const hash = result.transactionHash;
        const hashDisplay = hash && hash !== 'Transaction en cours...'
          ? `${hash.slice(0, 10)}...`
          : 'Transaction en cours...';

                        const isTestMode = result.isTestMode;
        const modeText = isTestMode ? ' (MODE TEST)' : '';
        const gasInfo = result.totalGasCost ? ` - Frais: ${result.totalGasCost}` : '';

        toast.success(`Staking réussi ! Hash: ${hashDisplay}${modeText}${gasInfo}`);
        console.log('Staking result:', result);

        // Afficher plus de détails dans la console
        console.log('Transaction details:', {
          stakeHash: result.transactionHash,
          approveHash: result.approveHash,
          blockNumber: result.blockNumber,
          amount: result.amount,
          tokenAddress: result.tokenAddress,
          isTestMode: result.isTestMode,
          gasUsed: result.gasUsed,
          gasPrice: result.gasPrice,
          totalGasCost: result.totalGasCost,
          approveGasUsed: result.approveGasUsed,
          stakeGasUsed: result.stakeGasUsed
        });

        onClose();
        setAmount('');
      } else {
        const errorMessage = result.error || "Erreur lors du staking";
        toast.error(errorMessage);
        console.error('Staking error:', result);
      }
        } catch (error) {
          console.error('Erreur lors du staking:', error);
          toast.error("Erreur lors du staking");
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la signature:', error);
        toast.error("Erreur lors de la signature du message");
      }
    } else {
      toast.error("Wallet non connecté. Veuillez connecter MetaMask.");
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress: club.token,
        }),
      });

      const { data } = await response.json();
      if (response.ok) {
        setUserBalance(data.balance);
      } else {
        console.error('Erreur lors de la récupération du solde:', data.error);
        setUserBalance('0');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      setUserBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(userBalance);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ZapIcon className="w-5 h-5" />
            Staker des tokens {club?.symbol}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
              <Label htmlFor="amount">Montant à staker</Label>
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
                  {isLoadingBalance ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Max'}
                </Button>
              </div>
            <p className="text-sm text-muted-foreground">
              Solde disponible: {isLoadingBalance ? 'Chargement...' : `${userBalance} ${club?.symbol}`}
            </p>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-semibold mb-2">Résumé</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Club:</span>
                <span>{club?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant à staker:</span>
                <span>{amount || '0'} {club?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Total staké actuel:</span>
                <span>{club?.totalStaked} {club?.symbol}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Frais de transaction:</span>
                <span>~0.001-0.005 CHZ</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                ⚠️ En mode test, aucune vraie transaction n'est effectuée
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Staking en cours...
              </>
            ) : (
              <>
                <ZapIcon className="w-4 h-4 mr-2" />
                Staker {amount || '0'} {club?.symbol}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
