import * as React from 'react';
import Deel from 'public/marketing/logos/deel.svg';
import Notion from 'public/marketing/logos/notion.svg';
import Resend from 'public/marketing/logos/resend.svg';
import Vercel from 'public/marketing/logos/vercel.svg';

import { BlurFade } from '@/components/marketing/fragments/blur-fade';
import { GridSection } from '@/components/marketing/fragments/grid-section';

const DATA = [
  { icon: Vercel },
  { icon: Deel },
  { icon: Resend },
  { icon: Notion }
];

export function Logos(): React.JSX.Element {
  return (
    <GridSection className="bg-diagonal-lines">
      <div className="flex flex-col items-center justify-between gap-2 bg-background p-8 sm:flex-row sm:py-4">
        <BlurFade className="mb-6 sm:mb-0">
          <p className="max-w-[220px] text-center text-sm text-muted-foreground sm:text-left">
            Trusted by fast-growing companies around the world
          </p>
        </BlurFade>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:max-w-4xl lg:gap-10">
          {DATA.map(({ icon: Icon }, index) => (
            <BlurFade
              key={index}
              delay={0.2 + index * 0.2}
              className="flex items-center justify-center text-neutral-700 dark:text-neutral-300"
            >
              <Icon className="h-6 w-auto" />
            </BlurFade>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
