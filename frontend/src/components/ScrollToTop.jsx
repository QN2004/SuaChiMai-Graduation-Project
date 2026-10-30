import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, key } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const startY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (startY <= 0) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const duration = 520;
    const startedAt = window.performance.now();
    let frameId;

    const animateScroll = (currentTime) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, Math.round(startY * (1 - easedProgress)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateScroll);
      }
    };

    frameId = window.requestAnimationFrame(animateScroll);
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, search, key]);

  return null;
}
