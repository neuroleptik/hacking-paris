'use client';

import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@/components/ui/card';

import ConnectChilizWallet from '../connect-chiliz-wallet';

export function LoginCard(props: CardProps): React.JSX.Element {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Enter your details below to sign into your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ConnectChilizWallet />
      </CardContent>
    </Card>
  );
}
