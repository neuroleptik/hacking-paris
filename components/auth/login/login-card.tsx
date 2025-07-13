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

export function LoginCard(
  props: CardProps & { step: number }
): React.JSX.Element {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Click on the button below to connect your Chiliz wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ConnectChilizWallet step={props.step} />
      </CardContent>
    </Card>
  );
}
