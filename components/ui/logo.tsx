import * as React from 'react';
import { Swords } from 'lucide-react';

import { AppInfo } from '@/constants/app-info';
import { cn } from '@/lib/utils';

// The logo size below is 28px x 28px but in a 36px x 36px container.
// Because of the 8px difference the components <Sidebar /> and <Mobilesheet /> have a pl-0.5 (4px left padding) class applied.
// When you update the logo make sure to eventually adjust the pl-0.5 class in those two components.

export type LogoProps = React.HTMLAttributes<HTMLDivElement> & {
  hideSymbol?: boolean;
  hideWordmark?: boolean;
};

export function Logo({
  hideSymbol,
  hideWordmark,
  className,
  ...other
}: LogoProps): React.JSX.Element {
  return (
    <div
      className={cn('flex items-center space-x-1', className)}
      {...other}
    >
      {!hideSymbol && (
        <div className="flex size-9 items-center justify-center p-1">
          <div className="flex size-9 items-center justify-center text-primary">
            <Swords className="size-6" />
          </div>
        </div>
      )}
      {!hideWordmark && <span className="font-bold">{AppInfo.APP_NAME}</span>}
    </div>
  );
}
