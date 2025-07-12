'use client';

import React, { createContext, useContext } from 'react';

interface Token {
  balance: string;
  symbol: string;
}

interface TokensContextType {
  tokens: Token[];
  tokenPools: TokenPool[];
}

interface TokenPool {
  address: string;
  symbol: string;
  balance: string;
}

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export function TokensProvider({
  children,
  initialTokens,
  initialTokenPools
}: {
  children: React.ReactNode;
  initialTokens: Token[];
  initialTokenPools: TokenPool[];
}) {
  return (
    <TokensContext.Provider
      value={{ tokens: initialTokens, tokenPools: initialTokenPools }}
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
