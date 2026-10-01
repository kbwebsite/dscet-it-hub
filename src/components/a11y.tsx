// Shared accessibility primitives — Escape-to-close and focus trapping
// for every modal surface (search, lightbox, calendar details, drawers).
import { useEffect, useRef, type ReactNode } from 'react';

export function useEscapeKey(onClose: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, active]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FocusTrap({ children, className, onEscape }: {
  children: ReactNode; className?: string; onEscape?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<Element | null>(null);
  useEscapeKey(() => onEscape?.(), !!onEscape);
  useEffect(() => {
    prev.current = document.activeElement;
    const el = ref.current;
    const scope = el?.parentElement ?? el;
    const first = scope?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el)?.focus({ preventScroll: true });
    const fn = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !scope) return;
      const items = Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter(i => i.offsetParent !== null || i === document.activeElement);
      if (items.length === 0) { e.preventDefault(); return; }
      const firstI = items[0], lastI = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstI) { e.preventDefault(); lastI.focus(); }
      else if (!e.shiftKey && document.activeElement === lastI) { e.preventDefault(); firstI.focus(); }
    };
    document.addEventListener('keydown', fn);
    return () => {
      document.removeEventListener('keydown', fn);
      (prev.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
