import * as React from 'react';
import { type Metadata } from 'next';

import { AuthContainer } from '@/components/auth/auth-container';
import { LoginCard } from '@/components/auth/login/login-card';
import { auth } from '@/lib/auth';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Log in')
};

export default async function LoginPage(): Promise<React.JSX.Element> {
  const session = await auth();
  let step = 1;
  if (!session?.user?.email && !session?.user?.emailVerified) {
    step = 2;
  } else if (session?.user?.email && !session?.user?.emailVerified) {
    step = 3;
  }
  console.log(session);
  return (
    <AuthContainer maxWidth="sm">
      <LoginCard step={step} />
    </AuthContainer>
  );
}
