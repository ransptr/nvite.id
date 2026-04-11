import {cn} from '@/src/lib/utils';

type MarqueeProps = {
  text: string;
  className?: string;
  muted?: boolean;
};

export function Marquee({text, className, muted = false}: MarqueeProps) {
  const items = Array.from({length: 8}, () => text);

  return (
    <div className={cn('marquee-shell', className)}>
      <div className={cn('marquee-track', muted && 'opacity-35')}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            * {item}
          </span>
        ))}
      </div>
    </div>
  );
}
