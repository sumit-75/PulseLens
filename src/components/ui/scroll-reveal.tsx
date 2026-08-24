'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  direction = 'up',
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getDirectionClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'opacity-0 translate-y-8';
        case 'down':
          return 'opacity-0 -translate-y-8';
        case 'left':
          return 'opacity-0 translate-x-8';
        case 'right':
          return 'opacity-0 -translate-x-8';
        case 'none':
          return 'opacity-0 scale-95';
        default:
          return 'opacity-0 translate-y-8';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        'transition-all duration-700 ease-out will-change-[opacity,transform]',
        getDirectionClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
