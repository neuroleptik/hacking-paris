import React from 'react';
import Link from 'next/link';
import {
  IconBrandDiscord,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandTwitter
} from '@tabler/icons-react';

import { Logo } from './logo';

export function Footer() {
  const documentation = [
    { title: 'Getting Started', href: '#' },
    { title: 'API Reference', href: '#' },
    { title: 'Integrations', href: '#' },
    { title: 'Examples', href: '#' },
    { title: 'SDKs', href: '#' }
  ];

  const resources = [
    { title: 'Changelog', href: '#' },
    { title: 'Pricing', href: '#' },
    { title: 'Status', href: '#' },
    { title: 'Webhooks', href: '#' }
  ];

  const company = [
    { title: 'Blog', href: '#' },
    { title: 'Contact', href: '#' },
    { title: 'Customers', href: '#' },
    { title: 'Brand', href: '#' }
  ];

  const legal = [
    { title: 'Acceptable Use', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Terms of Service', href: '#' }
  ];

  const socials = [
    { title: 'Twitter', href: '#', icon: IconBrandTwitter },
    { title: 'Discord', href: '#', icon: IconBrandDiscord },
    { title: 'LinkedIn', href: '#', icon: IconBrandLinkedin },
    { title: 'Mastodon', href: '#', icon: IconBrandMastodon }
  ];

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden border-t border-white/[0.1] bg-black px-8 py-20">
      <div className="absolute bottom-full left-1/2 -mb-px flex h-8 -translate-x-1/2 items-end overflow-hidden">
        <div className="-mb-px flex h-[2px] w-56">
          <div className="blur-xs w-full flex-none [background-image:linear-gradient(90deg,rgba(255,255,255,0)_0%,#FFFFFF_32.29%,rgba(255,255,255,0.3)_67.19%,rgba(255,255,255,0)_100%)]" />
        </div>
      </div>

      <div className="mx-auto my-28 flex max-w-7xl flex-col justify-between text-sm text-neutral-400 md:px-8">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-10 md:mb-0">
            <Logo />
            <div className="mt-6 flex gap-3">
              {socials.map((social, idx) => (
                <SocialIcon
                  key={`social-${idx}`}
                  href={social.href}
                >
                  <social.icon
                    strokeWidth={1.5}
                    width={15}
                    height={15}
                  />
                </SocialIcon>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-20">
            <div className="flex flex-col space-y-4">
              <p className="font-semibold text-white">Documentation</p>
              <ul className="space-y-3">
                {documentation.map((item, idx) => (
                  <li key={`doc-${idx}`}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="font-semibold text-white">Resources</p>
              <ul className="space-y-3">
                {resources.map((item, idx) => (
                  <li key={`resource-${idx}`}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="font-semibold text-white">Company</p>
              <ul className="space-y-3">
                {company.map((item, idx) => (
                  <li key={`company-${idx}`}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <p className="font-semibold text-white">Legal</p>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={`legal-${idx}`}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SocialIconProps {
  href: string;
  children: React.ReactNode;
}

export function SocialIcon({ href, children }: SocialIconProps) {
  return (
    <Link
      href={href}
      className="relative flex size-10 items-center justify-center rounded-full border border-neutral-700/50 bg-transparent shadow-[2px_-2px_15px_rgba(0,0,0,0.2)] transition-all before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/10 before:to-transparent hover:bg-neutral-700/20 hover:shadow-[4px_-4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="flex size-5 items-center justify-center text-neutral-400 transition-colors hover:text-white">
        {children}
      </div>
    </Link>
  );
}
