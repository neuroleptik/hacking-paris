'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { IconArrowRight } from '../icons/arrow-right';

const FAQs = [
  {
    question: 'What is Club War and how does it work?',
    answer:
      'Club War is a community platform where fans stake tokens of their favorite clubs via the Chiliz blockchain. Clubs compete in worldwide rankings with leagues and tiers, and fans can join organizations to maximize their impact.'
  },
  {
    question: 'How do I start staking tokens for my club?',
    answer:
      "Simply create an account, select your favorite club, and begin staking tokens. You can join or create organizations with other fans to increase your collective staking power and boost your club's ranking."
  },
  {
    question: 'What are fan organizations and how do they work?',
    answer:
      "Fan organizations are groups of supporters who join forces to maximize their club's token staking power. By working together, organizations can significantly boost their club's ranking and unlock better rewards."
  },
  {
    question: 'How do club rankings and leagues work?',
    answer:
      'Clubs compete in a dynamic ranking system with multiple leagues and tiers. The more tokens staked by fans, the higher your club climbs. Rankings are updated regularly based on fan support and token activity.'
  },
  {
    question: 'What happens to tokens at the end of the season?',
    answer:
      'At season end, clubs can choose to burn a portion of their tokens to create scarcity and boost token value. This creates a virtuous cycle benefiting fans, clubs, and the entire Chiliz ecosystem.'
  }
];
export function FrequentlyAskedQuestions() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div
      id="faq"
      className="mx-auto my-10 w-full max-w-7xl px-4 py-10 md:my-20 md:px-8 md:py-20"
    >
      <div className="relative z-20 mx-auto mb-4 max-w-4xl text-balance text-center">
        <h2
          className={cn(
            'inline-block text-3xl text-black dark:text-white md:text-6xl'
          )}
        >
          Let&apos;s Answer Your Questions
        </h2>
      </div>
      <p className="mx-auto mt-4  max-w-lg px-4 text-center text-sm text-neutral-400 md:px-0">
        Everything you need to know about Club War, token staking, and competing
        for your favorite clubs.
      </p>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-neutral-800 md:mt-20">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <motion.div
      className="cursor-pointer py-4 md:py-6"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="pr-8 md:pr-12">
          <h3 className="text-base font-medium text-neutral-200 md:text-lg">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-2 overflow-hidden text-sm text-neutral-400 md:text-base"
              >
                <p>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mr-2 mt-1 size-5 shrink-0 md:mr-4 md:size-6">
          <motion.div
            animate={{
              scale: isOpen ? [0, 1] : [1, 0, 1],
              rotate: isOpen ? 90 : 0,
              marginLeft: isOpen ? '1.5rem' : '0rem'
            }}
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowRight className="text-white-500 absolute inset-0 size-5 md:size-6" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
