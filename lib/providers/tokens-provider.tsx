'use client';

import React, { createContext, useContext } from 'react';

interface Token {
  balance: string;
  symbol: string;
}

interface TokensContextType {
  tokens: Token[];
  tokenPools: TokenPool[];
  personalStakes: PersonalStake[];
}

interface TokenPool {
  address: string;
  symbol: string;
  balance: string;
}

interface PersonalStake {
  totalStaked: string;
  address: string;
}

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export function TokensProvider({
  children,
  initialTokens,
  initialTokenPools,
  initialPersonalStakes
}: {
  children: React.ReactNode;
  initialTokens: Token[];
  initialTokenPools: TokenPool[];
  initialPersonalStakes: PersonalStake[];
}) {
  return (
    <TokensContext.Provider
      value={{
        tokens: initialTokens,
        tokenPools: initialTokenPools,
        personalStakes: initialPersonalStakes
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokensContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokensProvider');
  }
  return context;
}
