'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { IconMenu2, IconX } from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll
} from 'framer-motion';
import { useTheme } from 'next-themes';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

import { Button } from './button';
import { Logo } from './logo';

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
  }[];
  visible: boolean;
}

export const Navbar = () => {
  const navItems = [
    {
      name: 'Home',
      link: '/#home'
    },
    {
      name: 'Product',
      link: '/#product'
    },
    {
      name: 'FAQ',
      link: '/#faq'
    }
  ];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className="fixed inset-x-0 top-2 z-50 w-full"
    >
      <DesktopNav
        visible={visible}
        navItems={navItems}
      />
      <MobileNav
        visible={visible}
        navItems={navItems}
      />
    </motion.div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const backgroundLight = visible
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(255, 255, 255, 0.7)';
  const backgroundDark = visible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)';

  return (
    <motion.div
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        backdropFilter: 'blur(16px)',
        background: isDark ? backgroundDark : backgroundLight,
        width: visible ? '38%' : '80%',
        height: visible ? '48px' : '64px',
        y: visible ? 8 : 0
      }}
      initial={{
        width: '80%',
        height: '64px',
        background: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)'
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30
      }}
      className={cn(
        'relative z-[60] mx-auto hidden flex-row items-center justify-between self-center rounded-full px-6 py-2 backdrop-saturate-[1.8] lg:flex'
      )}
    >
      <Logo />
      <motion.div
        className="flex-1 flex-row items-center justify-center space-x-1 text-sm lg:flex"
        animate={{
          scale: visible ? 0.9 : 1,
          justifyContent: visible ? 'flex-end' : 'center'
        }}
      >
        {navItems.map((navItem, idx) => (
          <motion.div
            key={`nav-item-${idx}`}
            onHoverStart={() => setHoveredIndex(idx)}
            className="relative"
          >
            <Link
              className={cn(
                'relative px-3 py-1.5 transition-colors',
                isDark ? 'text-white/90' : 'text-gray-700'
              )}
              href={navItem.link}
            >
              <span className="relative z-10">{navItem.name}</span>
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="menu-hover"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1.1,
                    background:
                      'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                      duration: 0.2
                    }
                  }}
                  transition={{
                    type: 'spring',
                    bounce: 0.4,
                    duration: 0.4
                  }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className="flex items-center gap-2">
        <AnimatePresence
          mode="popLayout"
          initial={false}
        >
          {!visible && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: {
                  duration: 0.2
                }
              }}
            >
              <Button
                as={Link}
                href="/auth/login"
                variant="primary"
                className="flex  w-20 items-center justify-center rounded-full sm:w-40"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <ThemeToggle className="ml-2" />
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const backgroundLight = visible
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(255, 255, 255, 0.7)';
  const backgroundDark = visible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)';

  return (
    <>
      <motion.div
        animate={{
          backdropFilter: 'blur(16px)',
          background: isDark ? backgroundDark : backgroundLight,
          width: visible ? '80%' : '90%',
          y: visible ? 0 : 8,
          borderRadius: open ? '24px' : 'full',
          padding: '8px 16px'
        }}
        initial={{
          width: '80%',
          background: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)'
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }}
        className={cn(
          'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-full border border-solid backdrop-saturate-[1.8] lg:hidden',
          isDark ? 'border-white/40' : 'border-black/40'
        )}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Logo />
          {open ? (
            <IconX
              className={isDark ? 'text-white/90' : 'text-black/90'}
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className={isDark ? 'text-white/90' : 'text-black/90'}
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -20
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }}
              className={cn(
                'absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-3xl px-6 py-8 backdrop-blur-xl backdrop-saturate-[1.8]',
                isDark ? 'bg-black/80' : 'bg-white/80'
              )}
            >
              {navItems.map(
                (navItem: { link: string; name: string }, idx: number) => (
                  <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'relative transition-colors',
                      isDark
                        ? 'text-white/90 hover:text-white'
                        : 'text-black/90 hover:text-black'
                    )}
                  >
                    <motion.span className="block">{navItem.name}</motion.span>
                  </Link>
                )
              )}
              <div
                className={cn(
                  'mt-4 border-t pt-4',
                  isDark ? 'border-white/20' : 'border-black/20'
                )}
              >
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
