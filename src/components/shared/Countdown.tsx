import {useEffect, useMemo, useState} from 'react';

type CountdownProps = {
  target: string;
};

function getTimeParts(target: string) {
  const difference = new Date(target).getTime() - Date.now();

  if (difference <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0};
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {days, hours, minutes, seconds};
}

export function Countdown({target}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeParts(target));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeParts(target));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target]);

  const items = useMemo(
    () => [
      {label: 'D', value: timeLeft.days},
      {label: 'H', value: timeLeft.hours},
      {label: 'M', value: timeLeft.minutes},
      {label: 'S', value: timeLeft.seconds},
    ],
    [timeLeft],
  );

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-[84px] flex-col rounded-[1.25rem] border border-white/12 bg-white/6 px-5 py-4 text-center backdrop-blur-sm"
        >
          <span className="font-display text-4xl leading-none text-white md:text-5xl">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.4em] text-white/55">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
