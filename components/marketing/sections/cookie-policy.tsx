import * as React from 'react';
import { BookIcon, CookieIcon, ScaleIcon } from 'lucide-react';

import { GridSection } from '@/components/marketing/fragments/grid-section';
import { SiteHeading } from '@/components/marketing/fragments/site-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DATA_CARDS = [
  {
    title: 'What are Cookies?',
    icon: <CookieIcon className="size-4 shrink-0" />,
    content:
      'Cookies are small text files stored on your device that help us improve your experience by remembering preferences.'
  },
  {
    title: 'Types of Cookies',
    icon: <BookIcon className="size-4 shrink-0" />,
    content:
      'We use both session and persistent cookies to track user activity and enhance site functionality.'
  },
  {
    title: 'Managing Cookies',
    icon: <ScaleIcon className="size-4 shrink-0" />,
    content:
      'You can control cookie settings in your browser. However, disabling cookies may impact your experience on our site.'
  }
];

const DATA_ACCORDION = [
  {
    title: 'Cookies We Use',
    content:
      'We use cookies for functionality (e.g., login sessions), performance (e.g., analytics), and advertising (e.g., targeted ads).'
  },
  {
    title: 'Third-Party Cookies',
    content:
      'We may allow third-party services (such as Google Analytics) to place cookies on your device for specific purposes.'
  },
  {
    title: 'How to Manage Cookies',
    content:
      'You can adjust cookie settings in your browser. For more detailed instructions, refer to your browser’s help guide.'
  },
  {
    title: 'Changes to Our Cookie Policy',
    content:
      'We may update this Cookie Policy from time to time. Any changes will be posted on this page.'
  }
];

export function CookiePolicy(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-16 py-20">
        <SiteHeading
          badge="Legal"
          title="Cookie Policy"
          description="Learn how we use cookies and similar technologies to improve your experience on our platform."
        />
        <Alert
          variant="warning"
          className="rounded-lg border border-yellow-500 dark:border-yellow-900"
        >
          <AlertDescription className="ml-3 text-base">
            This policy provides a general framework. It should be reviewed and
            customized by a legal professional to suit your jurisdiction and use
            case.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DATA_CARDS.map((item, index) => (
            <Card
              key={index}
              className="border-none dark:bg-accent/40"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.icon}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Accordion
          type="single"
          collapsible
        >
          {DATA_ACCORDION.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger className="flex items-center justify-between text-lg font-medium">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div>
          <CardTitle className="text-lg text-primary">
            Contact Information
          </CardTitle>
          <p className="text-sm leading-relaxed">
            For questions or concerns, contact us at:
            <br />
            <a
              href="mailto:support@yourdomain.com"
              className="text-blue-500 hover:underline"
            >
              support@yourdomain.com
            </a>
          </p>
        </div>
      </div>
    </GridSection>
  );
}
