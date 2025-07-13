import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

import { Logo } from '@/components/ui/logo';
import { Routes } from '@/constants/routes';

const containerVariants = cva('mx-auto w-full min-w-[360px] space-y-6', {
  variants: {
    maxWidth: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    }
  },
  defaultVariants: {
    maxWidth: 'sm'
  }
});

export type AuthContainerProps = React.PropsWithChildren &
  VariantProps<typeof containerVariants>;

export function AuthContainer({
  maxWidth,
  children
}: AuthContainerProps): React.JSX.Element {
  return (
    <div className={containerVariants({ maxWidth })}>
      <Link
        href={Routes.Root}
        className=""
      >
        <Logo className="cursor-pointer justify-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out  hover:border-gray-300 hover:shadow-lg" />
      </Link>
      {children}
    </div>
  );
}
