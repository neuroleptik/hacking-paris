'use client';

import * as React from 'react';
import Image from 'next/image';

import { getClubs } from '@/actions/crypto/get-clubs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTotalStaked } from '@/hooks/use-total-staked';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TokensComponentProps {
  allTokensBalance: {
    balance: string;
    symbol: string;
  }[];
  stakedTokensBalance: {
    balance: string;
    symbol: string;
  }[];
  onRefresh?: () => void;
}

interface ConversionRates {
  [key: string]: number;
}

export function TokensComponent({
  allTokensBalance,
  stakedTokensBalance,
  onRefresh
}: TokensComponentProps): React.JSX.Element {
  const [conversionRates, setConversionRates] = React.useState<ConversionRates>(
    {}
  );
  const { data: totalStakedData, loading: totalStakedLoading, error: totalStakedError, refresh: refreshTotalStaked } = useTotalStaked();

  console.log('stakedTokensBalance', stakedTokensBalance);
  console.log('totalStakedData', totalStakedData);

  React.useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=chiliz,paris-saint-germain-fan-token,ac-milan-fan-token,juventus-fan-token&vs_currencies=eur`
        );
        const data = await response.json();

        const rates: ConversionRates = {
          CHZ: data.chiliz?.eur || 0,
          PSG: data['paris-saint-germain-fan-token']?.eur || 0,
          ACM: data['ac-milan-fan-token']?.eur || 0,
          JUV: data['juventus-fan-token']?.eur || 0
        };

        setConversionRates(rates);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des taux de conversion:',
          error
        );
      }
    };

    fetchConversionRates();
  }, []);

  const calculateTotalInEur = () => {
    return allTokensBalance.reduce((total, token) => {
      const rate = conversionRates[token.symbol] || 0;
      return total + parseFloat(token.balance) * rate;
    }, 0);
  };

  return (
    <div className="flex flex-row gap-4 mx-auto w-2/3 mt-3">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allTokensBalance.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/20"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      token.symbol === 'CHZ'
                        ? '/chiliz.png'
                        : `/clubs/${token.symbol.toLowerCase()}.png`
                    }
                    alt={token.symbol}
                    width={24}
                    height={24}
                  />
                  <span className="font-medium">{token.symbol}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold">{token.balance}</span>
                  <span className="text-sm text-muted-foreground">
                    ≈{' '}
                    {(
                      parseFloat(token.balance) *
                      (conversionRates[token.symbol] || 0)
                    ).toFixed(2)}
                    €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 w-1/2">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Total Value of My Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-3xl font-bold">
                {calculateTotalInEur().toFixed(2)}€
              </span>
              <span className="text-muted-foreground mt-2">
                Valeur totale estimée
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Staked tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              {totalStakedError ? (
                <div className="text-center">
                  <span className="text-lg font-bold text-red-500">Error</span>
                  <span className="text-sm text-muted-foreground mt-1 block">
                    {totalStakedError}
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-3xl font-bold">
                    {totalStakedData?.data?.totalStaked || '0'}
                  </span>
                  <span className="text-muted-foreground mt-2">
                    Total value of staked tokens
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
