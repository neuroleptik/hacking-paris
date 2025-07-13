'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export function Testimonials() {
  return (
    <div
      id="testimonials"
      className="mx-auto my-20 w-full max-w-7xl px-4 py-20 lg:px-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Title Section - 40% */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-20">
            <h2
              className={cn(
                'bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] text-center text-3xl md:text-6xl lg:text-left ',
                'bg-clip-text leading-tight text-transparent'
              )}
            >
              What fans <br />
              say about us
            </h2>
            <p className="mx-auto mt-6 max-w-sm text-center text-sm text-neutral-400 lg:mx-0 lg:text-left">
              Hear from passionate fans who are already staking tokens and
              competing for their favorite clubs on War Club.
            </p>
          </div>
        </div>

        {/* Right Testimonials Section - 60% */}
        <div className="mx-auto grid w-full grid-cols-1 gap-8 md:w-3/5 lg:grid-cols-2">
          <TestimonialCard
            name="Sarah Johnson"
            role="PSG Fan"
            image="/manu_arora.jpg"
            quote="War Club has revolutionized how I support PSG. Staking tokens with other fans and climbing the rankings together is incredible!"
          />
          <TestimonialCard
            name="Michael Chen"
            role="Barcelona Supporter"
            image="/kishore_gunnam.jpg"
            quote="Our organization has boosted Barcelona's ranking significantly. The competitive aspect makes being a fan even more exciting."
            className="lg:mt-[50px]"
          />
          <TestimonialCard
            name="Emma Davis"
            role="Manchester United Fan"
            image="/kishore_gunnam.jpg"
            quote="I love how War Club connects fans worldwide. The league system and rewards make supporting my club more rewarding than ever."
            className="lg:mt-[-50px]"
          />
          <TestimonialCard
            name="David Rodriguez"
            role="Real Madrid Fan"
            image="/manu_arora.jpg"
            quote="Joining a fan organization was the best decision. We've helped Real Madrid climb several tiers and unlocked amazing rewards."
          />
        </div>
      </div>
    </div>
  );
}

const TestimonialCard = ({
  name,
  role,
  image,
  quote,
  className
}: {
  name: string;
  role: string;
  image: string;
  quote: string;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'flex h-96 flex-col rounded-[17px] p-8',
        'border border-[#474747]',
        'bg-white bg-[linear-gradient(178deg,#2E2E2E_0.37%,#0B0B0B_38.61%),linear-gradient(180deg,#4C4C4C_0%,#151515_100%),linear-gradient(180deg,#2E2E2E_0%,#0B0B0B_100%)]',
        'relative isolate',
        className
      )}
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="relative size-14 overflow-hidden rounded-full border-2 border-neutral-700">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-neutral-400">{role}</p>
        </div>
      </div>
      <p className="text-lg leading-relaxed text-neutral-300">
        &quot;{quote}&quot;
      </p>
    </motion.div>
  );
};
