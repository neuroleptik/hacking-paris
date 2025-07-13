'use client';

import { useEffect, useState } from 'react';
import { ClockIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 5); // 5 days from now

  const difference = endDate.getTime() - new Date().getTime();

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

const END_DATE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

export const SeasonTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateTimer = () => {
    const now = Date.now();
    const diff = END_DATE.getTime() - now;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
  };

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full mb-4 w-2/3 mt-4 mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ClockIcon className="size-6" />
          The season ends in :
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <span className="text-3xl font-bold">{timeLeft.days}</span>
              <p className="text-sm text-muted-foreground">Days</p>
            </div>
            <div>
              <span className="text-3xl font-bold">{timeLeft.hours}</span>
              <p className="text-sm text-muted-foreground">Hours</p>
            </div>
            <div>
              <span className="text-3xl font-bold">{timeLeft.minutes}</span>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div>
              <span className="text-3xl font-bold">{timeLeft.seconds}</span>
              <p className="text-sm text-muted-foreground">Seconds</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
