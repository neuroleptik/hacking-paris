'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation, useInView } from 'framer-motion';

import { cn } from '@/lib/utils';

import { Button } from './button';

const BackgroundGrid = ({ className }: { className?: string }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 1 }
      });
    }
  }, [controls, inView]);

  return (
    <div
      ref={ref}
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={controls}
        className="absolute size-full"
        style={{
          background: `radial-gradient(circle at center, rgba(40,40,40,0.8) 0%, rgba(20,20,20,0.6) 30%, rgba(0,0,0,0.4) 70%)`
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}
        />
      </motion.div>
    </div>
  );
};

const LineGradient = ({ position }: { position: 'left' | 'right' }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: 'easeInOut' }
      });
    }
  }, [controls, inView]);

  const path =
    position === 'left'
      ? 'M1 0.23938V207.654L88 285.695C88 285.695 87.5 493.945 88 567.813'
      : 'M88 0.23938V207.654L1 285.695C1 285.695 1.5 493.945 1 567.813';

  return (
    <svg
      ref={ref}
      className={`absolute hidden lg:block ${position}-0 h-full`}
      xmlns="http://www.w3.org/2000/svg"
      width="89"
      height="568"
      viewBox="0 0 89 568"
      fill="none"
    >
      <motion.path
        d={path}
        stroke={`url(#animation_gradient)`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
      />
      <motion.path
        d={path}
        stroke={`url(#paint0_linear_${position})`}
      />
      <defs>
        <motion.linearGradient
          id="animation_gradient"
          initial={{
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
          }}
          animate={{
            x1: 0,
            y1: '120%',
            x2: 0,
            y2: '100%'
          }}
          transition={{
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 2
          }}
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor="#2EB9DF"
            stopOpacity="0"
          />
          <stop stopColor="#2EB9DF" />
          <stop
            offset="1"
            stopColor="#9E00FF"
            stopOpacity="0"
          />
        </motion.linearGradient>
        <linearGradient
          id={`paint0_linear_${position}`}
          x1={position === 'left' ? '1' : '88'}
          y1="4.50012"
          x2={position === 'left' ? '1' : '88'}
          y2="568"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor="#6F6F6F"
            stopOpacity="0.3"
          />
          <stop
            offset="0.797799"
            stopColor="#6F6F6F"
          />
          <stop
            offset="1"
            stopColor="#6F6F6F"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function CTA() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 }
      });
    }
  }, [controls, inView]);

  return (
    <div className="relative mx-auto flex min-h-[80vh] w-full max-w-7xl items-center justify-center bg-black px-4 sm:px-6 md:min-h-dvh lg:px-8">
      <LineGradient position="left" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="relative z-10 mx-auto w-full max-w-4xl py-8 pb-16 text-center md:py-12 md:pb-32 lg:py-20 lg:pb-48"
      >
        <div className="relative z-20">
          <h2
            className={cn(
              'inline-block text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl',
              'bg-gradient-to-b from-[#3B3B3B] via-[#FFFFFF] to-[#3B3B3B]',
              'bg-clip-text text-transparent',
              'px-4 md:px-8'
            )}
          >
            Unite with Your Club
          </h2>
          <p className="mx-auto my-4 max-w-lg px-4 text-center text-xs text-neutral-400 sm:text-sm md:my-6 md:text-base lg:my-8">
            Join thousands of fans staking tokens, climbing rankings, and
            competing for glory. Your club needs you in the War Club arena.
          </p>
        </div>
        <BackgroundGrid className="z-0 mt-8 md:mt-16 lg:mt-36" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-20"
        >
          <Button
            as={Link}
            href="/auth/login"
            className="h-10 w-32 rounded-full text-xs font-medium sm:text-sm md:h-12 md:w-40 md:text-base lg:h-16 lg:w-48"
          >
            Get Started Now
          </Button>
        </motion.div>
      </motion.div>
      <LineGradient position="right" />
    </div>
  );
}
